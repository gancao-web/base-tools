import { BigNumber } from './big';

/**
 * 开头补零
 * @param n 数字
 * @param len 总长度，默认 2
 * @returns 零填充后的字符串
 * @example
 * zeroPad(1) // '01'
 * zeroPad(12) // '12'
 * zeroPad(12, 4) // '0012'
 */
export function zeroPad(n: number | string, len = 2) {
  return String(n).padStart(len, '0');
}

/**
 * 给数字添加指定单位 (支持数字字符串,其他非法字符返回原值)
 * @param unit 单位
 * @param num 数字
 * @example
 * withUnit(0, 'px') // "0px"
 * withUnit(1, 'px') // "1px"
 * withUnit('1', 'rpx') // "1rpx"
 * withUnit('1', '%') // "1%"
 * withUnit('auto', 'px') // "auto"
 * withUnit(null | undefined | '') // ""
 */
export function withUnit(num?: number | string, unit = '') {
  if (num === null || num === undefined || num === '') return ''; // 注意不能排除0

  if (typeof num === 'number') return `${num}${unit}`;

  const str = String(num).trim();

  if (str === '') return '';

  return isNaN(+str) ? str : `${str}${unit}`;
}

/**
 * 给数字添加px单位 (支持数字字符串,其他非法字符返回原值)
 * @example
 * withUnitPx(10) // "10px"
 * withUnitPx('10') // "10px"
 * withUnitPx('10px') // "10px"
 * withUnitPx("auto") // "auto"
 * withUnitPx("30%") // "30%"
 * withUnitPx(null | undefined | '') // ""
 * withUnitPx(0) // "0px"
 */
export function withUnitPx(num?: string | number) {
  return withUnit(num, 'px');
}

/**
 * 给数字添加距离单位：当数值大于等于 1000m 时转换为 km，否则显示 m（最多两位小数、无无意义补零）
 * @example
 * withDistance(5); // => '5m'
 * withDistance(999.456); // => '999.46m'
 * withDistance(1000); // => '1km'
 * withDistance('1500'); // => '1.5km'
 * withDistance('1728'); // => '1.73km'
 */
export function withDistance(m: number | string): string {
  const n = Number(m ?? 0);
  if (!Number.isFinite(n)) return '0m';
  return n >= 1000 ? `${+(n / 1000).toFixed(2)}km` : `${+n.toFixed(2)}m`;
}

/**
 * 数字转千分位字符串（保留小数与符号）。
 * @example
 * toThousandth(1234567); // => '1,234,567'
 * toThousandth('1234567.89'); // => '1,234,567.89'
 * toThousandth('-987654'); // => '-987,654'
 */
export function toThousandth(str: number | string): string {
  const v = String(str ?? '').trim();
  if (v === '') return '';

  // 处理符号
  let sign = '';
  let num = v;
  if (num[0] === '-' || num[0] === '+') {
    sign = num[0];
    num = num.slice(1);
  }

  // 拆分整数与小数部分
  const [intPart, decPart] = num.split('.');

  // 仅对整数部分进行千分位分组
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decPart !== undefined && decPart !== ''
    ? `${sign}${groupedInt}.${decPart}`
    : `${sign}${groupedInt}`;
}

/**
 * 阿拉伯数字转中文整数（忽略小数；支持负数）。
 * @param num 输入的数字或数字字符串（小数部分将被丢弃）
 * @returns 中文数字字符串；非法输入返回空字符串
 * @example
 * toChineseNum(123456);   // "十二万三千四百五十六"
 * toChineseNum(-10008);   // "负一万零八"
 * `第${toChineseNum(123)}条` // "第一百二十三条"
 */
export function toChineseNum(num: number | string) {
  const numInt = Math.trunc(+num);
  if (numInt === 0) return '零';

  const digit = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unit = ['', '十', '百', '千'];
  const bigUnit = ['', '万', '亿', '兆'];

  const section4 = (n: number) => {
    let str = '',
      zeroFlag = false;
    for (let i = 0; i < 4; i++) {
      const d = n % 10;
      n = Math.floor(n / 10);
      if (d === 0) {
        zeroFlag = true;
        continue;
      }
      if (zeroFlag) str = digit[0] + str;
      str = digit[d] + unit[i] + str;
      zeroFlag = false;
    }
    return str;
  };

  let res = '';
  let sectionIndex = 0;
  let n = Math.abs(numInt);

  while (n > 0) {
    const seg = n % 10000;
    n = Math.floor(n / 10000);
    if (seg) {
      const segStr = section4(seg);
      res = segStr + (sectionIndex ? bigUnit[sectionIndex] : '') + res;
    } else if (res && !res.startsWith('零')) {
      res = `零${res}`;
    }
    sectionIndex++;
  }

  res = res.replace(/^一十/, '十');

  return numInt < 0 ? `负${res}` : res;
}

/**
 * 金额转中文大写（支持角/分/厘，精度控制）。
 * @param amount 金额（支持 number | string），非法或非有限数返回空串
 * @param opts 配置项
 * @param opts.precision 保留小数位（0~3），对应：0无小数、1角、2角分、3角分厘；默认 2
 * @param opts.rm 舍入模式，默认 `BigNumber.ROUND_HALF_UP`（四舍五入）
 * @param opts.yuanChar 元单位字符（`'元' | '圆'`），默认 `'元'`
 * @returns 中文大写金额字符串；示例：`壹佰贰拾叁元肆角伍分`
 * @example
 * toChineseCurrency(0) // '零元整'
 * toChineseCurrency(10) // '拾元整'
 * toChineseCurrency(101) // '壹佰零壹元整'
 * toChineseCurrency(1001000) // '壹佰万零壹仟元整'
 * toChineseCurrency(1001.01) // '壹仟零壹元壹分'
 * toChineseCurrency('1234.5679', { precision: 3 }) // '壹仟贰佰叁拾肆元伍角陆分捌厘'
 * toChineseCurrency(-1.2) // '负壹元贰角'
 */
export function toChineseCurrency(
  amount: number | string,
  opts: {
    precision?: 0 | 1 | 2 | 3;
    rm?: BigNumber.RoundingMode;
    yuanChar?: '元' | '圆';
  } = {},
): string {
  const dp = opts.precision ?? 2;
  const rm = opts.rm ?? BigNumber.ROUND_HALF_UP;
  const yuan = opts.yuanChar ?? '元';

  // 1. 非法输入直接返回空串
  if (amount === null || amount === undefined) return '';
  const bn = new BigNumber(amount);
  if (!bn.isFinite()) return '';

  // 2. 转字符串并拆分整数/小数
  const s = bn.toFixed(dp, rm);
  const sign = s.startsWith('-') ? '负' : '';
  const [intStr, decStr = ''] = s.replace(/^-/, '').split('.');

  // 3. 数字与大写映射
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = ['', '拾', '佰', '仟'];
  const bigUnit = ['', '万', '亿', '兆'];
  const smallUnit = ['角', '分', '厘'];

  // 4. 四位一段转换整数
  const section4 = (n: BigNumber): string => {
    let str = '';
    let zeroFlag = false;
    for (let i = 0; i < 4; i++) {
      const d = n.mod(10).toNumber();
      n = n.idiv(10);
      if (d === 0) {
        zeroFlag = true;
        continue;
      }
      if (zeroFlag) str = digit[0] + str;
      str = digit[d] + unit[i] + str;
      zeroFlag = false;
    }
    return str.replace(/零+$/g, '');
  };

  const intNum = new BigNumber(intStr);
  let res = '';
  if (intNum.isZero()) {
    res = digit[0];
  } else {
    let n = intNum.abs();
    let sectionIndex = 0;
    while (n.gt(0)) {
      const seg = n.mod(10000);
      n = n.idiv(10000);
      if (seg.gt(0)) {
        const segStr = section4(seg);
        const needZero =
          res && !res.startsWith(digit[0]) && (seg.lt(1000) || seg.mod(1000).isZero());
        const bu = sectionIndex ? bigUnit[sectionIndex] : '';
        res = segStr + bu + (needZero ? digit[0] : '') + res;
      } else if (res && !res.startsWith(digit[0])) {
        res = digit[0] + res;
      }
      sectionIndex++;
    }
    res = res.replace(/^壹拾/, '拾');
  }

  // 5. 小数部分（角分厘）
  let frac = '';
  for (let i = 0; i < Math.min(3, dp); i++) {
    const ch = decStr[i] || '0';
    const d = ch.charCodeAt(0) - 48;
    if (d > 0) frac += digit[d] + smallUnit[i];
  }

  // 6. 拼接
  return frac ? `${sign}${res}${yuan}${frac}` : `${sign}${res}${yuan}整`;
}
