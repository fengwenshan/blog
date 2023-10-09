# 模板编译

Vue内部模板编译是一项比较重要的技术。模板最终会通过编译转换成渲染函数，渲染函数作用是每次执行，就会使用当前最新状态生成一份vnode, 用于虚拟DOM渲染。所以模板编译是配合虚拟dom进行渲染。

将模板编译成渲染函数可以分为两个步骤，先将模板解析成ast, 然后再使用ast生成渲染函数。但是静态节点不需要重新渲染，所以在生成ast之后，生成渲染函数之前这个阶段，需要遍历ast给所有静态节点做标记，这样虚拟DOM中更新节点时，如果发现节点有这个标记，就不会重新渲染，所以模板编译可以分为3部分：

- 解析器：将模板解析为ast
- 优化器：遍历ast标记静态节点
- 代码生成器：使用ast生成渲染函数


## 模板解析器

```ts
import { parseText } from './parse-text';
import type { ParseHTMLOptionsType, ASTElement, ASTElementAttr } from './type';

// 注释标签正则
const comment = /^<!\--/;
// <![if !IE]> 
// <!--[if !IE]--> 
// const conditionalComment = /^<!\[/;
// 用于匹配 Unicode 字符集范围内的字符。这个正则表达式包含了多个 Unicode 范围，以支持匹配不同语言的字符
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
// 用于匹配 XML 或 HTML 中的名称（Name）标识符。这个正则表达式使用了 unicodeRegExp 作为子表达式，以支持更广泛的字符范围，并且名称必须以字母或下划线开头，后面可以包含字母、数字、下划线、连字符和其他支持的 Unicode 字符。
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
// 用于匹配 XML 或 HTML 中的限定名（Qualified Name）。这个正则表达式使用了 ncname 作为子表达式，以匹配标签名称（带有命名空间前缀，例如 namespace:tag 格式）
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 用于匹配 XML 或 HTML 中的开始标签的开头部分。这个正则表达式使用了 qnameCapture 作为子表达式，以匹配标签的名称。
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 标签匹配右半部分
const startTagClose = /^\s*(\/?)>/;
// 是用于处理 Vue 模板编译时动态绑定属性的正则表达式
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 标签中的 属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);


export function createASTElement(tag: string, attrs: ASTElementAttr[], parent?: ASTElement): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    parent,
    children: []
  };
}

export function parse(template: string): ASTElement | null {
  const stack: ASTElement[]  = [];
  let root: ASTElement | null = null;
  // parseHTML(template) 裁切html, options配合stack组装成ast
  // 裁切html, 碰到开始标签options.start 组装ast就进栈，结束标签options.end出栈
  // 文本、注释元素组装ast直接放入子元素中
  // 父元素，在标签结束时，拿取栈中最后一个就是
  parseHTML(template, {
    start(tagName: string, attrs: ASTElementAttr[]) {
      const element = createASTElement(tagName, attrs);
      if(!root) {
        root = element;
      }
      stack.push(element);
    },
    end(tagName: string) {
      const lastElement = stack.pop();
      if(lastElement?.tag !== tagName) {
        throw new Error('标签闭合有误');
      } else if(lastElement){
        const parent = stack[stack.length - 1];
        if(parent) {
          lastElement.parent = parent;
          parent.children?.push(lastElement);
        }
      }

    },
    chars(text: string) {
      const t = text.replace(/\s/g, '');
      if(t) {
        const stackLast = stack[stack.length - 1];
        const res = parseText(text);
        if(res) {
          stackLast.children?.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text,
            parent: stackLast
          });
        } else {
          // parent, 最后一个元素里面push进入文本
          stackLast.children?.push({
            type: 3,
            text,
            parent: stackLast
          });
        }
      }
    },
    comment(text: string) {
      const stackLast = stack[stack.length - 1];
      stackLast.children?.push({
        type: 3,
        text,
        isComment: true,
        parent: stackLast
      });
    }
  });
  return root;
}

function parseHTML(template: string, options: ParseHTMLOptionsType) {
  // 模板内容
  let html = template;
  // 裁切的位置开始
  let index = 0;
  while(html) {
    let textEnd = html.indexOf('<');
    if(textEnd === 0) {
      // Comment

      if( comment.test(html) ) {
        const commentEnd = html.indexOf('-->');
        if(commentEnd >= 0) {
          options.comment(html.substring(4, commentEnd));
          advance(commentEnd + 3);
          continue;
        }
      }
      // End tag:
      const endTagMatch = html.match(endTag);
      if(endTagMatch) {
        advance(endTagMatch[0].length);
        options.end(endTagMatch[1]);
        continue;
      }
      // Start Tag
      // 可能是注释、可能是条件判断]>、可能是Doctype、也可能是EndTag、也可能是开始标签
      // 进一步判断标签的开始
      parseStartTag();
      // handleStartTag 校验操作
      continue;
    }
    // 解析文本 可能文本开始就是<开头，但是上面有没有匹配成功
    let rest: string | null = null;
    let text: string | null = null;
    let next: number | null = null;
    if(textEnd >= 0 ) {
      // 尖括号后面的内容
      // slice 不会修改原有字符串，会返回修改后的字符串
      rest = html.slice(textEnd);
      while(
        !endTag.test(rest) && // 不是开始标签
        !startTagOpen.test(rest) && // 不是结束标签，不是注释标签，不是条件判断标签
        !comment.test(rest)
        ) { // 那就继续向下找, 要从第一个位置开始找，因为0位置是<
        next = rest.indexOf('<', 1);
        // 没有找到直接跳出
        if(next < 0) break;
        // 移动光标
        textEnd += next;
        rest = html.slice(textEnd);
      }
      text = html.substring(0, textEnd);
    }
    // 模板开始查找没有找到 < 开始，就说明整个都是文本
    if(textEnd < 0) {
      text = html;
    }
    if(text) {
      advance(text.length);
      options.chars(text);
    }
  }
  function advance(n: number) {
    html = html.slice(n);
    index += n;
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    if(start) {
      const match = {
        tagName: start[1],
        attrs: [] as { name: string, value: any }[],
        start: index,
        end: null as number | null
      };
      advance(start[0].length);
      // 处理属性
      let attr: RegExpMatchArray | null = null ;
      let end: RegExpMatchArray | null = null;
      while(
        // 匹配到标签关闭标签就跳出
      !(end = html.match(startTagClose))
      &&
      // 匹配到属性
      (attr = html.match(dynamicArgAttribute) || html.match(attribute))
        ) {
        // [ "id='app', 'id', '=', 'app', undefined, undefined, groups, index, input: '...'"]
        // console.log(attr);
        match.attrs.push({
          name: attr[1],
          // 匹配双引号，匹配单引号，匹配没有引号
          value: attr[3] || attr[4] || attr[5]
        });
        advance(attr[0].length);
      }
      // 匹配到结束 > 表示符号跳出来
      if(end) {
        const len = end[0].length;
        match.end = index + len;
        options.start(match.tagName, match.attrs);
        advance(len);
        return match;
      }
    }
  }
}

```

### 动态文本解析

```ts
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parseText(text: string) {
  if(defaultTagRE.test(text)) {
    // abc{{ name }}def => tokens: ['abc', { '@binding: '_s(name)' }, 'def'],
    // expression: "'abc'+_s(name)+'def'",
    const tokens = [];
    const rawTokens =  [];
    // 解决exec的bug, defaultTagRE.lastIndex 不会重置问题
    let lastIndex = defaultTagRE.lastIndex = 0;
    let match: RegExpExecArray | null = null, 
      // 第几个位置开始匹配到了
      index: number | null = null, 
      // 匹配到了，把匹配前面静态文本裁剪下来
      tokenValue: string | null = null;
    // exec 自动会匹配下一个{{}}
    while( (match = defaultTagRE.exec(text) ) ) {
      // [ 0: "{{ count }}", 1: " count ", groups: undefined, index: 6, input: " 计数开始 {{ count }} " ]
      index = match.index;
      if(index > lastIndex) {
        tokenValue = text.slice(0, index);
        rawTokens.push(tokenValue);
      }
      const exp = match[1].trim();
      tokens.push(`_s(${ exp })`);
      rawTokens.push({ '@binding': exp });
      // 匹配到第一个
      lastIndex = index + match[0].length;
    }
    // lastIndex 最后}}出现的地方的索引, 后面的纯文本内容就进行json化
    if(lastIndex < text.length) {
      tokenValue = text.slice(lastIndex);
      rawTokens.push(tokenValue);
      tokens.push(JSON.stringify(tokenValue));
    }

    return {
      expression: tokens.join('+'),
      tokens: rawTokens
    };
  }
}
```

## 优化器

优化器作用是在ast中找出静态子树并打上标记。静态子树指那些在ast中永远都不会发生变化的节点。

标记静态子树好处有：每次重新渲染时，不需要为静态子树创建新节点；在虚拟dom中打补丁（patching）的过程可以跳过。

每次重新渲染都会使用最新状态生成一份全新的VNode与oldVNode进行对比。而在生成VNode的过程中，如果发现一个节点被标记为静态子树，那么除了首次渲染会生成节点外，在重新渲染时并不会生成新的子节点树，而是克隆已存在的静态静态子树。

优化器内部实现步骤：在AST中找出所有静态节点并打上标记；在AST中找出所有静态根节点并打上标记。先标记静态节点，然后标记静态根节点

```ts
import { ASTNode, ASTElement } from './type';
import { isReservedTag } from '@/shared/dom';

// 判断是否是模板的子级
function isDirectChildOfTemplateFor (node: ASTElement): boolean {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') return false;
    if (node.for) return true;
  }
  return false;
}

function isStatic(nodeDes: ASTNode) {
  // 动态文本 expression
  if(nodeDes.type === 2) return false;
  // 静态文本 text, v-pre
  if(nodeDes.type === 3 || nodeDes.pre) return true;
  // 动态属性
  return !!(!nodeDes.hasBindings &&
    // v-if, v-for, 
    !nodeDes.if && !nodeDes.for &&
    // 不是内置标签
    !['component', 'slot'].includes(nodeDes.tag || '') &&
    // 不是组件
    isReservedTag(nodeDes.tag) &&
    // 
    isDirectChildOfTemplateFor(nodeDes)
  );
}

// 标记静态节点
function markStatic(nodeDes: ASTNode) {
  nodeDes.static = isStatic(nodeDes);
  // 元素节点
  if(nodeDes.type === 1) {
    nodeDes.children?.forEach(child => {
      // 递归一次子节点
      markStatic(child);
      // 只要子节点不是静态节点，就标记上面静态父节点为false
      if(!child.static) nodeDes.static = false;
    });
  }
}

// 标记静态根节点
// 如果探索到一层节点是静态节点，那么就停止递归
function markStaticRoots(nodeDes: ASTNode) {
  if(nodeDes.type === 1) {

    if(nodeDes.static || nodeDes.once) nodeDes.staticInFor = false;
    // 要使节点符合静态根节点的要求，必须有子节点
    // 这个子节点不能是只有一个静态文本的子节点，否则优化成本将超过收益

    // 如果节点是静态节点，并且有子节点，并且子节点不是只有一个文本类型的节点，那么该节点是静态根节点， 否则就不是静态根节点
    // 这个结论之所以成立，因为如果当前节点是静态节点，就能说明节点的子节点也是静态节点。
    // 同时又排除：如果静态节点没有子节点，那么它不是静态根节点；如果静态节点只有一个文本节点，那么它也不是静态根节点
    if(
      nodeDes.static &&
      !(nodeDes.children?.length === 1 && nodeDes.children[0].type === 3 )
    ) {
      nodeDes.staticRoot = true;
      return;
    } else {
      nodeDes.staticRoot = false;
    }
    // 递归，如果当前节点已经被标记为静态根及诶点，将不会再处理子节点。只有当前不是静态根节点，才会继续向子节点中查找静态根节点
    nodeDes.children?.forEach(item => {
      markStaticRoots(item);
    });
  }
}

export function optimize(ast: ASTNode) {
  // 标记所有静态节点
  markStatic(ast);
  // 标记所有静态根节点
  markStaticRoots(ast);
}

function optimize(ast: ASTElement) {
  // 标记所有静态节点
  markStatic(root)
  // 标记所有静态根节点
  markStaticRoots(root, false)
}
export function compileToFunctions(template: string) {
  // 解析器
  const ast = parse(template);
  // 优化器
  optimize(ast)
}
```

## 代码生成器

观察下面生成后的字符串，会发现，这其实就是嵌套函数调用。函数`_c`(`createElement的别名`)的参数中执行`_v`,而函数_v的参数中又执行函数`_s`。

createElement是虚拟DOM中所提供的方法，作用是创建虚拟节点，有以下三个参数：

- 标签名
- 模板标签相关属性数据对象
- 子节点列表

调用createElement就能得到一个VNode，这也就是渲染函数可以生产VNode的原因：渲染函数其实是执行createElement,而createElement可以创建一个VNode。

```html
<div id="app">
  hello {{ name }}
</div>

<!-- 转换成下面这种形式
    "with(this){ return _c('div', { attrs: { 'id': 'app'} }, [_v('hello ' + _s(name)) ])}'
-->
```

生成代码字符串是一个递归过程，从顶向下依次处理每个AST节点。节点类型：分别对应三种不同的创建方法与别名：`createElement 别名 _c`、`createTextVNode 别名 _v`、`createEmptyVNode 别名 _e`

格式：`_c(<tagname>, ?<data>, <children>)`


```ts
import type { ASTElement, ASTElementAttr, ASTExpression, ASTNode, ASTText   } from './type';

function genProps(props: ASTElementAttr[]) {
  let staticProps = '';
  let dynamicProps = '';
  props.forEach(prop => {
    const { dynamic, value, name } = prop;
    if (dynamic) {
      dynamicProps += `${name},${value},`;
    } else {
      staticProps += `"${name}":${JSON.stringify(value)},`;
    }
  });
  // // 裁剪最后一个逗号
  staticProps = `{${staticProps.slice(0, -1)}}`;

  if (dynamicProps) {
    return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`;
  } else {
    return staticProps;
  }

}
// 处理属性之类的东西
function genData(el: ASTElement) {
  let data = '{';

  if(el.key) data += `key:${el.key}`;
  if(el.attrsList) data += `attrs: ${ genProps(el.attrsList) }`;
  data = data.replace(/,$/, '') + '}';
  return data;
}

export function genComment (comment: ASTText): string {
  return `_e(${JSON.stringify(comment.text)})`;
}

export function genText (text: ASTText | ASTExpression): string {
  return `_v(${text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : JSON.stringify(text.text)
  })`;
}

function genNode(node: ASTNode) {
  if (node.type === 1) {
    return genElement(node);
  } else if (node.type === 3 && node.isComment) {
    return genComment(node);
  } else {
    return genText(node);
  }
}
function genChildren(el: ASTElement): string {
  const children = el.children;
  return (children || [])?.map(child => genNode(child)).join(',');
}

function genElement(el: ASTElement) {
  const data = el.plain ? undefined : genData(el);
  const children = genChildren(el);
  return `_c('${el.tag}'${data ? ',' + data : ''}${ children ? ',' + children : ''})`;
}

export function generate(ast: ASTElement) {
  // 处理元素节点
  const code = genElement(ast);

  return {
    render: `
      with(this) {
        return  ${code}
      }
    `
  };
}

export function compileToFunctions(template: string) {
  // 解析器
  const ast = parse(template)!;
  // 优化器： 添加静态节点与静态根节点标识
  optimize(ast);
  // 代码生成器：
  const { render } = generate(ast);
  return {
    ast,
    render: new Function(render),
  };
}
```



