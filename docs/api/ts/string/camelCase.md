# camelCase

将字符串转换为驼峰写法。

## 示例

```ts
import { camelCase } from '@base-web-kits/base-tools-ts';

camelCase('Foo Bar');
// 结果: 'fooBar'

camelCase('--foo-bar--');
// 结果: 'fooBar'

camelCase('__FOO_BAR__');
// 结果: 'fooBar'
```

## 参数

- `string (string)`: 要转换的字符串。

## 返回值

- `(string)`: 返回驼峰写法的字符串。

## 来源

- [es-toolkit camelCase](https://es-toolkit.dev/zh_hans/reference/string/camelCase.html)
