# flattenTree

按先序深度优先遍历将树展开为一维数组，默认读取节点的 `children` 字段。

## 示例

```ts
import { flattenTree } from '@base-web-kits/base-tools-ts';

const tree = [{ id: 1, children: [{ id: 2 }] }];
flattenTree(tree).map((node) => node.id); // [1, 2]
```

第二个参数可传入子节点读取函数，以适配 `items` 等自定义字段。

## 版本

- 1.6.0 新增
