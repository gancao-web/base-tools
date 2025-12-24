# createViewRandId

生成随机字符串id

- 常用于生成元素标签的id (默认加上'id\_'前缀, 避免小程序中数字开头的id导致查询节点信息失败)

## 示例

```ts
import { createViewRandId } from '@base-web-kits/base-tools-ts';
const id = createViewRandId(); // 'id_0rjuuuqv60xi'
const id = createViewRandId('canvas_'); // 'canvas_v82a7ctm09q'
```

## 版本

- 1.1.0 新增
