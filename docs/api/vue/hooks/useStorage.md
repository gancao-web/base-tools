# useStorage

响应式的 Storage (localStorage/sessionStorage)。

## 示例

```ts
import { useStorage } from '@base-web-kits/base-tools-vue';

const state = useStorage('key', 'default');
```

## 参数

- `key (string)`: 键名。
- `defaults (any)`: 默认值。
- `storage (Storage)`: 存储对象，默认 localStorage。

## 返回值

- `(Ref)`: 响应式引用。

## 来源

- [VueUse useStorage](https://vueuse.org/core/useStorage/)
