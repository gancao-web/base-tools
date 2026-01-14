# uploadFile

上传文件到服务器

## 示例

```ts
import { uploadFile } from '@base-web-kits/base-tools-uni';

const promise = uploadFile({ url: 'https://xx', filePath: 'xx' });
promise.task.onProgressUpdate((res) => {
  console.log('progress', res);
});
await promise;
```

## 版本

- 1.1.12 新增
