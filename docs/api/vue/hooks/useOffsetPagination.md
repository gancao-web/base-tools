# useOffsetPagination

## 描述

响应式的偏移分页。

## 示例

```ts
import { useOffsetPagination } from '@base-web-kits/base-tools-vue';

const { currentPage, currentPageSize, pageCount, isFirstPage, isLastPage, prev, next } =
  useOffsetPagination({
    total: 100,
    page: 1,
    pageSize: 10,
    onPageChange: (page) => {
      console.log(page);
    },
    onPageSizeChange: (pageSize) => {
      console.log(pageSize);
    },
  });
```

## 来源

[VueUse](https://vueuse.org/functions/useOffsetPagination/)
