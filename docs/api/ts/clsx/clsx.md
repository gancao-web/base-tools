# clsx

根据字符串、数组和条件对象拼接 CSS 类名。本函数从 `clsx` 包重导出，同时提供 `ClassValue` 输入类型。

## 示例

```ts
import { clsx, type ClassValue } from '@base-web-kits/base-tools-ts';

const classes: ClassValue[] = [
  'button',
  ['button--primary'],
  { 'button--disabled': true, 'button--loading': false },
];

clsx(classes);
// 结果: 'button button--primary button--disabled'
```

假值会被忽略：

```ts
clsx('button', false, null, undefined, 0, 'active');
// 结果: 'button active'
```

## 参数

- `inputs (...ClassValue[])`: 要拼接的类名，可以是字符串、数字、数组、条件对象或假值。

## 返回值

- `(string)`: 以空格分隔的类名字符串。

## 来源

- [clsx](https://github.com/lukeed/clsx)

## 版本

- 1.4.10 新增
