# Vite 使用

## 快速上手

在原有的项目中可以集成vite: `pnpm install vite --D`。

空文件可以直接搭建vite项目: `npm create vite@latest` 或 `yarn | pnpm create vite`。

创建项目的时候可以指定模板：`创建命令 模板名称 --template vue | react` 构建Vite+Vue或react项目, [模板社区](https://github.com/vitejs/awesome-vite#templates)

**index.html与项目根目录**

在vite中`index.html`在项目最外层，而不是在public文件夹下，这是因为vite在开发环境的时候是一个服务器，而index.html是vite项目的入口文件。

vite将index.html视为源码和模块图的一部分。vite解析`<script type="module" src="...">`，这个标签指向JS源码。甚至内联引入JS的`<script type="module">`和引用css的`<link href>`也能利用vite特有的功能被解析。

## 创建项目

### 集成vue2项目

使用`pnpm i vite vue@^2.6.14 underfin/vite-plugin-vue2`插件, vue2.7x使用`@vitejs/plugin-vue2`插件

```javascript
// vite.config.js
import { createVuePlugin } from 'vite-plugin-vue2';
import vue from '@vitejs/plugin-vue2';

module.exports = {
  plugins: [
    createVuePlugin(/* options */), // vue2.6x
    vue() // vue 2.7x
  ]
}
```

```json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`，`vite serve`
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  }
}
```



### 集成Vue3

使用`pnpm i vite vue@latest @vitejs/plugin-vue`插件

```javascript
// vite.config.ts
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
}
```

```typescript
// src/vite-env.d.ts

/// <reference types="vite/client" />
```

### 集成React

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />
```

## 别名alias

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'src'),
      '@styles': path.resolve(__dirname,'src/styles'),
    },
  },
})
```

## 客户端类型

Vite 默认的类型定义是写给它的 Node.js API 的。要将其补充到一个 Vite 应用的客户端代码环境中，请添加一个 d.ts 声明文件：

```typescript
/// <reference types="vite/client" />
```

也可以在 tsconfig.json 中添加 `types: ["vite/client"]` 选项。

这样会提供一下类型定义提示：

- `import.meta` 对象
- `import.meta.glob`
- `import.meta.globEager`
- `import.meta.env` Vite 注入的环境变量的类型定义
- `import.meta.hot`  HMR API 类型定义
- `import.meta.webpackHot`
- `import.meta.webpackJsonp`
- `import.meta.url`
- `import.meta.glob`

:::tip

要覆盖默认的类型定义，请添加一个包含你所定义类型的文件，请在三斜线注释 reference vite/client 前添加定义。

例如，要为 React 组件中的 *.svg 文件定义类型：

- Vite-env-overge.d.ts (包含您的输入的文件)：

```ts
declare module '*.svg' {
const content: React.FC<React.SVGProps<SVGElement>>
export default content
}
```

- 包含对 vite/client 的引用的文件:

```ts
/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
```
:::








