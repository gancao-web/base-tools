# normalizeFileExtension

将文件扩展名规范为仅含一个前导点的小写格式。空字符串或仅包含点时返回空字符串。

## 示例

```ts
import { normalizeFileExtension } from '@base-web-kits/base-tools-ts';

normalizeFileExtension(' PDF '); // '.pdf'
normalizeFileExtension('..JPG'); // '.jpg'
normalizeFileExtension(''); // ''
```

## 版本

- 1.6.0 新增
