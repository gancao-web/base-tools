# KeysOfType

根据值类型获取键名联合。

## 示例

```ts
import { KeysOfType } from '@base-web-kits/base-tools-ts';

type Keys = KeysOfType<{ a: string; b: number; c: string }, string>;
// 结果: 'a' | 'c'
```

## 版本

- 1.0.0 新增