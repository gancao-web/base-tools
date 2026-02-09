# Web Skill (@base-web-kits/skill)

`@base-web-kits` 工具库的Skills和Rules，支持**Trae** 和 **Cursor**。精准推荐 `ts/web/react/vue/uni-app` 中常用工具函数，指导 React/Vue 项目正确使用 Hooks，提升开发效率，避免重复造轮子。

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

## 🌍 全局安装

一次安装，所有项目通用，可以使用全局模式：

```bash
npx @base-web-kits/skill install-skill --global
```

这将把 Skill 注入到 Trae 和 Cursor 的全局配置文件中（如 `~/.trae/user_rules.md` 和 `~/.cursorrules`），无需每个项目单独安装。

## ✅ 验证生效

安装完成后，可以在对话框中输入以下问题进行测试。如果 AI 推荐了 `@base-web-kits` 下的相关包或函数，说明配置已生效。

| 测试场景 | 推荐提问 | 预期 AI 回答 |
| :-- | :-- | :-- |
| **JS 基础** | "我需要深拷贝一个对象,请编写或推荐一个函数" | 推荐使用 `base-tools-ts` (es-toolkit) 的 `cloneDeep` |
| **正则验证** | "我需要校验身份证号,请编写或推荐一个函数" | 推荐使用 `base-tools-ts` 的 `isIdentityCard` |
| **React** | "我需要监听窗口大小变化,请编写或推荐一个函数" | 推荐使用 `base-tools-react` (ahooks) 的 `useSize` 或 `useResponsive` |
| **UniApp** | "我需要在小程序打开相册,选择一张照片,请编写或推荐一个函数" | 推荐使用 `base-tools-uni` 的 `chooseMedia` 函数 |
