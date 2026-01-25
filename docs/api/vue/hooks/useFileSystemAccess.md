# useFileSystemAccess

## 描述

响应式的 File System Access API。

## 示例

```ts
import { useFileSystemAccess } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const content = ref('');
const { open, save, saveAs, updateData } = useFileSystemAccess({
  dataType: 'Text',
});
```

## 来源

[VueUse](https://vueuse.org/functions/useFileSystemAccess/)
