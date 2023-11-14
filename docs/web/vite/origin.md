# 源码解析

## 目录结构和构建

:::  details Vite目录结构

```
├── build
├── examples
├── packages
│   ├── create-vite
│   ├── plugin-legacy
│   ├── vite
├── playground
│   ├── alias
│   ├── assets
│   ├── assets-sanitize
│   ├── backend-integration
│   ├── build-old
│   ├── cli
│   ├── cli-module
│   ├── config
│   ├── css
│   ├── css-codesplit
│   ├── css-codesplit-cjs
│   ├── css-dynamic-import
│   ├── css-lightningcss
│   ├── css-lightningcss-proxy
│   ├── css-sourcemap
│   ├── data-uri
│   ├── define
│   ├── dynamic-import
│   ├── dynamic-import-inline
│   ├── env
│   ├── env-nested
│   ├── extensions
│   ├── external
│   ├── fs-serve
│   ├── glob-import
│   ├── hmr
│   ├── html
│   ├── import-assertion
│   ├── js-sourcemap
│   ├── json
│   ├── legacy
│   ├── lib
│   ├── minify
│   ├── multiple-entrypoints
│   ├── nested-deps
│   ├── object-hooks
│   ├── optimize-deps
│   ├── optimize-deps-no-discovery
│   ├── optimize-missing-deps
│   ├── preload
│   ├── preserve-symlinks
│   ├── proxy-hmr
│   ├── resolve
│   ├── resolve-config
│   ├── resolve-linked
│   ├── ssr
│   ├── ssr-deps
│   ├── ssr-html
│   ├── ssr-noexternal
│   ├── ssr-pug
│   ├── ssr-resolve
│   ├── ssr-webworker
│   ├── tailwind
│   ├── tailwind-sourcemap
│   ├── transform-plugin
│   ├── tsconfig-json
│   ├── tsconfig-json-load-error
│   ├── wasm
│   ├── worker
├── pnpm-workspace
├── package.json
└── tsconfig.json
```
:::

查看pnpm-workspace.yaml文件，看看工作空间

```yaml
packages:
  - 'packages/*'
  - 'playground/**'
```