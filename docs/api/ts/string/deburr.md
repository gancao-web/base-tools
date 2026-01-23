# deburr

移除字符串中的变音符号。

## 示例

```ts
import { deburr } from '@base-web-kits/base-tools-ts';

deburr('déjà vu');
// 结果: 'deja vu'
```

## 参数

- `string (string)`: 要处理的字符串。

## 返回值

- `(string)`: 返回处理后的字符串。

## 来源

- [es-toolkit deburr](https://es-toolkit.dev/zh_hans/reference/string/deburr.html)
