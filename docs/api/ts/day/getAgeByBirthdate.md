# getAgeByBirthdate

通过出生日期计算年龄

## 示例

```ts
import { getAgeByBirthdate } from '@base-web-kits/base-tools-ts';
// 假设当前日期为 2025-11-19
getAgeByBirthdate('2025-05-10'); // { age: 6, type: 'month' }
getAgeByBirthdate('2020-11-19'); // { age: 5, type: 'year' }
getAgeByBirthdate('2020-12-01'); // { age: 4, type: 'year' }（生日还没到, 所以年龄是4岁）
```
