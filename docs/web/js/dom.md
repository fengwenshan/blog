# DOM

文档对象模型（DOM, Document Object Model）是HTML和XML文档的编程接口。DOM表示由多层节点构成的文档，通过它可以添加、删除和修改文档的内容。

## 节点层级

任何HTML或XML元素，可以用DOM表示为一个由节点构成的层级结构。节点也分为很多类型，每种类型对应文档中不同的信息，都有自己不同的特性、数据和方法。

```html
<!doctype html>
<html lang="zh-cn">
<head>
   <title>Document</title>
</head>
<body>
  <p>hello Dom</p>
</body>
</html>
```

dom将html表示为标签的树形结构

![](./img/dom-tree.png)

顶级document节点表示每个文档的根节点。根节点下面唯一的子节点html元素，也叫文档元素。所有其他元素都存在文档元素之内。每个文档也只有一个文档元素。在HTML中文档元素始终是html元素。在XML文档中则没有这样的预定义元素，任何元素都可能成为文档元素。
在html中每段标记都可以表示为这个树形结构中的一个节点。元素节点表示html元素，属性节点表示属性，文档节点表示文档类型，注释节点表示注释。DOM中总共12种节点类型，这些类型都继承一种基本类型。


### Node 类型

DOM Leve1描述Node接口，这个接口是所有DOM节点都必须实现的。它在JS中被定义为Node类型，被所有节点类型继承，因此所有类型都共享相同的基本属性和方法（和Flutter的Widget想同）。除了IE之外的所有浏览器都可以直接访问这个类型。

每个节点都有NodeType属性，表示该节点类型，由12个数值常量表示：

- Node.ELEMENT_NODE（1）元素节点
- Node.ATTRIBUTE_NODE（2）属性节点
- Node.TEXT_NODE（3）文本节点
- Node.CDATA_SECTION_NODE（4）CDATA节点
- Node.ENTITY_REFERENCE_NODE（5）实体引用节点
- Node.ENTITY_NODE（6）实体节点
- Node.PROCESSING_INSTRUCTION_NODE（7）处理指令节点
- Node.COMMENT_NODE（8）注释节点
- Node.DOCUMENT_NODE（9）文档节点
- Node.DOCUMENT_TYPE_NODE（10）文档类型节点
- Node.DOCUMENT_FRAGMENT_NODE（11）文档片段节点
- Node.NOTATION_NODE（12）符号节点

但是浏览器并不支持所有节点类型，开发者最常使用元素节点、文本节点、属性节点、注释节点。

元素节点的nodeName始终是tagName, nodeValue始终是null。

- **1. 节点关系**

文档中所有的节点都与其他节点存在关系。这些关系可以形容为家族关系，相当于把文档树比作家谱。所以说所有节点的顶级节点都是html元素，所有节点都有children属性，表示其子节点。

它和children属性的区别在于：

- children属性只返回直接子节点，而childNodes属性返回所有子节点，包含换行符、空格等空白字符。
- children属性是数组，而childNodes属性是类数组对象（NodeList的实例），可以直接使用数组方法，比如forEach、map、filter等。
- NodeList对象的独特地方在于它是动态的，即可以随时添加或删除子节点（它是dom结构的查询，因此DOM结构发生变化时，NodeList也会随之变化）。

```javascript
const $firstNode = app.childNodes[0];
// 或者
const $firstNode_1 = app.childNodes.item(1);
// 类数组转数组 Array.from()
const nodeArr = Array.prototype.slice.call(someNode.childNodes, 0)
```

每个节点都有parentNode属性，指向其DOM树中的父元素。childNodes中所有节点都有一个共同父元素，因此它们parentNode属性都指向同一节点。此外childNodes列表中的每个节点都是同一列表中其他节点的同胞节点，使用previousSibling和nextSibling可以访问同一列表中的前一个或后一个节点,如果子节点只有一个，那么previousSibling和nextSibling都指向null。

```TypeScript
// 访问父节点
const app: ParentNode = app.childNodes[1].parentNode;

const appChildNode: NodeListOf<ChildNode> = app.childNodes;
// 获取子节点相邻上一个节点
const pre: ChildNode | null = appChildNode[1].previousSibling;
// 获取子节点相邻下一个节点
const next: ChildNode | null = appChildNode[1].nextSibling;
// 获取第一个节点 
const first: ChildNode | null = app.childNodes[0]
const first_1: ChildNode | null = app.firstChild;

// 获取最后一个节点: Element | null
const last: ChildNode | null = app.childNodes[app.childNodes.length - 1]
const last_1: ChildNode | null = app.lastChild;

// 判断是否有子节点，相比查询childNodes.length方便很多
if(app.hasChildNodes()) {
    const last: ChildNode = app.lastChild;
}

// 获取整个文档节点的指针
console.log(app.ownerDocument) // 返回整个文档
console.log(document.ownerDocument) // null
```

- **2. 节点增删改**


### Document类型

### Element类型

### Text 类型

### Comment类型

### CDATASection类型

### DocumentType类型

### DocumentFragment类型

## DOM编程

## MutationObserver



