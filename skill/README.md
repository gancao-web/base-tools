# Web Project Skill (@base-web-kits/skill)

[Web工具库](https://gancao-web.github.io/base-tools/)的skills和rules，精准推荐 `ts/web/react/vue/uni-app` 中常用工具函数，指导 React/Vue 项目正确使用 hooks，提升开发效率，避免重复造轮子。

## 🚀 支持环境

- **Trae**: 支持，提供项目级和全局技能配置。
- **Cursor**: 支持，自动生成 `.cursor/rules/base-tools.mdc`。
- **GitHub Copilot**: 支持，自动生成 `.github/copilot-instructions.md`。
- **Claude Code**: 支持，自动生成或追加到 `CLAUDE.md`。
- **Windsurf**: 支持，自动生成 `.windsurfrules`。
- **Roo Code (Cline)**: 支持，自动生成 `.clinerules`。
- **Aider**: 支持，自动生成 `CONVENTIONS.md`。

## 🚀 单独安装

仅为某一个项目注入 AI 能力 (在项目根目录下运行以下命令即可)：

```bash
npx @base-web-kits/skill install-skill
```

运行成功后：

1. 项目中会生成 `.trae/` 和 `.cursor/` 目录。
2. **请将这些文件提交到 Git**。这样其他团队成员拉取代码后，无需再次安装即可直接获得相同的 AI 能力。

## 🛠️ 批量安装

一个目录包含多个项目，可以使用扫描模式批量安装 (在目录根目录下运行以下命令即可)：

```bash
npx @base-web-kits/skill install-skill --scan
```

## 🌍 全局安装 (仅 Trae)

目前仅 **Trae** 支持全局技能注入，一次安装所有项目通用：

```bash
npx @base-web-kits/skill install-skill --global
```

这将自动创建 `~/.trae/skills/base-tools/SKILL.md`，**即刻生效**。

> **注意**: Cursor、VS Code (Copilot) 等其他工具尚未支持读取本地全局配置文件，请使用上方的**单独安装**或**批量安装**模式 - 2026-02。

## ✅ 验证生效

安装完成后，可以在对话框中输入以下问题进行测试。如果 AI 推荐了 `@base-web-kits` 下的相关包或函数，说明配置已生效。

| 测试场景 | 推荐提问 | 预期 AI 回答 |
| :-- | :-- | :-- |
| **JS工具库** | "我需要深拷贝一个对象,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-ts` 的 `cloneDeep` |
| **JS正则验证** | "我需要校验邮箱格式,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-ts` 的 `isEmail` |
| **通用web** | "我需要复制文本到剪贴板,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-web` 的 `copyText` |
| **React项目** | "我需要监听dom元素的尺寸变化,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-react` 的 `useSize` |
| **Vue项目** | "我需要监听元素外部点击事件,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-vue` 的 `onClickOutside` |
| **UniApp项目** | "我需要保存网络图片到系统相册,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-uni` 的 `saveImageToPhotosAlbum` 函数 |
