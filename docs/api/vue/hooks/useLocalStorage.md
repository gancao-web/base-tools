# useLocalStorage

响应式的 LocalStorage。

## 示例

```ts
import { useLocalStorage } from '@base-web-kits/base-tools-vue';

const state = useLocalStorage('my-storage', { name: 'Apple', color: 'red' });
```

## 参数

- `key (string)`: 存储键名。
- `initialValue (any)`: 初始值。

## 返回值

- `(Ref)`: 响应式引用。

## 来源

- [VueUse useLocalStorage](https://vueuse.org/core/useLocalStorage/)
