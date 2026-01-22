# uploadFile

上传文件

## 示例

```ts
import { uploadFile } from '@base-web-kits/base-tools-web';

// 简单上传
await uploadFile({ url: 'https://xx', file: file });

// 带额外参数和Header
await uploadFile({
  url: 'https://xx',
  file: file,
  name: 'avatar', // 服务端接收的字段名
  formData: { userId: 123 },
  header: { Authorization: 'Bearer xxx' },
});

// 监听上传进度
await uploadFile(
  { url: 'https://xx', file: file },
  {
    onTaskReady: (task) => {
      // 监听进度
      task.onProgressUpdate((res) => {
        console.log('上传进度:', res.progress); // 0-100
        console.log('已上传:', res.loaded);
        console.log('总大小:', res.total);
      });
      // 取消上传
      // task.abort();
    },
    showLoading: '上传中...', // 显示Loading
    toastSuccess: '上传成功', // 成功提示
  },
);
```

## 参数说明

### option (UploadFileOption)

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| url | `string` | 是 | - | 上传接口地址 |
| file | `File` | 是 | - | 要上传的文件对象 |
| name | `string` | 否 | `'file'` | 文件对应的 key (服务端通过这个 key 获取文件的二进制内容) |
| header | `Record<string, string \| number>` | 否 | - | 请求头 |
| formData | `Record<string, string \| number>` | 否 | - | 额外的 formData 参数 |
| timeout | `number` | 否 | `0` | 超时时间，单位 ms，默认 0（不超时） |

### config (UploadConfig & WebApiConfig)

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| onTaskReady | `(task: UploadTask) => void` | 否 | - | 获取 uploadTask 对象，可用于监听进度或取消上传 |
| showLoading | `boolean \| string` | 否 | `false` | 是否显示加载提示 (支持字符串作为自定义文本) |
| toastSuccess | `boolean \| string \| ((res) => boolean \| string)` | 否 | `false` | 操作成功的 toast 提示 |
| toastError | `boolean \| string \| ((err) => boolean \| string)` | 否 | `true` | 是否显示操作失败的详细错误信息 |
| showLog | `boolean` | 否 | `true` | 是否在控制台打印日志 |

## UploadTask

`onTaskReady` 回调中获取的任务对象。

| 方法名           | 类型                                                     | 说明         |
| :--------------- | :------------------------------------------------------- | :----------- |
| onProgressUpdate | `(callback: (res: UploadProgressEvent) => void) => void` | 监听上传进度 |
| abort            | `() => void`                                             | 取消上传任务 |

## UploadProgressEvent

| 属性名   | 类型     | 说明                  |
| :------- | :------- | :-------------------- |
| progress | `number` | 上传进度百分比: 0-100 |
| loaded   | `number` | 已上传字节数          |
| total    | `number` | 总字节数              |

## 版本

- 1.2.0 新增
