import type { RspressPlugin } from "@rspress/core";
import remarkMath  from 'remark-math';
import rehypeKatex  from 'rehype-katex';
import { visit } from 'unist-util-visit';
import type { Options as RemarkMathOptions } from 'remark-math';
import type { Options as RehypeKatexOptions } from 'rehype-katex';
import { createRequire } from 'node:module';


import type { Plugin } from 'unified';

export type RspressPluginKatexOptions = RemarkMathOptions & RehypeKatexOptions

export interface RspressKatexOptions {
  enableInMdx?: boolean;
  macros?: Record<string, string>;
}

const require = createRequire(import.meta.url);


const remarkCodeBlockToMath: Plugin = () => {
  return (tree) => {
    visit(tree, 'code', (node: any) => {
      if (node.lang === 'math') {
        node.data = {
          hName: 'div',
          hProperties: { className: ['math', 'math-display'] },
        };
        delete node.lang;
        delete node.meta;
      }
    });
  };
};

export function rspressPluginKatex(options: RspressPluginKatexOptions = {},): RspressPlugin {
  // 样式路径
  // const stylePath = path.join(__dirname, 'some-style.css');
  return {
    // 插件名称
    name: 'rspress-plugin-katex',
    // 全局样式的路径
    globalUIComponents: [],
    globalStyles: require.resolve('katex/dist/katex.min.css'),
    // 扩展 Rspress 本身的配置
    // config(config, utils) {
    //   void utils;
    //   // utils.addPlugin({ name: 'plugin-name', /** 插件的其他配置 */ }); 增加插件
    //   // utils.removePlugin({ name: 'plugin-name' }); 删除插件
    //   return config;
    // },
    // 在构建之前执行的钩子
    async beforeBuild(config, isProd) {
      void config;
      void isProd;
      // console.log(config, isProd)
      // 这里可以执行一些操作
    },
    // 在构建之后执行的钩子
    // async afterBuild(config, isProd) {
    //   void config;
    //   void isProd;
    //   // 这里可以执行一些操作
    // },
    // 在构建之后执行的钩子
    // async routeGenerated(routes, isProd) {
    //   void routes;
    //   void isProd;
    //   // 这里可以拿到 routes 数组，执行一些操作
    // },
    // 添加额外的运行时模块
    // async addRuntimeModules(config, isProd) {
    //   void config;
    //   void isProd;
    //   return {}
    // },
    // 添加或修改国际化文案
    // i18nSource(source) {
    //   return source
    // },
    // 扩展 Markdown/MDX 编译能力
    markdown: {
      remarkPlugins: [
        // 添加自定义的 remark 插件
        [remarkMath, options], remarkCodeBlockToMath
      ],
      rehypePlugins: [
        // 添加自定义的 rehype 插件
        [rehypeKatex, options]
      ],
      globalComponents: [
        // 为 MDX 注册全局组件
      ],
    },
    // 扩展页面数据
    // extendPageData(pageData, isProd) {
    //   void pageData;
    //   void isProd;
    //   // 你可以往 pageData 对象上添加或者修改属性
    //   // pageData.a = 1;
    // },
    // 添加额外的页面
    // addPages(config, isProd) {
    //   void config;
    //   void isProd;
    //   return [];
    // }
  };
}


export default rspressPluginKatex
