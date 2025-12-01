# copyImage

复制单张图片到剪贴板（移动端与 PC，需浏览器支持 `ClipboardItem`）  
使用场景：把本地 `canvas` 或 `Blob` 生成的图片直接粘贴到聊天/文档。

## 示例

```ts
import { copyImage } from '@base-web-kits/base-tools-web';

const canvas = document.querySelector('canvas')!;
await copyImage(canvas);
```
