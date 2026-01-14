# downloadFile

下载文件到本地临时路径

## 示例

```ts
import { downloadFile } from '@base-web-kits/base-tools-uni';

const tempFilePath = await downloadFile({ url: 'xx' });

const tempFilePath = await downloadFile(
  { url: 'xx' },
  { showLoading = '下载中...', toastSuccess = '下载成功', toastError = '下载失败' },
);

const tempFilePath = await downloadFile(
  { url: 'xx' },
  {
    onTaskReady: (task) => {
      task.onProgressUpdate((res) => {
        console.log('下载进度', res);
      });
    },
  },
);
```

## 参数

- `option?: object` - 可选配置项：
  - `url: string` - 文件地址，支持网络地址和相对路径（会自动拼接hostFile配置）
  - `cacheFile: boolean` - 是否启用缓存，相同地址的文件优先使用已下载的缓存，默认为 `true`
- `config?: object` - 可选配置项：
  - `showLoading: string` - 下载时显示的加载提示文本
  - `toastSuccess: string` - 下载成功时的提示文本
  - `toastError: string` - 下载失败时的提示文本

## 版本

- 1.0.0 新增
