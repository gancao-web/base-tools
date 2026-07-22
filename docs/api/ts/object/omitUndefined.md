# omitUndefined

移除对象顶层值为 `undefined` 的可枚举自有字段，不改变原对象。

- `null`、`false`、空字符串和 `0` 会被保留。
- 始终返回新的浅拷贝，即使对象中没有值为 `undefined` 的字段。
- 嵌套对象不会被递归处理，并且仍与原对象共享引用。

## 示例

```ts
import { omitUndefined } from '@base-web-kits/base-tools-ts';

const source = {
  name: 'Alice',
  age: undefined,
  enabled: false,
  score: 0,
  profile: { city: undefined },
};

const result = omitUndefined(source);
// 结果: {
//   name: 'Alice',
//   enabled: false,
//   score: 0,
//   profile: { city: undefined },
// }

result === source; // false
result.profile === source.profile; // true
```

传入 `undefined` 时返回空对象：

```ts
omitUndefined(undefined);
// 结果: {}
```

## 参数

- `obj (Object | undefined)`: 目标对象。

## 返回值

- `(Object)`: 移除值为 `undefined` 的顶层字段后生成的新对象。

## 版本

- 1.4.10 新增
