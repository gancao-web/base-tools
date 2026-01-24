# useWebNotification

## 描述

响应式的 Web Notification API。

## 示例

```ts
import { useWebNotification } from '@base-web-kits/base-tools-vue';

const {
  isSupported,
  notification,
  show,
  close,
  onClick,
  onShow,
  onError,
  onClose,
} = useWebNotification({
  title: 'Hello World from VueUse!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
});

show();
```

## 来源

[VueUse](https://vueuse.org/functions/useWebNotification/)
