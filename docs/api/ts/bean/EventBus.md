# EventBus

总线式发布订阅

## 示例

```ts
import { EventBus } from '@base-web-kits/base-tools-ts';
// 静态调用 (支持链式)
EventBus.on('xx', fn); // 订阅事件 xx
EventBus.once('xx', fn); // 订阅事件 xx 一次
EventBus.emit('xx', any); // 发布事件 xx，参数任意
EventBus.off('xx'); // 移除事件 xx 下全部监听
EventBus.off('xx', fn); // 移除事件 xx 下指定监听
EventBus.clear(); // 移除所有事件

// 创建实例调用 (支持类型约束)
type T = { a: number; b: string };
const em = new EventBus<{ xx: T; yy: void }>();
const fn = (arg: T) => {};
em.on('xx', fn);
em.off('xx', fn);
em.emit('xx', { a: 123, b: '123' }); // 参数为对象
em.emit('yy'); // 无参
```

## 版本

- 1.0.0 新增实例调用方式
- 1.1.18 新增静态调用方式
