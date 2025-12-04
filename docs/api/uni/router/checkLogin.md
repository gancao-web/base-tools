# checkLogin

检查用户是否登录，未登录则自动跳转到登录页

- 需在入口文件初始化应用配置 `setAppConfig({ isLogin, pathLogin })`
- 当 `autoLogin` 为 `true` 时，未登录会自动跳转到登录页
- 当 `autoLogin` 为 `false` 时，只返回登录状态，不执行跳转

## 示例

```ts
import { checkLogin } from '@base-web-kits/base-tools-uni';

// 简单检查
const isLogin = checkLogin(false); // false表示不自动跳转
if (isLogin) {
  console.log('用户已登录');
} else {
  console.log('用户未登录');
}

// 在需要登录的函数中使用
async function submitOrder() {
  if (!checkLogin()) return; // 未登录会自动跳转，函数直接返回

  // 用户已登录，继续提交订单
  await createOrder();
}
```

## 参数

- `autoLogin?: boolean` - 是否自动跳转到登录页，默认为 `true`

## 返回值

- `boolean` - 用户是否已登录

## 版本

- 1.0.0 新增
