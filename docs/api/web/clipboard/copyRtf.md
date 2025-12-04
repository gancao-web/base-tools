# copyRtf

复制 RTF 富文本到剪贴板（移动端与 PC）  
同时写入 `text/plain`，增强与 Office/富文本编辑器的兼容性。

## 示例

```ts
import { copyRtf } from '@base-web-kits/base-tools-web';

await copyRtf('{\\rtf1\\ansi Hello \\b World}');
```

## 版本

- 1.0.0 新增
