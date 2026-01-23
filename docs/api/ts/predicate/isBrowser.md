# isBrowser

检查当前环境是否是浏览器环境。

## 示例

```ts
import { isBrowser } from '@base-web-kits/base-tools-ts';

if (isBrowser()) {
  console.log('Running in browser');
}
```

## 返回值

- `(boolean)`: 如果是浏览器环境返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isBrowser](https://es-toolkit.dev/zh_hans/reference/predicate/isBrowser.html)
