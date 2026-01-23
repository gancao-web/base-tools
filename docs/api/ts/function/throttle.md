# throttle

创建一个节流函数。

## 示例

```ts
import { throttle } from '@base-web-kits/base-tools-ts';

// 避免在滚动时频繁更新定位。
window.addEventListener('scroll', throttle(updatePosition, 100));
```

## 参数

- `func (Function)`: 要节流的函数。
- `wait (number)`: 延迟毫秒数。
- `options (Object)`: 选项对象。

## 返回值

- `(Function)`: 返回节流函数。

## 来源

- [es-toolkit throttle](https://es-toolkit.dev/zh_hans/reference/function/throttle.html)
