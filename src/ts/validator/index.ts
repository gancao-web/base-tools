/**
 * 纯字母（不含空格与符号）。
 * @param s 字符串
 * @returns 是否为字母
 * @example
 * isLetter('abc') // true
 * isLetter('123') // false
 * isLetter('abc123') // false
 */
export function isLetter(s: string) {
  return /^[a-zA-Z]*$/.test(s);
}

/**
 * 纯中文（不含空格与符号）。
 * @param s 字符串
 * @returns 是否为纯中文
 * @example
 * isChinese('你好') // true
 */
export function isChinese(s: string) {
  const v = String(s ?? '').trim();
  return /^[\u4E00-\u9FA5]+$/.test(v);
}

/**
 * 纯数字（非负整数,不含空格与符号）。
 * @param s 字符串
 * @returns 是否为数字
 * @example
 * isDigits('12') // true
 * isDigits('1.2') // false
 * isDigits('-12') // false
 * isDigits('a12') // false
 */
export function isDigits(s: string) {
  return /^[0-9]+$/.test(s);
}

/**
 * 数字字符串格式校验
 * @param value   待验证值（字符串或数字）
 * @param options 可选项
 * @param options.negative 是否允许负数，默认 false
 * @param options.decimal 小数位数，默认 2（0 表示必须整数）
 * @param options.thousands 是否允许千分位逗号，默认 false
 * @param options.leadZero 是否允许整数部分出现多余前导0 (默认false, 即禁止'007'，但允许'0.50')
 * @example
 * isNumeric('123.45'); // true
 * isNumeric('123.45', { decimal: 0 }); // false
 * isNumeric('-1,234.5', { negative: true, thousands: true }); // true
 * isNumeric('0123', { leadZero: true }); // true（现在允许）
 * isNumeric('0123'); // false（默认禁止）
 * isNumeric('0.50'); // true（始终允许）
 * isNumeric('.5'); // false（整数部分不能省）
 * isNumeric('123.'); // false（小数部分不能省）
 */
export function isNumeric(
  value: string | number,
  options?: {
    negative?: boolean;
    decimal?: number;
    thousands?: boolean;
    leadZero?: boolean;
  },
): boolean {
  const { negative = false, decimal = 2, thousands = false, leadZero = false } = options || {};

  if (value === null || value === undefined || value === '') return false;
  const str = String(value).trim();

  const sign = negative && str.startsWith('-') ? '-' : '';
  const body = sign ? str.slice(1) : str;

  const thousandsPart = thousands ? '(?:[1-9]\\d{0,2}(,\\d{3})*|0)' : '(?:\\d+)';

  const intPart = thousands ? thousandsPart : leadZero ? '(?:\\d+)' : '(?:0|[1-9]\\d*)';

  const fracPart = decimal === 0 ? '' : `(\\.\\d{1,${decimal}})`;

  const pattern = `^${intPart}${fracPart}$`;
  const reg = new RegExp(pattern);
  return reg.test(body);
}

/**
 * 是否为中国大陆手机号（11 位，以 1 开头，第二位 3-9）。
 * @param s 待校验的号码
 * @returns 是否为合法手机号
 * @example
 * isMobilePhone('13800138000') // true
 * isMobilePhone('12800138000') // false
 */
export function isMobilePhone(s: string) {
  const v = String(s ?? '').trim();
  return /^1[3-9]\d{9}$/.test(v);
}

/**
 * 是否为中国大陆座机号（区号-号码，可选分机）。
 * 格式：`0AA-BBBBBBBB(-EXT)`，其中区号 2-3 位、号码 7-8 位、分机 1-6 位。
 * @param s 待校验的号码
 * @returns 是否为合法座机号
 * @example
 * isLandline('010-88888888') // true
 * isLandline('0371-12345678-123') // true
 */
export function isLandline(s: string) {
  const v = String(s ?? '').trim();
  return /^0\d{2,3}-?\d{7,8}(?:-\d{1,6})?$/.test(v);
}

/**
 * 联系电话：是否为中国大陆“手机号或座机号”。
 * @param s 待校验的号码
 * @returns 是否为合法的手机号或座机号
 * @example
 * isPhone('13800138000') // true
 * isPhone('010-88888888') // true
 */
export function isPhone(s: string) {
  return isMobilePhone(s) || isLandline(s);
}

/**
 * 校验邮箱地址（基于 RFC 5322 的常用子集）。
 * @param s 待校验的邮箱字符串
 * @returns 是否为合法邮箱
 * @example
 * isEmail('user@example.com') // true
 * isEmail('invalid@') // false
 */
export function isEmail(s: string) {
  const v = String(s ?? '').trim();
  if (v === '') return false;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
  return emailRegex.test(v);
}

/**
 * 中文姓名（允许中间点 `·`），长度 2-20。
 * @param s 姓名
 * @returns 是否为合法中文姓名
 * @example
 * isChineseName('张三') // true
 * isChineseName('阿·娜') // true
 */
export function isChineseName(s: string) {
  const v = String(s ?? '').trim();
  return /^[\u4E00-\u9FA5·]{2,20}$/.test(v);
}

/**
 * 身份证校验（支持中国大陆严格校验；台湾/香港/澳门做格式校验）。
 * 规则：
 * - 中国大陆（严格）：18 位校验位 + 出生日期合法性；兼容 15 位旧号（日期校验）；
 * - 台湾（格式）：`^[A-Z][12]\d{8}$`（首字母 + 性别位 1/2 + 8 位数字）；不含校验位算法；
 * - 香港（格式）：`^[A-Z]{1,2}\d{6}\(?[0-9A]\)?$`（1-2 字母 + 6 位数字 + 校验位，可带括号）；
 * - 澳门（格式）：常见为 `^[157]\d{6}\(?\d\)?$`（类别位 1/5/7 + 7 位数字 + 校验位，可带括号）。
 * @param code 身份证号码
 * @returns 是否为合法身份证号
 * @example
 * isIdentityCard('11010519491231002X') // true（大陆）
 * isIdentityCard('A123456789') // true（台湾格式）
 * isIdentityCard('A123456(3)') // true（香港格式）
 * isIdentityCard('1234567(8)') // true（澳门格式）
 */
export function isIdentityCard(code: string) {
  const v = String(code ?? '').trim();
  if (v === '') return false;

  const isValidDate = (yyyymmdd: string) => {
    const y = Number(yyyymmdd.slice(0, 4));
    const m = Number(yyyymmdd.slice(4, 6));
    const d = Number(yyyymmdd.slice(6, 8));
    if (y < 1900 || y > 2100) return false;
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  };

  // 18位校验
  if (/^\d{17}[\dXx]$/.test(v)) {
    const birth = v.slice(6, 14);
    if (!isValidDate(birth)) return false;
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    for (let i = 0; i < 17; i++) sum += Number(v[i]) * weights[i];
    const mod = sum % 11;
    const code18 = v[17].toUpperCase();
    return checkMap[mod] === code18;
  }

  // 15位旧号：仅校验日期（第7~12位），不做校验位
  if (/^\d{15}$/.test(v)) {
    const birth = v.slice(6, 12);
    const y = Number(`19${birth.slice(0, 2)}`);
    const m = Number(birth.slice(2, 4));
    const d = Number(birth.slice(4, 6));
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  }

  // 台湾（格式校验）
  if (/^[A-Za-z][12]\d{8}$/.test(v)) return true;

  // 香港（格式校验）：支持最后一位带括号与不带括号
  if (/^[A-Za-z]{1,2}\d{6}\(?[0-9A]\)?$/.test(v)) return true;

  // 澳门（格式校验）：常见 1/5/7 开头 + 7位数字 + 校验位，可带括号
  if (/^[157]\d{6}\(?\d\)?$/.test(v)) return true;

  return false;
}

/**
 * 护照号码校验（宽松通用格式，适合单输入框无法确认国家的场景）。
 * 说明：各国护照格式差异较大，此函数提供常见模式的格式校验；不做校验位算法。
 * 包含：
 * - 中国护照常见：`E/G` 开头 + 8 位数字；`D/P/S` 开头 + 7 位数字；
 * - 台湾护照常见：首字母 + 8 位数字；
 * - 通用兜底：6-9 位的字母数字组合；移除输入中的空格与 `-` 后再校验。
 * @param s 护照号码
 * @returns 是否匹配常见护照格式
 * @example
 * isPassport('E12345678') // true
 * isPassport('P1234567') // true
 * isPassport('A12345678') // true（台湾常见）
 * isPassport('AB-1234567') // true（移除分隔符后匹配）
 */
export function isPassport(s: string) {
  const t = String(s ?? '')
    .replace(/[-\s]/g, '')
    .trim();
  if (t === '') return false;
  if (/^[EG]\d{8}$/.test(t)) return true; // CN：E/G + 8 digits
  if (/^[DPS]\d{7}$/.test(t)) return true; // CN：D/P/S + 7 digits
  if (/^[A-Za-z]\d{8}$/.test(t)) return true; // TW：letter + 8 digits
  if (/^[A-Za-z0-9]{6,9}$/.test(t)) return true; // 通用宽松兜底
  return false;
}

/**
 * 港澳通行证（回乡证）号码校验。
 * 说明：常见为 `H/M` 开头 + 8~10 位数字；自动移除输入中的空格与 `-`。
 * @param s 证件号
 * @returns 是否为港澳通行证格式
 * @example
 * isHKMOPermit('H12345678') // true
 * isHKMOPermit('M1234567890') // true
 */
export function isHKMOPermit(s: string) {
  const t = String(s ?? '')
    .replace(/[-\s]/g, '')
    .trim()
    .toUpperCase();
  return /^[HM]\d{8,10}$/.test(t);
}

/**
 * 台湾居民来往大陆通行证（台胞证）号码校验。
 * 说明：常见为 8 位纯数字；或首字母 + 8 位数字；部分场景存在 10 位数字。
 * @param s 证件号
 * @returns 是否为台胞证格式
 * @example
 * isTaiwanPermit('12345678') // true
 * isTaiwanPermit('T12345678') // true
 * isTaiwanPermit('1234567890') // true
 */
export function isTaiwanPermit(s: string) {
  const t = String(s ?? '')
    .replace(/[-\s]/g, '')
    .trim()
    .toUpperCase();
  if (/^\d{8}$/.test(t)) return true;
  if (/^[A-Z]\d{8}$/.test(t)) return true;
  if (/^\d{10}$/.test(t)) return true;
  return false;
}

/**
 * 军官证号码校验：字母数字组合，长度 7-18。
 * @param s 证件号
 * @returns 是否为军官证宽松格式
 * @example
 * isOfficerIdLoose('JX1234567') // true
 */
export function isOfficerId(s: string) {
  const t = String(s ?? '')
    .replace(/[-\s]/g, '')
    .trim()
    .toUpperCase();
  return /^[A-Z0-9]{7,18}$/.test(t);
}

/**
 * 士兵证号码校验：字母数字组合，长度 7-18。
 * @param s 证件号
 * @returns 是否为士兵证格式
 * @example
 * isSoldierId('SB12345678') // true
 */
export function isSoldierId(s: string) {
  const t = String(s ?? '')
    .replace(/[-\s]/g, '')
    .trim()
    .toUpperCase();
  return /^[A-Z0-9]{7,18}$/.test(t);
}

/**
 * 中国军证（军官证/士兵证）组合校验。
 * @param s 证件号
 * @returns 是否为军官证或士兵证格式
 * @example
 * isCnMilitaryId('JX1234567') // true
 */
export function isMilitaryId(s: string) {
  return isOfficerId(s) || isSoldierId(s);
}

/**
 * 银行卡号校验（Luhn 校验）。
 * 说明：移除空格与 `-` 后进行 Luhn 校验；长度通常为 12-19 位。
 * @param s 银行卡号
 * @returns 是否通过 Luhn 校验
 * @example
 * isBankCard('6222 0201 2345 6789') // true
 */
export function isBankCard(s: string) {
  const t = String(s ?? '')
    .replace(/[-\s]/g, '')
    .trim();
  if (!/^\d{12,19}$/.test(t)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = t.length - 1; i >= 0; i--) {
    let digit = Number(t[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * 中国车牌号校验（含普通与新能源）。
 * @param s 车牌号码
 * @returns 是否为合法中国车牌
 * @example
 * isLicensePlate('京A12345') // true
 * isLicensePlate('沪A12345D') // 新能源（末位 D/F）
 * isLicensePlate('粤BDF12345') // 新能源（第三位 D/F）
 */
export function isLicensePlate(s: string) {
  const v = String(s ?? '')
    .trim()
    .toUpperCase();
  const prov = '京沪津渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵青藏川宁琼粤';
  const std = new RegExp(`^[${prov}][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]$`);
  const ne1 = new RegExp(`^[${prov}][A-HJ-NP-Z][DF][A-HJ-NP-Z0-9]{5}$`);
  const ne2 = new RegExp(`^[${prov}][A-HJ-NP-Z][A-HJ-NP-Z0-9]{5}[DF]$`);
  return std.test(v) || ne1.test(v) || ne2.test(v);
}

/**
 * 校验统一社会信用代码（中国税号常用：18 位，含校验位）。
 * 规则：
 * - 字符集：数字与大写字母（不含 I/O/Z/S/V），即 `[0-9A-HJ-NPQRTUWXY]`；
 * - 前 17 位参与加权求和，最后一位为校验码（取值 0-9 或 大写字母）。
 * @param code 税号/统一社会信用代码
 * @returns 是否为合法税号
 * @example
 * isTaxID('91350100M000100Y43') // true/false 取决于校验位
 */
export function isTaxID(code: string) {
  const v = String(code ?? '').trim();
  if (!/^[0-9A-HJ-NPQRTUWXY]{18}$/.test(v)) return false;
  const charset = '0123456789ABCDEFGHJKLMNPQRTUWXY'; // 31 字符集
  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  const map: Record<string, number> = {};
  for (let i = 0; i < charset.length; i++) map[charset[i]] = i;
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += map[v[i]] * weights[i];
  }
  const logicCheck = (31 - (sum % 31)) % 31;
  const expected = charset[logicCheck];
  return v[17] === expected;
}

/**
 * 判断字符串是否为合法 JSON 文本。
 * 说明：传入字符串时尝试 `JSON.parse`；传入对象/数组则视为合法。
 * @param input 待判定的值或字符串
 * @returns 是否为合法 JSON
 * @example
 * isJSON('{"a":1}') // true
 * isJSON('[1,2]') // true
 * isJSON('abc') // false
 */
export function isJSON(input: unknown) {
  if (typeof input === 'string') {
    const s = input.trim();
    if (s === '') return false;
    try {
      JSON.parse(s);
      return true;
    } catch {
      return false;
    }
  }
  if (input !== null && typeof input === 'object') return true;
  return false;
}

/**
 * HEX 颜色值（支持 `#RGB`、`#RRGGBB`、`#RRGGBBAA`）。
 * @param s 颜色字符串
 * @returns 是否为合法 HEX 颜色
 * @example
 * isHexColor('#fff') // true
 * isHexColor('#00ff00') // true
 * isHexColor('#11223344') // true
 */
export function isHexColor(s: string) {
  const v = String(s ?? '').trim();
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v);
}

/**
 * 校验 URL（要求含协议，支持 http/https/ftp）。
 * @param s 待校验的地址
 * @returns 是否为合法 URL
 * @example
 * isURL('https://example.com/path?a=1') // true
 * isURL('example.com') // false（缺少协议）
 */
export function isURL(s: string) {
  const v = String(s ?? '').trim();
  if (v === '') return false;
  try {
    const u = new URL(v);
    return ['http:', 'https:', 'ftp:'].includes(u.protocol) && !!u.hostname;
  } catch {
    return false;
  }
}

/**
 * 判断是否为合法 IPv4 地址。
 * @param s IP 字符串
 * @returns 是否为合法 IPv4
 * @example
 * isIPv4('192.168.0.1') // true
 * isIPv4('256.0.0.1') // false
 */
function isIPv4(s: string) {
  const v = String(s ?? '').trim();
  if (v === '') return false;
  const parts = v.split('.');
  if (parts.length !== 4) return false;
  for (const p of parts) {
    if (!/^\d+$/.test(p)) return false;
    if (p.length > 1 && p.startsWith('0')) return false;
    const n = Number(p);
    if (n < 0 || n > 255) return false;
  }
  return true;
}

/**
 * 判断是否为合法 IPv6 地址（支持压缩表示与 IPv4 映射）。
 * 规则：
 * - 由 8 组 1~4 位十六进制数组成，允许一次 `::` 压缩；
 * - 允许最后一组使用 IPv4 映射（如 `::ffff:192.168.0.1`）。
 * @param s IP 字符串
 * @returns 是否为合法 IPv6
 * @example
 * isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334') // true
 * isIPv6('2001:db8::8a2e:370:7334') // true
 * isIPv6('2001:::370:7334') // false
 */
export function isIPv6(s: string): boolean {
  const v = String(s ?? '').trim();
  if (v === '') return false;

  const lastColon = v.lastIndexOf(':');
  if (lastColon !== -1 && v.includes('.')) {
    const ipv6Part = v.slice(0, lastColon);
    const ipv4Part = v.slice(lastColon + 1);
    return isIPv6(ipv6Part) && isIPv4(ipv4Part);
  }

  const dblColonCount = (v.match(/::/g) || []).length;
  if (dblColonCount > 1) return false;

  const segments = v.split(':');
  if (v.startsWith('::')) segments.shift();
  if (v.endsWith('::')) segments.pop();
  const segmentsFiltered = segments.filter((seg) => seg !== '');

  if (dblColonCount === 0 && segmentsFiltered.length !== 8) return false;
  if (dblColonCount === 1 && segmentsFiltered.length >= 1 && segmentsFiltered.length <= 7) {
    // ok
  } else if (dblColonCount === 1 && segments.length === 0) {
    // :: 表示全部为 0
    return true;
  } else if (dblColonCount === 0 && segmentsFiltered.length === 8) {
    // ok
  } else {
    return false;
  }

  // 每段 1~4 位十六进制
  return segmentsFiltered.every(
    (seg) => seg.length >= 1 && seg.length <= 4 && /^[0-9a-fA-F]{1,4}$/.test(seg),
  );
}

/**
 * 校验 IP（支持 IPv4 与 IPv6）。
 * @param s IP 字符串
 * @param version 指定版本：传 `4` 仅校验 IPv4，传 `6` 仅校验 IPv6；缺省同时校验两者
 * @returns 是否为合法 IP
 * @example
 * isIP('127.0.0.1') // true
 * isIP('::1') // true
 * isIP('127.0.0.1', 6) // false
 */
export function isIP(s: string, version?: 4 | 6 | '4' | '6') {
  if (version === 4 || version === '4') return isIPv4(s);
  if (version === 6 || version === '6') return isIPv6(s);
  return isIPv4(s) || isIPv6(s);
}

/**
 * 校验 CIDR IP 段（支持 IPv4/IPv6），形如 `IP/前缀长度`。
 * @param s CIDR 字符串，如 `192.168.0.0/24`、`2001:db8::/32`
 * @returns 是否为合法 CIDR
 * @example
 * isIPRange('10.0.0.0/8') // true
 * isIPRange('2001:db8::/129') // false
 */
export function isIPRange(s: string) {
  const v = String(s ?? '').trim();
  if (v === '') return false;
  const parts = v.split('/');
  if (parts.length !== 2) return false;
  const [ip, prefixStr] = parts;
  if (!/^\d+$/.test(prefixStr)) return false;
  const prefix = Number(prefixStr);
  if (ip.includes(':')) {
    if (!isIPv6(ip)) return false;
    return prefix >= 0 && prefix <= 128;
  }
  if (!isIPv4(ip)) return false;
  return prefix >= 0 && prefix <= 32;
}

/**
 * 端口号校验（0 ~ 65535，整数）。
 * @param s 端口（字符串或数字）
 * @returns 是否为合法端口范围
 * @example
 * isPortNumber(80) // true
 * isPortNumber('65535') // true
 * isPortNumber(70000) // false
 */
export function isPortNumber(s: string | number) {
  const v = typeof s === 'number' ? s : Number(String(s ?? '').trim());
  return Number.isInteger(v) && v >= 0 && v <= 65535;
}

/**
 * 纬度校验（-90 ~ 90）。
 * @param s 纬度值（字符串或数字）
 * @returns 是否为合法纬度
 * @example
 * isLatitude('31.2304') // true
 */
export function isLatitude(s: string | number) {
  const v = typeof s === 'number' ? s : Number(String(s ?? '').trim());
  return Number.isFinite(v) && v >= -90 && v <= 90;
}

/**
 * 经度校验（-180 ~ 180）。
 * @param s 经度值（字符串或数字）
 * @returns 是否为合法经度
 * @example
 * isLongitude('121.4737') // true
 */
export function isLongitude(s: string | number) {
  const v = typeof s === 'number' ? s : Number(String(s ?? '').trim());
  return Number.isFinite(v) && v >= -180 && v <= 180;
}
