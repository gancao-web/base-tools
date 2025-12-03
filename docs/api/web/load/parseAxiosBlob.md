# parseAxiosBlob

解析Axios返回的Blob数据

## 示例

```ts
import { parseAxiosBlob } from '@base-web-kits/base-tools-web';
const res = await axios.get(url, { responseType: 'blob' });
const { blob, fileName } = await parseAxiosBlob(res);
download(blob, fileName);
```
