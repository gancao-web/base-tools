# uploadFile

上传文件到服务器

## 示例

```ts
import { uploadFile } from '@base-web-kits/base-tools-uni';

// 上传
const res = await uploadFile({ url: 'https://xx', file: file });

// 监听上传进度
const res = await uploadFile(
  { url: 'https://xx', file: file },
  {
    onTaskReady: (task) => task.onProgressUpdate((res) => console.log('上传进度:', res.progress)),
  },
);

// 解析上传结果
console.log('uploadFile ok', JSON.parse(res));
```

## 版本

- 1.1.12 新增
