import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const checkIsAvailableForReservation = (): boolean => {
  const dayjsKorea = dayjs().tz('Asia/Seoul');
  const day = dayjsKorea.day();
  const hour = dayjsKorea.hour();

  // 월요일 00시 ~ 21시 예약불가
  if (day === 1 && hour < 21) {
    return false;
  }

  return true;
};
