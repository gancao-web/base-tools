# escape

转义字符串中的 HTML 特殊字符。

## 示例

```ts
import { escape } from '@base-web-kits/base-tools-ts';

escape('fred, barney, & pebbles');
// 结果: 'fred, barney, &amp; pebbles'
```

## 参数

- `string (string)`: 要转义的字符串。

## 返回值

- `(string)`: 返回转义后的字符串。

## 来源

- [es-toolkit escape](https://es-toolkit.dev/zh_hans/reference/string/escape.html)
