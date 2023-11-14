

export default [
  {
    text: '首页',
    link: '/'
  },
  {
    text: '基础',
    children: [
      {
        text: '计算机网络',
        link: '/base/network/'
      },
      {
        text: 'HTTP权威指南',
        link: '/base/http/base.md'
      }
    ]
  },
  {
    text: '大前端',
    children: [
      {
        text: '基础',
        children: [
          {
            text: 'JavaScript',
            link: '/web/js/base.md',
          },
          {
            text: 'TypeScript',
            link: '/web/ts/base.md'
          },
        ]
      },
      {
        text: '框架',
        children: [
          {
            text: 'Vue',
            link: '/web/vue/vue2/base.md'
          },
          {
            text: 'React',
            link: '/web/react/base.md'
          },
        ]
      },
      {
        text: '前端工程化',
        children: [
          {
            text: 'node',
            link: '/web/node/base.md'
          },
          {
            text: 'Vite',
            link: '/web/vite/base.md'
          },
          {
            text: 'Webpack',
            link: '/web/webpack/base.md'
          },
        ]
      },
      {
        text: '跨端',
        children: [
          {
            text: 'Flutter',
            link: '/web/flutter/dart.md'
          },
          {
            text: 'uni-app',
            link: '/web/uni-app/base.md'
          }
        ]
      }
    ],
  },

  {
    text: '服务端',
    children: [
      {
        text: 'Java',
        children: [
          {
            text: 'Java SE',
            link: '/server/java/base/base.md'
          }
        ]
      },
      {
        text: '数据库',
        children: [
          {
            text: 'MySQL',
            link: '/server/mysql/base.md'
          },
          {
            text: 'redis',
            link: '/server/redis/base.md'
          },
          {
            text: 'mongodb',
            link: '/server/mongodb/base.md'
          }
        ]
      },
      {
        text: '工具',
        children: [
          {
            text: 'nginx',
            link: '/server/nginx/base.md'
          },
          {
            text: 'docker',
            link: '/server/docker/base/base.md'
          },
          {
            text: 'svn & git',
            link: '/server/git/base.md'
          },
        ]
      }
    ],
  },
]
