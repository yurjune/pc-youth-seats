import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const checkIsAvailableForReservation = () => {
  const { day, hour } = getKoreanTime();
  // 월요일 00시 ~ 21시 예약불가
  return day !== 1 || hour >= 21;
};

export const checkIsLateReservation = () => {
  const { day, hour, minute } = getKoreanTime();

  // 일요일 13:20 이후
  if (day === 0) {
    return (hour === 13 && minute >= 20) || hour >= 14;
  }

  return false;
};

export const getKoreanTime = () => {
  const dayjsKorea = dayjs().tz('Asia/Seoul');
  const year = dayjsKorea.year();
  const month = dayjsKorea.month();
  const date = dayjsKorea.date();
  const day = dayjsKorea.day();
  const hour = dayjsKorea.hour();
  const minute = dayjsKorea.minute();

  return { year, month, date, day, hour, minute };
};

export const getYearMonthDate = () => {
  const { year: _year, month: _month, date: _date } = getKoreanTime();
  const year = _year.toString().slice(2);
  const month = _month < 10 ? `0${_month + 1}` : _month + 1;
  const date = _date < 10 ? `0${_date}` : _date;
  const yearMonthDate = `${year}${month}${date}`;
  return yearMonthDate; // 230101
};
