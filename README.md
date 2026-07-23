# 家庭关系脚本测试

基于 Next.js 的关系脚本测试，同时支持静态网站和单 HTML 文件两种构建方式。

## 本地开发

```powershell
cmd /c npm.cmd run dev
```

默认访问 `http://localhost:3000`。

## 构建静态网站

```powershell
cmd /c npm.cmd run build
```

输出目录为 `dist/`，发布时需要上传整个目录。

## 构建单 HTML

```powershell
cmd /c npm.cmd run build:single
```

输出文件为：

```text
single-dist/index.html
```

这个文件已经内联页面所需的 JavaScript 和 CSS，可以单独复制、发送或双击打开，不需要同时携带其他资源目录。

单文件版与 Next.js 网站共用题库、计分器和结果组件，但在一个页面内完成首页、答题和结果之间的切换。
