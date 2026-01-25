# useDropZone

## 描述

创建拖放区域。

## 示例

```ts
import { useDropZone } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const dropZoneRef = ref<HTMLElement>();

const { isOver } = useDropZone(dropZoneRef, {
  onDrop: (files) => {
    // do something with files
  },
});
```

## 来源

[VueUse](https://vueuse.org/functions/useDropZone/)
