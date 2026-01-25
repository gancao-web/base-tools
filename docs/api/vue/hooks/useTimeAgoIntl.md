# useTimeAgoIntl

## 描述

使用 Intl.RelativeTimeFormat 的响应式 "多久之前"。

## 示例

```ts
import { useTimeAgoIntl } from '@base-web-kits/base-tools-vue';

const time = new Date();
const timeAgo = useTimeAgoIntl(time); // "now" or localized string
```

## 来源

[VueUse](https://vueuse.org/functions/useTimeAgoIntl/)
