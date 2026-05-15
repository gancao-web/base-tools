# Base Tools Uni Scenarios

优先顺序：`base-tools-ts` -> 对应框架包 -> 最后才手写新工具。

- 路由 / 登录: 先看 `router`、`config`、`bean` 模块，优先复用跳转、登录、首页、返回封装。
- 媒体 / 文件: 先看 `media`、`file`、`url` 模块，优先复用选择图片 / 视频 / 媒体和文件能力。
- 网络 / 异步: 先看 `network`、`async`、`hooks` 模块，优先复用请求、加载、事件监听封装。
- 系统 / 平台: 先看 `system`、`other` 模块，优先复用窗口信息、设备信息、平台识别。
- 支付 / 更新 / UI: 先看 `pay`、`update`、`ui` 模块，优先复用支付、版本更新、提示和滚动封装。
