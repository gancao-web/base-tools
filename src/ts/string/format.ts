/**
 * 文本脱敏
 * @param s 原始文本
 * @param keepLeft 保留左侧字符数（默认 1）
 * @param keepRight 保留右侧字符数（默认 0）
 * @param maskChar 脱敏字符（默认 `*`）
 * @returns 脱敏文本
 * @example
 * toMaskText('王小明', 1, 0) // => '王*'
 * toMaskText('王小明', 1, 1) // => '王*明'
 * toMaskText('13800138000', 3, 4) // => '138****8000'
 */
export function toMaskText(s: string, keepLeft = 1, keepRight = 0, maskChar = '*') {
  if (!s) return '';
  const v = String(s);
  const l = Math.max(0, keepLeft);
  const r = Math.max(0, keepRight);
  const len = v.length;
  const left = Math.min(l, len);
  const right = Math.min(r, len - left);
  const mid = len - left - right;
  if (mid <= 0) return v;
  const m = maskChar && maskChar.length > 0 ? maskChar : '*';
  return v.slice(0, left) + m.repeat(mid) + v.slice(len - right);
}

/**
 * 手机号中间打星：保留前三位与后四位，中间打 `*`。
 * @param phone 手机号字符串
 * @returns 遮蔽后的手机号
 * @example
 * toMaskPhone('13800138000') // => '138****8000'
 */
export function toMaskPhone(phone: string) {
  return toMaskText(phone, 3, 4);
}

/**
 * 姓名打星：
 * - 长度 ≤ 2：保留首字，其余打 `*`
 * - 长度 ≥ 3：保留首尾，各打星中间
 * @param name 姓名字符串
 * @returns 遮蔽后的姓名
 * @example
 * toMaskName('张三') // => '张*'
 * toMaskName('王小明') // => '王*明'
 */
export function toMaskName(name: string) {
  if (!name) return '';
  const v = String(name);
  return v.length <= 2 ? toMaskText(v, 1, 0) : toMaskText(v, 1, 1);
}
