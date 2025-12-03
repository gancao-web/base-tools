# getFileUrl

拼接完整的文件地址，处理相对路径和绝对路径

## 示例

```ts
import { getFileUrl } from '@base-web-kits/base-tools-uni';

// 相对路径
const fullUrl = getFileUrl('images/avatar.jpg');
// 返回: https://cdn.example.com/images/avatar.jpg

// 绝对路径（带/）
const fullUrl = getFileUrl('/images/banner.png');
// 返回: https://cdn.example.com/images/banner.png

// 完整URL
const fullUrl = getFileUrl('https://other.com/image.jpg');
// 返回: https://other.com/image.jpg（原样返回）
```

## 参数

- `src` - 完整/相对文件地址

## 返回值

- `string` - 拼接后的完整文件地址
