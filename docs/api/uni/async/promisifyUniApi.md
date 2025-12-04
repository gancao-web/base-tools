# promisifyUniApi

将uni API包装为Promise形式，提供统一的错误处理和用户反馈

## 示例

```ts
import { promisifyUniApi } from '@base-web-kits/base-tools-uni';

// 基本用法
const downloadPromise = promisifyUniApi(uni.downloadFile);
const result = await downloadPromise({ url: 'https://example.com/file.pdf' });

// 带加载提示和成功提示
const uploadPromise = promisifyUniApi(uni.uploadFile);
await uploadPromise(
  {
    url: 'https://api.example.com/upload',
    filePath: tempFilePath,
    name: 'file',
  },
  {
    showLoading: '上传中...',
    toastSuccess: '上传成功',
  },
);

// 自定义错误处理
const requestPromise = promisifyUniApi(uni.request);
await requestPromise(
  { url: 'https://api.example.com/data' },
  {
    toastError: (error) => {
      // 只在非取消错误时显示提示
      return !error.errMsg.includes('cancel') ? '请求失败' : false;
    },
  },
);

// 完全自定义配置
const saveImagePromise = promisifyUniApi(uni.saveImageToPhotosAlbum);
await saveImagePromise(
  { filePath: tempFilePath },
  {
    showLoading: '保存中',
    toastSuccess: (res) => '图片已保存到相册',
    toastError: '保存失败，请检查权限',
    showLog: true,
  },
);
```

## 参数

- `uniApi` - 需要包装的uni API函数（必需）

## 返回值

- 返回一个函数，该函数接收两个参数：
  - `option` - uni API的原始参数（可选）
  - `config` - 包装配置（可选）
    - `showLoading` - 是否显示加载提示，默认 `false`（支持字符串自定义文本）
    - `toastSuccess` - 操作成功的toast提示，默认 `false`（支持函数返回自定义文本）
    - `toastError` - 是否显示操作失败的详细错误信息，默认 `true`（支持函数判断是否显示）
    - `showLog` - 是否显示日志，默认 `true`

## 版本

- 1.0.0 新增
