# authorize

判断权限是否开启，若未开启则引导用户开启权限

## 示例

```ts
import { authorize } from '@base-web-kits/base-tools-uni';

await authorize('scope.writePhotosAlbum', "请开启'添加到相册'的权限");

await authorize('scope.writePhotosAlbum', "请开启'添加到相册'的权限", {
  title: '提示',
  confirmText: '去开启',
});
```

## 参数

- `scope` - 权限范围，如 'scope.writePhotosAlbum'
- `content` - 引导用户开启权限的提示内容
- `option` - 引导弹窗配置（可选）
  - `title` - 弹窗标题
  - `confirmText` - 确认按钮文字
  - `cancelText` - 取消按钮文字

## 返回值

- `Promise<void>` - 用户已授权时resolve，未授权时抛出异常

## 版本

- 1.0.0 新增
