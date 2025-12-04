# toPayWx

微信支付

## 示例

```ts
import { toPayWx } from '@base-web-kits/base-tools-uni';

// 发起微信支付
await toPayWx({
  timeStamp: '1640995200',
  nonceStr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
  package: 'prepay_id=wx2017033010242291fcfe0db70013231072',
  signType: 'RSA',
  paySign: 'oR9d8PuhnIc+YZ8cBHFCw9p2N0+A6E1J5XpD7E1r2y0=',
});

// 支付成功，跳转到成功页面
href('/pages/order/pay/success/index');
```

## 参数

- `option` - 微信支付参数
  - `timeStamp` - 时间戳，从1970年1月1日00:00:00至今的秒数（必需）
  - `nonceStr` - 随机字符串，长度为32个字符以下（必需）
  - `package` - 统一下单接口返回的 prepay_id 参数值（必需）
  - `signType` - 签名算法，暂支持 RSA（必需）
  - `paySign` - 签名（必需）

## 返回值

- `Promise<void>` - 支付成功时resolve，失败或取消时抛出异常

## 版本

- 1.0.0 新增
