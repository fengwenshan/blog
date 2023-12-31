import {defaultTheme, defineUserConfig} from "vuepress"
import navbar from './user-config/navbar'
import sidebar from './user-config/sidebar/index'
import markdownItMathjax3 from 'markdown-it-mathjax3'

export default defineUserConfig ({
  title: '冯文山博客',
  description: '前端技术积累',
  type: 'blog',
  theme: defaultTheme({
    // 顶部导航
    navbar,
    // 左边导航
    sidebar
  }),
  extendsMarkdown: md => {
    md.use(markdownItMathjax3)
    md.linkify.set({ fuzzyEmail: false })
  },
  plugins: [ ]
})
