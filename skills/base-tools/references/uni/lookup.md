# Base Tools Uni Lookup

uni-app 平台能力、端差异或生态 API 先查本包，再补查 `base-tools-ts`。

按用户需求快速定位推荐 API。命中后仍需用 `catalog.md` 确认真实导出。
第三方统一导出规则见 `catalog.md` 的 `Third-party Re-exports`。

| 需求 / 关键词 | 优先推荐 | 说明 |
| :-- | :-- | :-- |
| Promise 化 uni API | `enhanceUniApi` | 为 uni API 注入 loading、toast、log 等能力。 |
| 页面事件监听 | `useOn` | uni 页面生命周期或事件监听封装。 |
| 路由跳转 / 返回 | `href`、`back`、`toHome`、`toLogin` | 统一页面跳转和登录跳转。 |
| 登录检查 | `checkLogin` | 路由或业务操作前检查登录态。 |
| 选择图片 / 视频 / 媒体 | `chooseImage`、`chooseVideo`、`chooseMedia` | 统一媒体选择能力。 |
| 保存图片到相册 | `saveImageToPhotosAlbum` | 保存网络图片或本地图片到系统相册。 |
| 打开文件 / 文档 | `openDocument`、`getFileUrl` | 文件 URL 处理和文档预览。 |
| 请求封装 | `request`、`RequestConfig` | uni.request 封装，支持缓存、loading、toast、日志和流式响应；项目内可基于 `request` 自行封装 `requestApi`。 |
| 上传 / 下载文件 | `uploadFile`、`downloadFile` | uni 文件上传下载。 |
| 窗口 / 安全区 / 设备信息 | `getWindowInfo`、`getSafeAreaBottom`、`getDeviceInfo`、`getPlatformOs` | 平台和布局适配。 |
| 扫码 / 复制 | `scanCode`、`copyText` | 系统能力封装。 |
| Toast / Modal / Loading | `toast`、`showModal`、`showLoading` | 统一 UI 提示。 |
| 微信支付 | `toPayWx` | 微信支付封装。 |
| 小程序更新 | `mpUpdate` | 小程序版本更新流程。 |
| rpx 单位 | `withUnitRpx` | 数值转 rpx 字符串。 |
