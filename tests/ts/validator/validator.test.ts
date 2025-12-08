import { describe, it, expect } from 'vitest';
import {
  isMobilePhone,
  isPhone,
  isLandline,
  isEmail,
  isIdentityCard,
  isPassport,
  isHKMOPermit,
  isTaiwanPermit,
  isOfficerId,
  isSoldierId,
  isMilitaryId,
  isURL,
  isIP,
  isIPRange,
  isPortNumber,
  isBankCard,
  isLicensePlate,
  isChineseName,
  isChinese,
  isHexColor,
  isLatitude,
  isLongitude,
} from '../../../src/ts';

describe('ts/validator', () => {
  describe('电话/邮箱', () => {
    it('isMobilePhone', () => {
      expect(isMobilePhone('13800138000')).toBe(true);
      expect(isMobilePhone('12800138000')).toBe(false);
      expect(isMobilePhone(' 13800138000 ')).toBe(true);
    });

    it('isLandline', () => {
      expect(isLandline('010-88888888')).toBe(true);
      expect(isLandline('0371-12345678-123')).toBe(true);
      expect(isLandline('123456')).toBe(false);
    });

    it('isPhone', () => {
      expect(isPhone('13800138000')).toBe(true);
      expect(isPhone('010-88888888')).toBe(true);
      expect(isPhone('abc')).toBe(false);
    });

    it('isEmail', () => {
      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('a@b.c')).toBe(true);
      expect(isEmail('invalid@')).toBe(false);
    });
  });

  describe('证件', () => {
    it('isIdentityCard', () => {
      expect(isIdentityCard('11010519491231002X')).toBe(true); // CN 18位典例
      expect(isIdentityCard('A123456789')).toBe(true); // TW 格式
      expect(isIdentityCard('A123456(3)')).toBe(true); // HK 格式
      expect(isIdentityCard('1234567(8)')).toBe(true); // MO 格式
      expect(isIdentityCard('A12345678')).toBe(false);
    });

    it('isPassport', () => {
      expect(isPassport('E12345678')).toBe(true);
      expect(isPassport('P1234567')).toBe(true);
      expect(isPassport('A12345678')).toBe(true);
      expect(isPassport('AB-1234567')).toBe(true);
      expect(isPassport('X12')).toBe(false);
    });

    it('isHKMOPermit', () => {
      expect(isHKMOPermit('H12345678')).toBe(true);
      expect(isHKMOPermit('M1234567890')).toBe(true);
      expect(isHKMOPermit('H123')).toBe(false);
    });

    it('isTaiwanPermit', () => {
      expect(isTaiwanPermit('12345678')).toBe(true);
      expect(isTaiwanPermit('T12345678')).toBe(true);
      expect(isTaiwanPermit('1234567890')).toBe(true);
      expect(isTaiwanPermit('A1234')).toBe(false);
    });

    it('军证系列', () => {
      expect(isOfficerId('JX1234567')).toBe(true);
      expect(isSoldierId('SB12345678')).toBe(true);
      expect(isMilitaryId('JX1234567')).toBe(true);
      expect(isMilitaryId('!!')).toBe(false);
    });
  });

  describe('网络/数据', () => {
    it('isURL', () => {
      expect(isURL('https://example.com/path?a=1')).toBe(true);
      expect(isURL('ftp://example.com')).toBe(true);
      expect(isURL('example.com')).toBe(false);
    });

    it('isIP', () => {
      expect(isIP('127.0.0.1')).toBe(true);
      expect(isIP('::1')).toBe(true);
      expect(isIP('127.0.0.1', 6)).toBe(false);
    });

    it('isIPRange', () => {
      expect(isIPRange('10.0.0.0/8')).toBe(true);
      expect(isIPRange('2001:db8::/32')).toBe(true);
      expect(isIPRange('2001:db8::/129')).toBe(false);
    });

    it('isPortNumber', () => {
      expect(isPortNumber(0)).toBe(true);
      expect(isPortNumber(65535)).toBe(true);
      expect(isPortNumber(-1)).toBe(false);
      expect(isPortNumber('70000')).toBe(false);
      expect(isPortNumber('abc' as unknown as string)).toBe(false);
    });
  });

  describe('金融/车辆/地址', () => {
    it('isBankCard (Luhn)', () => {
      expect(isBankCard('4111 1111 1111 1111')).toBe(true);
      expect(isBankCard('4111111111111112')).toBe(false);
    });

    it('isLicensePlate', () => {
      expect(isLicensePlate('京A12345')).toBe(true);
      expect(isLicensePlate('沪A12345D')).toBe(true);
      expect(isLicensePlate('粤BD12345')).toBe(true);
      expect(isLicensePlate('A12345')).toBe(false);
    });
  });

  describe('账号/文本/颜色/地理', () => {
    it('isChineseName', () => {
      expect(isChineseName('张三')).toBe(true);
      expect(isChineseName('阿·娜')).toBe(true);
      expect(isChineseName('John')).toBe(false);
    });

    it('isChinese', () => {
      expect(isChinese('你好')).toBe(true);
      expect(isChinese('你好！')).toBe(false);
    });

    it('isHexColor', () => {
      expect(isHexColor('#fff')).toBe(true);
      expect(isHexColor('#ffffff')).toBe(true);
      expect(isHexColor('#11223344')).toBe(true);
      expect(isHexColor('#ggg')).toBe(false);
    });

    it('isLatitude/isLongitude', () => {
      expect(isLatitude('31.2304')).toBe(true);
      expect(isLatitude(90.1)).toBe(false);
      expect(isLongitude('121.4737')).toBe(true);
      expect(isLongitude(181)).toBe(false);
    });
  });
});
