import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Shanghai');

export const day = dayjs;

export function standardTimeFormat(time?: Date) {
  return day(time).format('YYYY-MM-DD HH:mm:ss');
}
