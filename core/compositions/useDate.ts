import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import { datetimeFormat } from '../const/common.const';
import { computed, ref, unref, type ComputedRef, type Ref } from 'vue';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export function $date (d: dayjs.ConfigType, format = datetimeFormat) {
  return dayjs(d).format(format);
}

export function useDate (val: Ref<dayjs.Dayjs> | dayjs.Dayjs, format: Ref<string> | string): [ formatted: ComputedRef<string>, ref: Ref<dayjs.Dayjs> ] {
  const d = ref(val);
  const formatted = computed(() => dayjs(unref(d)).format(unref(format)));

  return [formatted, d];
}