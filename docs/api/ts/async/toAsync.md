# toAsync

将 Promise 包装为 [data, error] 形式, 减少 try-catch 代码量

## Example

```ts
import { toAsync } from '@base-web-kits/base-tools/ts';

async function fetchData() {
  const [data, err] = await toAsync(fetch('https://api.example.com/data'));
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
}
```