# download

下载文件

## 示例

```ts
import { download } from '@base-web-kits/base-tools-web';
download('https://xx/xx.pdf'); // 完整的下载地址
download('https://xx/xx.pdf', 'xx.pdf'); // 自定义文件名（需含后缀）
download(blob, '图片.jpg'); // base64字符串 | Blob对象
```
