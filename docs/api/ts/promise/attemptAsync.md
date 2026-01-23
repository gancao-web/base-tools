# attemptAsync

尝试执行一个异步函数，如果失败返回错误对象。

## 示例

```ts
import { attemptAsync } from '@base-web-kits/base-tools-ts';

const result = await attemptAsync(async () => {
  return 'success';
});

if (isError(result)) {
  console.error(result);
} else {
  console.log(result);
}
```

## 参数

- `func (Function)`: 要尝试的异步函数。

## 返回值

- `(Promise<any|Error>)`: 返回结果或错误对象。

## 来源

- [es-toolkit attemptAsync](https://es-toolkit.dev/zh_hans/reference/promise/attemptAsync.html)
