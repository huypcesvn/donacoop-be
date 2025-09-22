import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';

/**
 * Convert a date string or Date object from VN timezone to UTC Date.
 * Example: "2025-09-22" (VN) -> 2025-09-21T17:00:00.000Z (UTC)
 */
export const vnToUtc = (date: string | Date): Date => {
  return dayjs.tz(date, VN_TZ).utc().toDate();
};

/**
 * Convert a UTC Date to VN timezone string.
 * Example: 2025-09-21T17:00:00.000Z -> "2025-09-22 00:00:00"
 */
export const utcToVnString = (date: Date): string => {
  return dayjs(date).tz(VN_TZ).format('YYYY-MM-DD HH:mm:ss');
};
