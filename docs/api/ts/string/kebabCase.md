# kebabCase

将字符串转换为 kebab case（短横线连接）。

## 示例

```ts
import { kebabCase } from '@base-web-kits/base-tools-ts';

kebabCase('Foo Bar');
// 结果: 'foo-bar'

kebabCase('fooBar');
// 结果: 'foo-bar'

kebabCase('__FOO_BAR__');
// 结果: 'foo-bar'
```

## 参数

- `string (string)`: 要转换的字符串。

## 返回值

- `(string)`: 返回 kebab case 的字符串。

## 来源

- [es-toolkit kebabCase](https://es-toolkit.dev/zh_hans/reference/string/kebabCase.html)
