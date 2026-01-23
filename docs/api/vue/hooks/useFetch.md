# useFetch

响应式的 Fetch API。

## 示例

```ts
import { useFetch } from '@base-web-kits/base-tools-vue';

const { data, error } = useFetch('https://api.example.com').json();
```

## 参数

- `url (string)`: 请求地址。

## 返回值

- `(Object)`: 包含 data, error, isFinished 等的对象。

## 来源

- [VueUse useFetch](https://vueuse.org/core/useFetch/)
