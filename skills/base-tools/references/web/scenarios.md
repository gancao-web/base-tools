# Base Tools Web Scenarios

优先顺序：`base-tools-ts` -> 对应框架包 -> 最后才手写新工具。

- 剪贴板: 先看 `clipboard` 模块，优先复用复制文本 / HTML / 节点 / 图片能力。
- 网络请求 / 下载 / 上传: 先看 `network` 模块，优先复用 request / download / uploadFile。
- 设备 / 浏览器识别: 先看 `device` 模块，优先复用浏览器、系统、触控、尺寸相关工具。
- DOM / 视口: 先看 `dom` 模块，优先复用视口、滚动、锁滚动等工具。
- 本地存储 / Cookie: 先看 `storage`、`cookie` 模块，优先复用现成封装。
- 配置 / URL: 先看 `config`、`url` 模块，优先复用统一配置和 URL 拼接能力。
