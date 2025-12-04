# href

页面跳转，支持多种打开方式和参数传递

## 示例

```ts
import { href } from '@base-web-kits/base-tools-uni';

// 基本页面跳转
href('/pages/user/profile');

// 带参数跳转
href('/pages/user/detail?id=123&name=aa');

// 参数包含中文或特殊字符，需要编码
const name = encodeURIComponent('中文名称|json数据');
href(`/pages/user/detail?name=${name}`);

// 需要登录的页面
href('/pages/user/profile', { checkLogin: true });

// 关闭当前页面跳转（redirectTo）
href('/pages/home/index', { mode: 'redirectTo' });

// 关闭所有页面跳转（reLaunch）
href('/pages/home/index', { mode: 'reLaunch' });

// 自定义节流时间（防止重复点击）
href('/pages/detail/index', { throttle: 2000 }); // 2秒内不允许重复打开
```

## 参数

- `url: string` - 页面路径，支持相对路径和绝对路径
- `config?: object` - 可选配置项：
  - `checkLogin?: boolean` - 是否校验登录，未登录则自动跳转到登录页
  - `mode?: 'redirectTo' | 'reLaunch'` - 打开方式，默认为 `navigateTo`
  - `throttle?: number` - 节流时间（毫秒），防止重复点击，默认为 `1000ms`

## 版本

- 1.0.0 新增
