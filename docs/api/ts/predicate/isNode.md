# isNode

检查当前环境是否是 Node.js 环境。

## 示例

```ts
import { isNode } from '@base-web-kits/base-tools-ts';

if (isNode()) {
  console.log('Running in Node.js');
}
```

## 返回值

- `(boolean)`: 如果是 Node.js 环境返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isNode](https://es-toolkit.dev/zh_hans/reference/predicate/isNode.html)
