# 🤖 AI 智能助手 (Skill)

本项目提供了强大的 AI Skill，可让 Cursor、Trae、Claude Code 等 AI 助手深度理解 `@base-web-kits` 的能力，为您精准推荐最佳实践函数。

## 方式一：随 TS 包使用

大多数项目会安装 `@base-web-kits/base-tools-ts`。从`1.5.0`起，该 npm 包内置了与当前版本匹配的 Agent Skill，安装或升级后会同步更新。请将以下规则加到项目的 `AGENTS.md`：

```md
- 新增或选用可跨业务复用的 TS/JS 工具、浏览器与 H5 能力、React Hooks、Vue 组合式函数、uni-app 能力或公共类型前，读取 `node_modules/@base-web-kits/base-tools-ts/skill/SKILL.md`，检索已有能力；业务专属逻辑和领域类型不触发。
```

## 方式二：单独安装 Skill

若项目没有安装 `@base-web-kits/base-tools-ts`，可单独安装skill：

```bash
npx skills add gancao-web/base-tools
```

## 验证

安装完成后，可以在对话框中输入以下问题进行测试。如果 AI 推荐了 `@base-web-kits` 下的相关包或函数，说明配置已生效。

| 测试场景 | 推荐提问 | 预期 AI 回答 |
| :-- | :-- | :-- |
| **JS工具库** | "我需要深拷贝一个对象,请编写或推荐一个函数" | 推荐使用 `base-tools-ts` 的 `cloneDeep` |
| **JS正则验证** | "我需要校验邮箱格式,请编写或推荐一个函数" | 推荐使用 `base-tools-ts` 的 `isEmail` |
| **通用web** | "我需要复制文本到剪贴板,请编写或推荐一个函数" | 推荐使用 `base-tools-web` 的 `copyText` |
| **React项目** | "我需要监听dom元素的尺寸变化,请编写或推荐一个函数" | 推荐使用 `base-tools-react` 的 `useSize` |
| **Vue项目** | "我需要监听元素外部点击事件,请编写或推荐一个函数" | 推荐使用 `base-tools-vue` 的 `onClickOutside` |
| **UniApp项目** | "我需要保存网络图片到系统相册,请编写或推荐一个函数" | 推荐使用 `base-tools-uni` 的 `saveImageToPhotosAlbum` 函数 |
