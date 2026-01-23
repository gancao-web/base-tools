# debounce

创建一个防抖函数。

## 示例

```ts
import { debounce } from '@base-web-kits/base-tools-ts';

// 避免窗口在变动时重新计算布局带来的开销。
window.addEventListener('resize', debounce(calculateLayout, 150));
```

## 参数

- `func (Function)`: 要防抖的函数。
- `wait (number)`: 延迟毫秒数。
- `options (Object)`: 选项对象。

## 返回值

- `(Function)`: 返回防抖函数。

## 来源

- [es-toolkit debounce](https://es-toolkit.dev/zh_hans/reference/function/debounce.html)
