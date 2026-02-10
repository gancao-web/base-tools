# Web Project Skill (@base-web-kits/skill)

[Web工具库](https://gancao-web.github.io/base-tools/)的skills和rules，精准推荐 `ts/web/react/vue/uni-app` 中常用工具函数，指导 React/Vue 项目正确使用 hooks，提升开发效率，避免重复造轮子。

## 🚀 安装

在项目根目录下运行以下命令即可：

```bash
npx skills add gancao-web/base-tools
```

运行成功后：

1. 项目中会在 `.agents` 目录生成 skill 描述文件。
2. 请将这些文件提交到 Git。其他成员拉取代码后，无需安装即可获得相同的 AI 能力。

## ✅ 验证

安装完成后，可以在对话框中输入以下问题进行测试。如果 AI 推荐了 `@base-web-kits` 下的相关包或函数，说明配置已生效。

| 测试场景 | 推荐提问 | 预期 AI 回答 |
| :-- | :-- | :-- |
| **JS工具库** | "我需要深拷贝一个对象,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-ts` 的 `cloneDeep` |
| **JS正则验证** | "我需要校验邮箱格式,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-ts` 的 `isEmail` |
| **通用web** | "我需要复制文本到剪贴板,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-web` 的 `copyText` |
| **React项目** | "我需要监听dom元素的尺寸变化,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-react` 的 `useSize` |
| **Vue项目** | "我需要监听元素外部点击事件,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-vue` 的 `onClickOutside` |
| **UniApp项目** | "我需要保存网络图片到系统相册,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-uni` 的 `saveImageToPhotosAlbum` 函数 |
