import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { datetimeFormat } from '../const/common.const';

dayjs.extend(utc);
dayjs.extend(timezone);

export function $date (d: dayjs.ConfigType, format = datetimeFormat) {
  return dayjs(d).format(format);
}