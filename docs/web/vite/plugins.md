# vite插件

Vite的插件是受限制的rollup插件。

## 约定

如果插件不适用vite特有钩子，可以作为兼容rollup插件来实现，这时候推荐使用rollup插件命名约定：`rollup-plugin-[prefix]`

对于vite专属的插件，命名约定为`vite-plugin-[prefix]`,如果插件只适用于特定的框架，它的名字应该遵循以下前缀格式：

- vite-plugin-vue Vue插件
- vite-plugin-react React插件
- vite-plugin-angular angular插件
- vite-plugin-svelte svelte插件
- vite-plugin-vue-jsx vue-jsx插件
- vite-plugin-vue-jsx-sfc vue-jsx-sfc插件
- vite-plugin-vue-router vue-router插件
- vite-plugin-vue-i18n vue-i18n插件

在开发中，Vite开发服务器会创建一个插件来调用Rollup构建钩子，与Rollup一样，以下狗仔在服务器启动时调用：

- options
- buildStart

以下钩子会在每个传入模块请求时被调用：

- resolveId
- load
- transform

以下钩子在服务器关闭时被调用：

- buildEnd
- closeBundle

## Vite独有的钩子

Vite插件也可以提供钩子服务于特定的vite目标。这些钩子会被Rollup忽略。

### config

类型： `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`

种类：`async`, `sequential`

在解析Vite配置前，钩子接收原始用户配置和一个描述配置环境的变量，包含正在使用的 mode 和 command。它可以返回一个将被深度合并到现有配置中的部分配置对象，或者直接改变配置（如果默认的合并不能达到预期的结果）。

用户插件在运行这个钩子之前会被解析，因此在 config 钩子中注入其他插件不会有任何效果。

```typescript
// 返回部分配置（推荐）
const partialConfigPlugin = () => ({
  name: 'return-partial',
  config: () => ({
    resolve: {
      alias: {
        foo: 'bar',
      },
    },
  }),
})

// 直接改变配置（应仅在合并不起作用时使用）
const mutateConfigPlugin = () => ({
  name: 'mutate-config',
  config(config, { command }) {
    if (command === 'build') {
      config.root = 'foo'
    }
  },
})
```

### configResolved

类型：`(config: ResolvedConfig) => void | Promise<void>`

种类：`async`、`parallel`

在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。

```typescript
const examplePlugin = () => {
  let config

  return {
    name: 'read-config',

    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig
    },

    // 在其他钩子中使用存储的配置
    transform(code, id) {
      if (config.command === 'serve') {
        // dev: 由开发服务器调用的插件
      } else {
        // build: 由 Rollup 调用的插件
      }
    },
  }
}
```

注意，在开发环境下，command 的值为 serve（在 CLI 中，vite 和 vite dev 是 vite serve 的别名）。