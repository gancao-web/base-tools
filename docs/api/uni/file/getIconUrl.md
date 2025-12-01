# getIconUrl

拼接完整的图标地址

## 示例

```ts
import { getIconUrl } from '@base-web-kits/base-tools-uni';

// 相对图标路径
const iconUrl = getIconUrl('icons/user.png');
// 返回: https://cdn.example.com/icons/user.png
```

## 参数

- `icon` - 相对图标地址

## 返回值

- `string` - 拼接后的完整图标地址
