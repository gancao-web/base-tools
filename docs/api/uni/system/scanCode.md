# scanCode

调起客户端扫码界面，扫码成功后返回对应的结果

## 示例

```ts
import { scanCode } from '@base-web-kits/base-tools-uni';

const res = await scanCode({ scanType: ['barCode', 'qrCode'] });
console.log('扫码结果:', res);
```

## 参数

- `options` - 扫码配置（可选）
  - `scanType` - 扫码类型数组，如 `['barCode', 'qrCode']`
  - `onlyFromCamera` - 是否只允许从相机扫码，不允许从相册选取图片

## 返回值

- `Promise<UniApp.ScanCodeSuccessRes>` - 返回扫码结果对象
  - `result` - 扫码内容
  - `scanType` - 扫码类型
  - `charSet` - 字符集
  - `path` - 当所扫的码为当前应用的合法二维码时，会返回此字段，内容为二维码携带的 path

## 版本

- 1.3.11 新增
