# useWebWorkerFn

## 描述

使用 Web Worker 执行繁重计算的函数。

## 示例

````ts
import { useWebWorkerFn } from '@base-web-kits/base-tools-vue';

const { workerFn, workerStatus, workerTerminate } = useWebWorkerFn(
  (numbers: number[]) => {
    return numbers.reduce((a, b) => a + b, 0);
  },
);

// const result = await workerFn([1, 2, 3]); // 6
``` 示例代码
````

## 来源

[VueUse](https://vueuse.org/functions/useWebWorkerFn/)
