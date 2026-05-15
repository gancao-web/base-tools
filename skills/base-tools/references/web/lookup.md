# Base Tools Web Lookup

浏览器 / H5 能力先查本包，再补查 `base-tools-ts`。

按用户需求快速定位推荐 API。命中后仍需用 `catalog.md` 确认真实导出。
第三方统一导出规则见 `catalog.md` 的 `Third-party Re-exports`。

| 需求 / 关键词 | 优先推荐 | 说明 |
| :-- | :-- | :-- |
| 复制文本 | `copyText` | 复制普通文本到剪贴板。 |
| 复制 HTML / 节点 / 图片 | `copyHtml`、`copyNode`、`copyImage` | 复制富文本、DOM 节点或图片。 |
| 浏览器 / 系统 / 设备识别 | `getBrowserName`、`getOS`、`isMobile`、`isPC`、`isWeChat` | 识别 UA、平台和设备类型。 |
| 视口尺寸 / 滚动位置 | `getWindowWidth`、`getWindowHeight`、`getWindowScrollTop` | 读取窗口尺寸和滚动信息。 |
| 元素是否在视口内 | `isInViewport` | 判断 DOM 元素是否进入可视区域。 |
| 锁定页面滚动 | `lockBodyScroll`、`unlockBodyScroll` | 弹窗、抽屉等场景锁定 body 滚动。 |
| 请求封装 | `request`、`RequestConfig` | 基于 fetch 的请求封装，支持缓存、loading、toast、日志和 SSE。 |
| 下载 / 动态加载资源 | `download`、`loadJs`、`loadCss`、`preloadImage` | 文件下载和资源加载。 |
| 上传文件 | `uploadFile` | 浏览器文件上传封装。 |
| Cookie | `getCookie`、`setCookie`、`removeCookie` | 读写和删除 Cookie。 |
| localStorage | `getLocalStorage`、`setLocalStorage`、`removeLocalStorage` | 本地存储封装。 |
| URL 参数读取 | `getUrlParam`、`getUrlNumber`、`getUrlParams` | 读取当前 URL 或指定 URL 的 query 参数。 |
