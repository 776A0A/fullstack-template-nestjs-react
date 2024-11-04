import * as moment from 'moment-timezone';

export function formatTime(time?: Date) {
  return moment(time).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}
