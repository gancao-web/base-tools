# uploadFile

上传文件到服务器，支持进度任务、增强提示以及与 `request` 一致的业务响应解析。

## 示例

```ts
import { uploadFile } from '@base-web-kits/base-tools-uni';

// 上传；默认返回 uni.uploadFile 响应中的 data 字符串
const res = await uploadFile({
  url: 'https://xx',
  filePath: '/tmp/avatar.jpg',
  name: 'file',
  data: { userId: 123 },
});

// 监听上传进度
const res = await uploadFile(
  { url: 'https://xx', filePath: '/tmp/avatar.jpg', name: 'file' },
  {
    onTaskReady: (task) => task.onProgressUpdate((res) => console.log('上传进度:', res.progress)),
  },
);

// 按业务状态码解析并提取 data.path
const path = await uploadFile<string>(
  { url: 'https://xx', filePath: '/tmp/avatar.jpg', name: 'file' },
  {
    resKey: 'data.path',
    msgKey: 'message',
    codeKey: 'status',
    successCode: [1],
    reloginCode: [-10],
  },
);

// 解析上传结果
console.log('uploadFile ok', JSON.parse(res));
```

## 参数说明

`option` 继承 `UniApp.UploadFileOption`，并额外支持 `data`。`data` 与原生 `formData` 会合并到最终的 `formData` 中；同名字段以 `formData` 为准。对象和数组应按接口协议提前序列化。

### config (UploadConfig)

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| onTaskReady | `(task: UniApp.UploadTask) => void` | 否 | - | 获取上传任务，可用于监听进度或取消上传 |
| showLoading | `boolean \| string` | 否 | `false` | 是否显示加载提示 |
| toastSuccess | `boolean \| string \| ((res) => false \| string)` | 否 | `false` | 操作成功提示 |
| toastError | `boolean \| string \| ((err) => boolean \| string)` | 否 | `true` | 操作失败提示 |
| showLog | `boolean` | 否 | `true` | 是否输出日志 |
| logExtra | `Record<string, unknown>` | 否 | - | 成功和失败日志中附加的数据 |
| transformResponse | `(response: unknown) => unknown` | 否 | - | 转换原始 `data`；配置业务响应解析时，转换结果会继续按状态码配置解析 |
| resKey | `string \| false` | 条件必填 | - | 业务成功时提取结果的字段；`false` 返回完整响应 |
| msgKey | `string` | 条件必填 | - | 业务响应消息字段 |
| codeKey | `string` | 条件必填 | - | 业务响应状态码字段 |
| successKey | `string` | 否 | `codeKey` | 用于判断成功状态码的字段 |
| successCode | `(number \| string)[]` | 条件必填 | - | 业务成功状态码列表 |
| reloginCode | `(number \| string)[]` | 条件必填 | - | 登录失效状态码列表 |

## 响应与错误处理

- 未配置业务响应字段时，返回 `uni.uploadFile` 成功响应中的原始 `data`，默认类型为 `string`
- 只要配置任一业务响应字段，就必须同时提供 `resKey`、`msgKey`、`codeKey`、`successCode` 和 `reloginCode`；`successKey` 可选
- 文本响应会先执行 `JSON.parse`；业务成功时提取 `resKey`，业务失败时 Promise reject 服务端原始响应
- 命中 `reloginCode` 时跳转登录页，且不重复显示失败提示
- `toastError` 函数在业务失败时接收 `UploadBusinessError`，可读取 `message`、`code`、`response` 和 `relogin`

## 版本

- 1.1.12 新增
