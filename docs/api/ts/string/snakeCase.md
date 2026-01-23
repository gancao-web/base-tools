# snakeCase

将字符串转换为 snake case（下划线连接）。

## 示例

```ts
import { snakeCase } from '@base-web-kits/base-tools-ts';

snakeCase('Foo Bar');
// 结果: 'foo_bar'

snakeCase('fooBar');
// 结果: 'foo_bar'
```

## 参数

- `string (string)`: 要转换的字符串。

## 返回值

- `(string)`: 返回 snake case 的字符串。

## 来源

- [es-toolkit snakeCase](https://es-toolkit.dev/zh_hans/reference/string/snakeCase.html)
