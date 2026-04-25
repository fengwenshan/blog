
// @ts-ignore
import { defineConfig } from '@rspress/core';
import path from 'node:path';
import mermaid from 'rspress-plugin-mermaid';
import katex from '@rspress-plugin/katex';


const __dirname = path.resolve();
export default defineConfig({
  // 文档根目录
  root: 'docs',
  title: '我的网站',
  logo: '/logo-480x480.png',
  icon: '/logo-480x480.png',
  logoText: '我的网站',
  lang: 'zh',
  /** 全局样式 */
  globalStyles: path.join(__dirname, 'theme/styles/index.css'),
   /** 全局组件 */
  globalUIComponents: [ ],
  
  plugins: [
    katex(),
    mermaid(),
  ],
  // 这些文件将不会被注册为路由（支持 glob 模式）
  route: {
    // 这些文件将不会被注册为路由（支持 glob 模式）
    exclude: ['components/**/*', 'fragments/**/*'],
  },
});