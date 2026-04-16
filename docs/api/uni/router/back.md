# back

返回上一页，如果没有上一页则跳转到首页

## 示例

```tsx
import { back } from '@base-web-kits/base-tools-uni';

<view @click="back()">返回前一页</view>
<view @click="back(2)">返回前2页</view>
<view @click="back('/pages/login')">返回到登录之前的页面</view>
```

## 版本

- 1.0.0 新增
- 1.3.16 支持string 跳转
