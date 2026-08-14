# findTreePath

查找第一个满足条件的节点，并返回从根节点到该节点的完整节点路径。

## 示例

```ts
import { findTreePath } from '@base-web-kits/base-tools-ts';

const tree = [{ id: 1, children: [{ id: 2 }] }];
findTreePath(tree, (node) => node.id === 2)?.map((node) => node.id); // [1, 2]
```

未命中时返回 `undefined`。

## 版本

- 1.6.0 新增
