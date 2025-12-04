# EventBus

总线式发布订阅

## 示例

```ts
import { EventBus } from '@base-web-kits/base-tools-ts';
const emitter = new EventBus(); // 支持链式调用
emitter.on('xx', fn); // 订阅事件 xx
emitter.once('xx', fn); // 订阅事件 xx 一次
emitter.emit('xx', any); // 发布事件 xx，参数任意
emitter.off('xx'); // 移除事件 xx 下全部监听
emitter.off('xx', fn); // 移除事件 xx 下指定监听
emitter.clear(); // 移除所有事件

// 类型约束
type T = { a: number; b: string };
const em = new EventBus<{ xx: T; yy: void }>();
const fn = (arg: T) => {};
em.on('xx', fn);
em.off('xx', fn);
em.emit('xx', { a: 123, b: '123' }); // 参数为对象
em.emit('yy'); // 无参
```

## 版本

- 1.0.0 新增
