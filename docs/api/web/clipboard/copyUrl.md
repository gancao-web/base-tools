# copyUrl

复制 URL 到剪贴板（移动端与 PC）  
 写入 `text/uri-list` 与 `text/plain`，在支持 URI 列表的应用中可识别为链接。

## 示例

```ts
import { copyUrl } from '@base-web-kits/base-tools-web';

await copyUrl('https://example.com/page');
```

## 版本

- 1.0.0 新增
