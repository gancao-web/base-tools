# uploadFile

上传文件

## 示例

```ts
import { uploadFile } from '@base-web-kits/base-tools-web';

// 简单上传
const res = await uploadFile({ url: 'https://xx', file: file });

// 带额外参数和Header
const res = await uploadFile({
  url: 'https://xx',
  file: file,
  name: 'avatar', // 服务端接收的字段名
  data: { userId: 123 },
  header: { Authorization: 'Bearer xxx' },
});

// 监听上传进度
const res = await uploadFile(
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

// 直接返回json对象
type UploadResult = { status: number; message: string; data: { path: string } | null };

const json = await uploadFile<UploadResult>(
  { url: 'https://xx', file: file, responseType: 'json' },
);

// 默认 responseType 为 text，手动解析返回结果
console.log('uploadFile ok', JSON.parse(res));
```

## 参数说明

### option (UploadFileOption)

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| url | `string` | 是 | - | 上传接口地址 |
| file | `File` | 是 | - | 要上传的文件对象 |
| name | `string` | 否 | `'file'` | 文件对应的 key (服务端通过这个 key 获取文件的二进制内容) |
| header | `Record<string, string \| number>` | 否 | - | 请求头 |
| data | `UploadData`（`Record<string, unknown>`） | 否 | - | 请求参数；忽略 `null`、`undefined`，其余值通过 `String(value)` 写入 `FormData` |
| timeout | `number` | 否 | `0` | 超时时间，单位 ms，默认 0（不超时） |
| responseType | `'text' \| 'json'` | 否 | `'text'` | 响应类型。`'text'` 返回原始字符串；`'json'` 会自动执行 `JSON.parse` 后返回对象 |

### config (UploadConfig & WebApiConfig)

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| onTaskReady | `(task: UploadTask) => void` | 否 | - | 获取 uploadTask 对象，可用于监听进度或取消上传 |
| showLoading | `boolean \| string` | 否 | `false` | 是否显示加载提示 (支持字符串作为自定义文本) |
| toastSuccess | `boolean \| string \| ((res) => boolean \| string)` | 否 | `false` | 操作成功的 toast 提示 |
| toastError | `boolean \| string \| ((err) => boolean \| string)` | 否 | `true` | 是否显示操作失败的详细错误信息 |
| showLog | `boolean` | 否 | `true` | 是否在控制台打印日志 |

### responseType 说明

- 默认 `responseType: 'text'`，返回值类型为 `string`
- 传入 `responseType: 'json'` 后，可配合泛型使用，自动将响应内容按 JSON 解析并返回对象
- 如果 `responseType: 'json'` 但服务端返回的不是合法 JSON，会进入失败分支
- 当上传失败且服务端返回了 JSON 错误体时，会优先读取其中的 `message` 作为错误信息
- `data` 中的对象和数组不会自动 JSON 序列化；需要结构化参数时，请按服务端协议提前调用 `JSON.stringify`

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
