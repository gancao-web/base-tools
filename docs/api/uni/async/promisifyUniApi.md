# promisifyUniApi

把 uni api 包装为 Promise 形式，支持加载提示、成功/失败提示、日志输出等配置

## Example

```ts
import { promisifyUniApi } from '@base-web-kits/base-tools/uni';

// 基础用法
const promise = promisifyUniApi(uni.downloadFile);
await promise({ url: 'https://example.com/file.pdf' });

// 带加载提示和成功提示
await promise(
  { url: 'https://example.com/file.pdf' },
  {
    showLoading: '下载中',
    toastSuccess: '下载成功'
  }
);

// 自定义错误提示
await promise(
  { url: 'https://example.com/file.pdf' },
  {
    toastError: (err) => !err.errMsg.includes('cancel') ? '下载失败' : false
  }
);
```