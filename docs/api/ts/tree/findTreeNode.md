# findTreeNode

按先序深度优先遍历，返回第一个满足条件的节点；未命中时返回 `undefined`。

## 示例

```ts
import { findTreeNode } from '@base-web-kits/base-tools-ts';

const tree = [{ id: 1, children: [{ id: 2 }] }];
findTreeNode(tree, (node) => node.id === 2); // { id: 2 }
```

## 版本

- 1.6.0 新增
