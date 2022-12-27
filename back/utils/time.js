const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const getKoreanTime = () => {
  const dayjsKorea = dayjs().tz('Asia/Seoul');
  const year = dayjsKorea.year();
  const month = dayjsKorea.month();
  const date = dayjsKorea.date();
  const day = dayjsKorea.day();
  const hour = dayjsKorea.hour();
  const minute = dayjsKorea.minute();

  return { year, month, date, day, hour, minute };
};

const checkIsAvailableForReservation = () => {
  const { day, hour } = getKoreanTime();

  // 월요일 00시 ~ 21시 예약불가
  if (day === 1 && hour < 21) {
    return false;
  }

  return true;
};

const checkIsLateReservation = () => {
  const { day, hour, minute } = getKoreanTime();

  if (day !== 0) {
    return false;
  }

  // 일요일 1:30 이후
  if (hour === 13 && minute >= 30) {
    return true;
  }

  if (hour >= 14) {
    return true;
  }

  return false;
};

const getYearMonthDate = () => {
  const { year: _year, month: _month, date: _date } = getKoreanTime();
  const year = _year.toString().slice(2);
  const month = _month < 10 ? `0${_month + 1}` : _month + 1;
  const date = _date < 10 ? `0${_date}` : _date;
  const yearMonthDate = `${year}${month}${date}`;
  return yearMonthDate; // 230101
};

module.exports = {
  getKoreanTime,
  checkIsAvailableForReservation,
  checkIsLateReservation,
  getYearMonthDate,
};
