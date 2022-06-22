import dayjs from 'dayjs';
import { datetimeFormat } from '@/const/common.const';
import {
  returnMessage,
  dateRegex,
  datetimeRegex,
  emailRegex,
  phoneRegex,
  fundsPasswordRegex,
  passwdRegex,
  bankCardNumberRegex,
  bankAccountRegex,
  accountRegex,
  IFSCRegex,
  UPIRegex,
  type Msg,
  QQRegex,
  ChinaProvsRegex,
  ChinaIdDateRegex,
  isChinaId,
  isHKId
} from '@/const/rule.const';
import Decimal from 'decimal.js';
import { useI18n } from 'vue-i18n';

function isNullOrUndefined (value: any): value is null | undefined {
  return value === null || value === undefined;
}

type Rule<T> = (val: T) => boolean | string;

export function useRule () {
  const i18n = useI18n();
  const t = i18n.t.bind(i18n);

  /**  */
  const or = (...rules: Rule<unknown>[]) => {
    return (val: unknown) => {
      return rules.reduce((acc, fn) => acc || fn(val), false);
    };
  };

  /** and 檢查 */
  const and = <T>(...rules: Rule<T>[]) => {
    return (val: T) => {
      const result = rules.map(fn => fn(val)).filter(row => row !== true);

      return (result.length === 0) || result[0];
    };
  };

  /** 切割要檢查的字串 */
  const substring = (rule: Rule<string>, start: number, end?: number) => (val: string) => {
    return rule(val.substring(start, end));
  };

  /** regex */
  const reg = <V extends string | number>(regex: RegExp, message: Msg<V> = t('rules.reg')) => (val: V | null | undefined) => {
    const valstr = val?.toString();

    return isNullOrUndefined(valstr) || valstr.length === 0 || (valstr && regex.test(valstr)) || returnMessage<typeof val>(val, message as any);
  };

  /** eq */
  const eq = <T>(target: T, message: Msg<T> = t('rules.eq')) => (val: T) => {
    return target === val || returnMessage<T>(val, message);
  };

  /** uneq */
  const uneq = <T>(target: T, message: Msg<T> = t('rules.uneq')) => (val: T) => {
    return target !== val || returnMessage<T>(val, message);
  };

  /** 必填 */
  const required = <T = unknown>(message: Msg<T> = t('rules.required')) => (val: T) =>
    !(val === undefined || val === null || String(val).length === 0) || returnMessage<T>(val, message);

  /** 長度 */
  const length = <T extends string | number | any[]>(
    l: number,
    message: Msg<T> = t('rules.length', [l])
  ) => (val: T) => (val as any).length === l || returnMessage<T>(val, message);

  /** 完全相同 */
  const twin = <T extends string | number | any[]>(value: any, message: Msg<T> = t('rules.twin')) => (
    val: T
  ) => val === value || returnMessage<T>(val, message);

  /** 最大長度 */
  const maxLength = <T extends string | number | any[]>(
    l: number,
    message: Msg<T> = t('rules.maxLength', [l])
  ) => (val: T) => (val as any).length <= l || returnMessage<T>(val, message);

  /** 最小長度 */
  const minLength = <T extends string | number | any[]>(
    l: number,
    message: Msg<T> = t('rules.minLength', [l])
  ) => (val: T) => (val as any).length >= l || returnMessage<T>(val, message);

  /** range */
  const range = <T extends number>(
    r: [number, number],
    message: Msg<T> = t('rules.range', r)
  ) => (val: T) => (val >= r[0] && val <= r[1]) || returnMessage<T>(val, message, r);

  /** minDatetime - null or undefined will pass */
  const minDatetime = <T extends string>(
    minDate: T,
    format = datetimeFormat,
    message: Msg<T> = t('rules.minDatetime', [dayjs(minDate).format(format)])
  ) => (val: T | null) => {
    if (isNullOrUndefined(val)) { return true; }

    const d = dayjs(minDate);
    const msg: Msg<number> = () => returnMessage<T>(val, message, minDate);

    if (!d.isValid()) {
      console.warn(`rule[minDatetime]: "${minDate}" is not date.`);

      return false;
    }

    return min<number>(d.toDate().getTime(), msg)(dayjs(val).toDate().getTime());
  };

  /** maxDatetime - null or undefined will pass */
  const maxDatetime = <T extends string>(
    maxDate: T,
    format = datetimeFormat,
    message: Msg<T> = t('rules.maxDatetime', [dayjs(maxDate).format(format)])
  ) => (val?: T | null) => {
    if (isNullOrUndefined(val) || val === '') { return true; }

    const d = dayjs(maxDate);
    const msg: Msg<number> = () => returnMessage<T>(val, message, maxDate);

    if (!d.isValid()) {
      console.warn(`rule[maxDatetime]: "${maxDate}" is not date.`);

      return false;
    }

    return max<number>(d.toDate().getTime(), msg)(dayjs(val).toDate().getTime());
  };

  /** min */
  const min = <T extends number | string>(minVal: number, message: Msg<T> = t('rules.min', [minVal])) => (
    val?: T | null
  ) => {
    try {
      return isNullOrUndefined(val) || Decimal.min(val, minVal).eq(minVal) || returnMessage<T>(val, message, minVal);
    } catch (err) {
      return numeral()(val);
    }
  };

  /** max */
  const max = <T extends string | number>(maxVal: number | string, message: Msg<T> = t('rules.max', [maxVal])) => (val?: T | null) => {
    try {
      return isNullOrUndefined(val) || Decimal.max(val, maxVal).eq(maxVal) || returnMessage<T>(val, message, maxVal);
    } catch (err) {
      return numeral()(val);
    }
  };

  const boolean = (fixed?: boolean, message: Msg<boolean> = t('rules.boolean', (fixed === undefined ? 0 : (fixed === true ? 1 : 2)))) => (val: boolean) => {
    if (
      fixed === undefined && typeof val === 'boolean' ||
      fixed === true && val === true ||
      fixed === false && val === false
    ) {
      return true;
    }

    return returnMessage<boolean>(val, message, val);
  };

  /** includes */
  const includes = <T = any>(
    list: T[],
    message: Msg<T> = t('rules.includes'),
    options?: {
      fromIndex: number;
    }
  ) => (val: T) => list.includes(val, options && options.fromIndex) || returnMessage<T>(val, message);

  /** int only */
  const intOnly = <T extends string | number>(message: Msg<T> = t('rules.intOnly'), regex = /^([-+]?[1-9]\d*|0)$/i) => reg<T>(regex, message);

  /** number only */
  const numeral = <T extends string | number>(message: Msg<T> = t('rules.numeral'), regex = /^\d+$/i) => reg<T>(regex, message);

  /** Email */
  const email = <T extends string>(message: Msg<T> = t('rules.email'), regex = emailRegex) => reg<T>(regex, message);

  /** Phone */
  const phone = <T extends string>(message: Msg<T> = t('rules.phone'), regex = phoneRegex) => reg<T>(regex, message);

  /** date(YYY-MM-DD) */
  const date = <T extends string>(message: Msg<T> = t('rules.date'), regex = dateRegex) => reg<T>(regex, message);

  /** is date */
  const isDate = <T extends string>(message: Msg<T> = t('rules.date')) => (val: string) => dayjs(val).isValid() || returnMessage(val, message);

  /** datetime(YYYY-MM-DD HH:mm) */
  const datetime = <T extends string>(message: Msg<T> = t('rules.datetime'), regex = datetimeRegex) => reg<T>(regex, message);

  /** 以下為非通用 */
  /** 資金密碼 */
  const fundsPassword = <T extends string>(message: Msg<T> = t('rules.fundsPassword', [6, 12]), regex = fundsPasswordRegex) => reg<T>(regex, message);

  /** 登入密碼 */
  const password = <T extends string>(message: Msg<T> = t('rules.password', [6, 12]), regex = passwdRegex) => reg<T>(regex, message);

  /** 銀行卡號 */
  const bankCardNumber = <T extends string>(message: Msg<T> = t('rules.bankCardNumber'), regex = bankCardNumberRegex) => reg<T>(regex, message);
  const bankAccount = <T extends string>(message: Msg<T> = t('rules.bankCardNumber'), regex = bankAccountRegex) => reg<T>(regex, message);

  /** 會員帳號 */
  const account = <T extends string>(message: Msg<T> = t('rules.account'), regex = accountRegex) => reg<T>(regex, message);

  /** 小數長度 */
  const dp = <T extends number | string>(l = 2, message: Msg<T> = t('rules.dp', [l], l)) => {
    const suffix = l === 0 ? '' : `(\\.(\\d){0,${l}})`;

    return reg<T>(new RegExp(`^(([1-9]{1}\\d*)|([0]{1}))${suffix}?$`), message);
  };

  /** QQ帳號 */
  const QQ = <T extends string>(message: Msg<T> = t('rules.qq'), regex = QQRegex) => reg<T>(regex, message);

  /** 中國省市代碼 */
  const chinaProvCode = <T extends string | number>(message: Msg<T> = t('rules.chinaProvCode')) => reg<T>(ChinaProvsRegex, message);

  /** 中國公民身份證 */
  const chinaIdProv = (message: Msg<string> = t('rules.chinaProvCode')) => substring(reg<string>(ChinaProvsRegex, message), 0, 2);
  const chinaIdDate = (message: Msg<string> = t('rules.chinaIdDate')) => substring(reg<string>(ChinaIdDateRegex, message), 6, 14);
  const chinaIdCode = (message: Msg<string> = t('rules.chinaId')) => (val: string) => isChinaId(val) || returnMessage<string>(val, message);
  const chinaId = () => and<string>(chinaIdProv(), chinaIdDate(), chinaIdCode());

  /** 香港公民身份 */
  const hkId = (message: Msg<string> = t('rules.hkId')) => (val: string) => isHKId(val) || returnMessage<string>(val, message);

  /** 印度 IFSC, UPI */
  const IFSC = <T extends string>(message: Msg<T> = t('rules.IFSC')) => reg<T>(IFSCRegex, message);
  const UPI = <T extends string>(message: Msg<T> = t('rules.UPI')) => reg<T>(UPIRegex, message);

  return {
    or,
    and,
    required,
    length,
    dp,
    eq,
    uneq,
    twin,
    maxLength,
    minLength,
    range,
    min,
    max,
    minDatetime,
    maxDatetime,
    includes,
    reg,
    boolean,
    intOnly,
    numeral,
    email,
    phone,
    isDate,
    date,
    datetime,
    account,
    password,
    fundsPassword,
    bankCardNumber,
    bankAccount,
    IFSC,
    UPI,
    QQ,
    chinaProvCode,
    chinaIdProv,
    chinaIdDate,
    chinaIdCode,
    chinaId,
    hkId
  };
}