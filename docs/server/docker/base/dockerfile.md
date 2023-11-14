# Dockerfile

Dockerfile 是用来构建 Docker 镜像的文本文件，其中包含了一条条的指令，每一条指令对应着一个镜像层。

## build一个镜像

镜像选择：首先选择官方镜像，如果没有那就第三方Dockerfile开源的; 其次固定版本tag，不要使用latest; 尽量选择体积最小的镜像

现有有一个`index.html`文件，准备一个Dockerfile，内容如下:

```shell
from nginx:1.21.0-alpine
add index.html /usr/share/nginx/html/index.html
```


## 指令

- FROM

指定基础镜像，FROM 指令必须是 Dockerfile 中第一条指令，并且必须是第一条非注释的指令。

- RUN

RUN 指令用于在当前镜像基础上执行命令，RUN 指令会在当前镜像的最顶层执行命令，并提交为新的镜像层。