# useFavicon

响应式的设置网页图标。

## 示例

```ts
import { useFavicon } from '@base-web-kits/base-tools-vue';

const icon = useFavicon();
icon.value = 'dark.png';
```

## 参数

- `newIcon (string)`: 新图标路径。

## 返回值

- `(Ref)`: 图标的响应式引用。

## 来源

- [VueUse useFavicon](https://vueuse.org/core/useFavicon/)
