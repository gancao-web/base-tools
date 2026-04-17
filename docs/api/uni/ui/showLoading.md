# showLoading

显示 loading 提示框

## 示例

```ts
import { showLoading } from '@base-web-kits/base-tools-uni';

showLoading(); // '请稍后...'
showLoading('保存中...');
```

## 参数

- `title: string` - 提示的文字，默认：'请稍后...'
- `mask: boolean` - 是否显示透明蒙层，防止触摸穿透，默认：false

## 版本

- 1.3.16 新增
