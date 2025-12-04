# toChineseNum

阿拉伯数字转中文整数（忽略小数；支持负数）。

## 示例

```ts
import { toChineseNum } from '@base-web-kits/base-tools-ts';
toChineseNum(123456); // "十二万三千四百五十六"
toChineseNum(-10008); // "负一万零八"
`第${toChineseNum(123)}条`; // "第一百二十三条"
```

## 版本

- 1.0.0 新增
