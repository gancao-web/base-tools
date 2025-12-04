# arrayMove

拖拽排序 (不改变原数组)

## 示例

```ts
import { arrayMove } from '@base-web-kits/base-tools-ts';

const list = ['a', 'b', 'c', 'd'];
const newList = arrayMove(list, 1, 3); // 将索引1的元素移动到索引3
console.log(newList); // ['a', 'c', 'd', 'b']
console.log(list); // 原数组不变 ['a', 'b', 'c', 'd']
```

## 版本

- 1.0.0 新增
