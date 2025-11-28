import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import 'dayjs/locale/zh-cn';
import { zeroPad } from '../number';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.locale('zh-cn');

type BaseTime = number | string | Date | dayjs.Dayjs | null | undefined;

/**
 * 创建 dayjs 实例
 * 文档: https://day.js.org/zh-CN/
 * @param t 各种规范或不规范的时间
 * @returns dayjs 实例
 * @example
 * const d = toDayjs('2021-01-01'); // dayjs 实例
 * d.format('YYYY-MM-DD HH:mm:ss'); // "2025-12-10 11:33:16"
 * d.valueOf(); // 毫秒时间戳，如 1765337596913
 * d.unix(); // 秒时间戳，如 1765337596
 * d.millisecond(); // 毫秒 913
 * d.second(); // 秒 16
 * d.minute(); // 分 33
 * d.hour(); // 时 11
 * d.date(); // 日 10
 * d.day(); // 星期几 5（周日=0）
 * d.month() + 1; // 月 12
 * d.year(); // 年 2025
 * d.startOf('day').valueOf(); // 当日零点
 * d.startOf('month').format('YYYY-MM-DD HH:mm:ss'); // 月初 "2025-12-01 00:00:00"
 * d.endOf('month').format('YYYY-MM-DD HH:mm:ss'); // 月末 "2025-12-31 23:59:59"
 * d.fromNow(); // “刚刚”、“x分钟前/后”、“x小时前/后”、“x天前/后”、“x月前/后”、“x年前/后”
 * d.isSame(t, 'day'); // 是否与t在同一天
 * d.diff(); // 与当前时间相差的毫秒数
 * d.diff(t); // 与t相差的毫秒数
 * d.diff(t, 'second'); // 与t相差的秒数
 * d.diff(t, 'minute'); // 与t相差的分钟数
 * d.diff(t, 'hour'); // 与t相差的小时数
 * d.diff(t, 'day'); // 与t相差的天数
 * d.diff(t, 'week'); // 与t相差的周数
 * d.diff(t, 'month'); // 与t相差的月数
 * d.diff(t, 'quarter'); // 与t相差的季度数
 * d.diff(t, 'year'); // 与t相差的年数
 */
export function toDayjs(t: BaseTime, fmt?: dayjs.OptionType) {
  if (t === null || t === undefined) return dayjs();
  if (typeof t === 'number') {
    const s = String(Math.trunc(t));
    return dayjs(s.length === 10 ? t * 1000 : t, fmt);
  }
  if (typeof t === 'string') {
    const s = t.trim();
    if (/^\d{10}$/.test(s)) return dayjs(Number(s) * 1000, fmt);
    if (/^\d{13}$/.test(s)) return dayjs(Number(s), fmt);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return dayjs(s, fmt || 'YYYY-MM-DD');
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(s)) return dayjs(s, fmt || 'YYYY/MM/DD');
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(s))
      return dayjs(s, fmt || 'YYYY-MM-DD HH:mm:ss');
    if (/^\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(s))
      return dayjs(s, fmt || 'YYYY/MM/DD HH:mm:ss');
    return dayjs(s, fmt);
  }
  return dayjs(t, fmt);
}

/**
 * 获取“前几天”的日期范围
 * @param offset 正整数天数
 * @param fmt 日期格式，默认 `YYYY-MM-DD`
 * @returns `[start, end]` 日期字符串数组
 * @example
 * 若今天为 2025-11-19：
 * getDateRangeBefore(1) // ['2025-11-18', '2025-11-19']
 * getDateRangeBefore(1, 'YYYY-MM-DD HH:mm:ss') // ['2025-11-18 00:00:00', '2025-11-19 23:59:59']
 */
export function getDateRangeBefore(offset: number, fmt = 'YYYY-MM-DD') {
  const now = toDayjs(Date.now());
  const n = Math.max(0, Math.trunc(offset));
  const hasTime = /H|h|m|s|S|A|a|x|X/.test(fmt);
  const startDay = now.add(-n, 'day');
  const endDay = now;
  const start = (hasTime ? startDay.startOf('day') : startDay).format(fmt);
  const end = (hasTime ? endDay.endOf('day') : endDay).format(fmt);
  return [start, end];
}

/**
 * 获取“后几天”的日期范围
 * - 起点：今天；终点：`offset` 天后
 * - 若 `fmt` 含时间令牌（如 `HH:mm:ss`），则返回整日范围：起点为当日零点，终点为当日末尾
 * @param offset 正整数天数
 * @param fmt 日期格式，默认 `YYYY-MM-DD`
 * @returns `[start, end]` 日期字符串数组
 * @example
 * 若今天为 2025-11-19：
 * getDateRangeAfter(1) // ['2025-11-19', '2025-11-20']
 * getDateRangeAfter(1, 'YYYY-MM-DD HH:mm:ss') // ['2025-11-19 00:00:00', '2025-11-20 23:59:59']
 */
export function getDateRangeAfter(offset: number, fmt = 'YYYY-MM-DD') {
  const now = toDayjs(Date.now());
  const n = Math.max(0, Math.trunc(offset));
  const hasTime = /H|h|m|s|S|A|a|x|X/.test(fmt);
  const startDay = now;
  const endDay = now.add(n, 'day');
  const start = (hasTime ? startDay.startOf('day') : startDay).format(fmt);
  const end = (hasTime ? endDay.endOf('day') : endDay).format(fmt);
  return [start, end];
}

/**
 * 获取倒计时的时间分解（零填充字符串）
 * @param diff 毫秒差值（正数表示剩余时间，负数/0表示已到期）
 * @returns 包含天、时、分、秒、毫秒的零填充对象
 * @example
 * const diff = toDayjs(t).diff(); // 毫秒差值
 * const parts = getCountdownParts(diff); // { d: '01', h: '02', m: '03', s: '04', ms: '567' }
 */
export function getCountdownParts(diff: number) {
  if (diff <= 0) return { d: '00', h: '00', m: '00', s: '00', ms: '000' };

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const ms = diff % 1000;

  return {
    d: zeroPad(d),
    h: zeroPad(h),
    m: zeroPad(m),
    s: zeroPad(s),
    ms: zeroPad(ms, 3),
  };
}

/**
 * 通过出生日期计算年龄
 * @param birthdate 生日日期，支持多种格式（会被自动解析）
 * @returns 年龄对象，包含 `age`（年龄数值）和 `type`（年龄单位，'year' 表示年，'month' 表示月）
 * @example
 * // 假设当前日期为 2025-11-19
 * getAgeByBirthdate('2025-05-10'); // { age: 6, type: 'month' }
 * getAgeByBirthdate('2020-11-19'); // { age: 5, type: 'year' }
 * getAgeByBirthdate('2020-12-01'); // { age: 4, type: 'year' }（生日还没到, 所以年龄是4岁）
 */
export function getAgeByBirthdate(birthdate: string) {
  const birth = toDayjs(birthdate, 'YYYY-MM-DD');
  const now = toDayjs(Date.now());

  // 精确的月份计算
  const totalMonths = (now.year() - birth.year()) * 12 + (now.month() - birth.month());

  // 如果当前日期小于出生日期，月份减1
  const adjustedMonths = now.date() < birth.date() ? totalMonths - 1 : totalMonths;

  if (adjustedMonths >= 12) {
    let age = Math.floor(adjustedMonths / 12);
    // 检查生日是否已过
    const birthdayThisYear = birth.add(age, 'year');
    if (now.isBefore(birthdayThisYear)) {
      age--;
    }
    return { age, type: 'year' };
  }

  return { age: adjustedMonths, type: 'month' };
}

/**
 * 对外抛出 dayjs 以便全局配置
 * @example
 * 切换语言
 * dayjs.locale('en'); // 切换为英文
 * dayjs.locale('zh-cn'); // 切换为中文 (默认)
 */
export { dayjs };
