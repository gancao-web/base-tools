# useBluetooth

## 描述

响应式的 Web Bluetooth API。

## 示例

```ts
import { useBluetooth } from '@base-web-kits/base-tools-vue';

const { isSupported, isConnected, device, requestDevice, server } = useBluetooth({
  acceptAllDevices: true,
});
```

## 来源

[VueUse](https://vueuse.org/functions/useBluetooth/)
