import { withUnit } from '../../ts';

/**
 * 给数字添加rpx单位 (支持数字字符串,其他非法字符返回原值)
 * @example
 * withUnitRpx(10) // "10rpx"
 * withUnitRpx('10') // "10rpx"
 * withUnitRpx('10px') // "10px"
 * withUnitRpx("auto") // "auto"
 * withUnitRpx("30%") // "30%"
 * withUnitRpx(null | undefined | '') // ""
 * withUnitRpx(0) // "0rpx"
 */
export function withUnitRpx(num?: string | number) {
  return withUnit(num, 'rpx');
}
