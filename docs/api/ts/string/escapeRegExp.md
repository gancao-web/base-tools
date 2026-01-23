# escapeRegExp

转义 RegExp 字符串中特殊的字符。

## 示例

```ts
import { escapeRegExp } from '@base-web-kits/base-tools-ts';

escapeRegExp('[lodash](https://lodash.com/)');
// 结果: '\[lodash\]\(https://lodash\.com/\)'
```

## 参数

- `string (string)`: 要转义的字符串。

## 返回值

- `(string)`: 返回转义后的字符串。

## 来源

- [es-toolkit escapeRegExp](https://es-toolkit.dev/zh_hans/reference/string/escapeRegExp.html)
