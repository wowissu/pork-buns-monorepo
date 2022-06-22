export type Msg<T, A extends Arr = Arr> = string | ((val: T, ...args: A[]) => string);

type Arr = readonly any[];

export function returnMessage<T, A extends Arr = Arr> (val: T, message: Msg<T>, ...args: [...A]) {
  return typeof message === 'function' ? message(val, ...args) : message;
}

// 1990-01-01 or 1990.01.01
export const dateRegex = /^\d{4}[\.\-\/](0?[1-9]|1[012])[\.\-\/](3[01]|[12][0-9]|0?[1-9])$/;
// 1990-01-01 23:59:59
export const datetimeRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])\ (0?[0-9]|1[0-9]|2[0-3])\:(0?[0-9]|[1-5][0-9])\:(0[0-9]|[1-5][0-9])$/;

// 匹配所有支持短信功能的号码（手机卡 + 上网卡） https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md
// const phoneRegex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[01356789]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$/;

// 使用者帳號
export const accountRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
// 使用者密碼
export const passwdRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,12}$/;
// 資金密碼
// export const fundsPasswordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*_-]{6,12}$/;
export const fundsPasswordRegex = passwdRegex;

// 手機
export const phoneRegex = /^[0-9]{11,11}$/;
// email
export const emailRegex = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
// 銀行卡
export const bankCardNumberRegex = /^[1-9]{1}[0-9]{15,}$/;
export const bankAccountRegex = /^[1-9]{1}[0-9]{15,}$/;

// IFSC Regex 規則
export const IFSCRegex = /^[A-Za-z]{4}\d{7}$/;

export const UPIRegex = /^\w+@\w+$/;

// QQ帳號
export const QQRegex = /^[0-9]{5,13}$/;

// China ProvCode
export const ChinaProvsRegex = /^(11)|(12)|(13)|(14)|(15)|(21)|(22)|(23)|(31)|(32)|(33)|(34)|(35)|(36)|(37)|(41)|(42)|(43)|(44)|(45)|(46)|(50)|(51)|(52)|(53)|(54)|(61)|(62)|(63)|(64)|(65)|(71)| (81)|(82)$/;
export const ChinaIdDateRegex = /^\d{4}(0?[1-9]|1[012])([12][0-9]|3[01]|0?[1-9])$/;

export function isChinaId (val: string) {
  const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
  const parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
  const code = val.substring(17);

  if (p.test(val)) {
    const sum = val.substring(0, 17).split('').reduce((acc, str, i) => {
      return acc += Number(str) * factor[i];
    }, 0);

    if (parity[sum % 11] === code.toUpperCase()) {
      return true;
    }
  }

  return false;
}

export function isHKId (val: string) {
  const regex = /^([A-Z]{1,2})(\d{6})\(([\dA]{1})\)$/;
  const m: Record<string, number> = { 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18, 'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25, 'Q': 26, 'R': 27, 'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33, 'Y': 34, 'Z': 35, '#': 36 };

  val = val.toUpperCase();

  const matched = regex.exec(val);

  if (matched === null) {
    return false;
  }

  const [_, p, nums, code] = matched;
  const prefixes = p.length === 1 ? [m['#'], m[p]] : [m[p[0]], m[p[1]]];
  const r = [ ...prefixes, ...[...nums].map(n => +n), +code];

  const sum = r.reduce((acc, row, i) => {
    return acc + row * (9 - i);
  }, 0);

  return 0 === (sum % 11);
}