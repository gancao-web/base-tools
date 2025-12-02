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
```
