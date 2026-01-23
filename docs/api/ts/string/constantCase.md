# constantCase

将字符串转换为 CONSTANT_CASE（全大写下划线连接）。

## 示例

```ts
import { constantCase } from '@base-web-kits/base-tools-ts';

constantCase('Foo Bar');
// 结果: 'FOO_BAR'

constantCase('fooBar');
// 结果: 'FOO_BAR'
```

## 参数

- `string (string)`: 要转换的字符串。

## 返回值

- `(string)`: 返回 CONSTANT_CASE 的字符串。

## 来源

- [es-toolkit constantCase](https://es-toolkit.dev/zh_hans/reference/string/constantCase.html)
