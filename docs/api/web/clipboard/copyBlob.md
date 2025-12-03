# copyBlob

复制任意 Blob 到剪贴板（移动端与 PC，需 `ClipboardItem`）  
使用场景：原生格式粘贴（如 `image/svg+xml`、`application/pdf` 等）。

## 示例

```ts
import { copyBlob } from '@base-web-kits/base-tools-web';

const svg = new Blob(['<svg></svg>'], { type: 'image/svg+xml' });
await copyBlob(svg);
```
