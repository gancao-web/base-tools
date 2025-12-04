# getIconBg

拼接完整的图标背景样式字符串

## 示例

```ts
import { getIconBg } from '@base-web-kits/base-tools-uni';

// 获取图标背景样式
const bgStyle = getIconBg('icons/star.png');
// 返回: url(https://cdn.example.com/icons/star.png)
```

## 参数

- `icon` - 相对图标地址

## 返回值

- `string` - 格式为 `url(完整图标地址)` 的背景样式字符串

## 版本

- 1.0.0 新增
