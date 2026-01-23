# useSessionStorage

响应式的 SessionStorage。

## 示例

```ts
import { useSessionStorage } from '@base-web-kits/base-tools-vue';

const state = useSessionStorage('key', 'default');
```

## 参数

- `key (string)`: 键名。
- `initialValue (any)`: 初始值。

## 返回值

- `(Ref)`: 响应式引用。

## 来源

- [VueUse useSessionStorage](https://vueuse.org/core/useSessionStorage/)
