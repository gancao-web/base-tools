# useVibrate

## 描述

响应式的 Vibration API。

## 示例

```ts
import { useVibrate } from '@base-web-kits/base-tools-vue';

const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] });

// 开始震动
vibrate();

// 停止震动
stop();
```

## 来源

[VueUse](https://vueuse.org/functions/useVibrate/)
