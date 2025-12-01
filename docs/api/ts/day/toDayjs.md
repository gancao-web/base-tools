# toDayjs

创建 dayjs 实例

## 示例

```ts
import { toDayjs } from '@base-web-kits/base-tools-ts';
const d = toDayjs('2021-01-01'); // dayjs 实例
d.format('YYYY-MM-DD HH:mm:ss'); // "2025-12-10 11:33:16"
d.valueOf(); // 毫秒时间戳，如 1765337596913
d.unix(); // 秒时间戳，如 1765337596
d.millisecond(); // 毫秒 913
d.second(); // 秒 16
d.minute(); // 分 33
d.hour(); // 时 11
d.date(); // 日 10
d.day(); // 星期几 5（周日=0）
d.month() + 1; // 月 12
d.year(); // 年 2025
d.startOf('day').valueOf(); // 当日零点
d.startOf('month').format('YYYY-MM-DD HH:mm:ss'); // 月初 "2025-12-01 00:00:00"
d.endOf('month').format('YYYY-MM-DD HH:mm:ss'); // 月末 "2025-12-31 23:59:59"
d.fromNow(); // “刚刚”、“x分钟前/后”、“x小时前/后”、“x天前/后”、“x月前/后”、“x年前/后”
d.isSame(t, 'day'); // 是否与t在同一天
d.diff(); // 与当前时间相差的毫秒数
d.diff(t); // 与t相差的毫秒数
d.diff(t, 'second'); // 与t相差的秒数
d.diff(t, 'minute'); // 与t相差的分钟数
d.diff(t, 'hour'); // 与t相差的小时数
d.diff(t, 'day'); // 与t相差的天数
d.diff(t, 'week'); // 与t相差的周数
d.diff(t, 'month'); // 与t相差的月数
d.diff(t, 'quarter'); // 与t相差的季度数
d.diff(t, 'year'); // 与t相差的年数
```
