## 本地调试

可在项目中使用npm link xxx命令链接本地包,方便本地调试,而不用发布alpha版到npm

```
// 链接本地包 (强制覆盖已安装的包)
pnpm link D:\web\base-tools\packages\base-tools-uni

// 取消链接
pnpm unlink @base-web-kits/base-tools-uni
pnpm install
```
