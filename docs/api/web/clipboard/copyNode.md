# copyNode

复制 DOM 节点到剪贴板（移动端与 PC）  
使用场景：页面已有区域的可视化复制；元素使用 `outerHTML`，非元素使用其文本内容。

## 示例

```ts
import { copyNode } from '@base-web-kits/base-tools-web';

const el = document.querySelector('#article')!;
await copyNode(el);
```

## 版本

- 1.0.0 新增
