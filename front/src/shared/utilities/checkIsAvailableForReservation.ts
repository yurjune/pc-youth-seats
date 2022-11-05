import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const checkIsAvailableForReservation = (): boolean => {
  const dayjsKorea = dayjs().tz('Asia/Seoul');
  const day = dayjsKorea.day();
  const time = dayjsKorea.hour();

  // 월요일 00시 ~ 21 시
  if (day === 1 && time < 21) {
    return false;
  }

  return true;
};
