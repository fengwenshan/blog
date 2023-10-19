// https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#sidebar
export default {
  '/JS/vue2.x': [
    {
      text: 'Vue 2.x',
      children: [
        '/JS/vue2.x/observer.md',
        '/JS/vue2.x/nextTick.md',
        '/JS/vue2.x/template.md',
        '/JS/vue2.x/vnode.md',
        '/JS/vue2.x/patch.md',
      ],
    },
    {
      text: '扩展篇',
      children: [
        '/JS/vue2.x/extend.md'
      ]
    }
  ]
}
