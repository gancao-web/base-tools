# isFile

检查 `value` 是否是 File 对象。

## 示例

```ts
import { isFile } from '@base-web-kits/base-tools-ts';

isFile(new File([], 'foo.txt'));
// 结果: true
```

## 参数

- `value (any)`: 要检查的值。

## 返回值

- `(boolean)`: 如果是 File 返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isFile](https://es-toolkit.dev/zh_hans/reference/predicate/isFile.html)
