# after

创建一个函数，只有在调用了 `n` 次之后才有返回值。

## 示例

```ts
import { after } from '@base-web-kits/base-tools-ts';

const saves = ['profile', 'settings'];
const done = after(saves.length, () => console.log('done saving!'));

saves.forEach((type) => {
  // asyncSave({ 'type': type, 'complete': done });
  done();
});
// 结果: 'done saving!' (在第二次调用后输出)
```

## 参数

- `n (number)`: 调用次数。
- `func (Function)`: 限制调用的函数。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit after](https://es-toolkit.dev/zh_hans/reference/function/after.html)
