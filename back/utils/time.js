const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const checkIsAvailableForReservation = () => {
  const dayjsKorea = dayjs().tz('Asia/Seoul');
  const day = dayjsKorea.day();
  const hour = dayjsKorea.hour();

  // 월요일 00시 ~ 21시 예약불가
  if (day === 1 && hour < 21) {
    return false;
  }

  return true;
};

const checkIsLateReservation = () => {
  const dayjsKorea = dayjs().tz('Asia/Seoul');
  const day = dayjsKorea.day();
  const hour = dayjsKorea.hour();
  const minute = dayjsKorea.minute();

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

module.exports = {
  checkIsAvailableForReservation,
  checkIsLateReservation,
};
