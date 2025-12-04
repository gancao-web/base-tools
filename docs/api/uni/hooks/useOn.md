# useOn

全局事件监听 (组件销毁时取消监听,避免重复监听导致多次触发)

## 示例

```ts
import { useOn } from '@base-web-kits/base-tools-uni';

useOn('eventName', (result) => {
  console.log(result);
});
```

## 版本

- 1.0.0 新增
