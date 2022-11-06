const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
const dayjsKorea = dayjs().tz('Asia/Seoul');

const checkIsAvailableForReservation = () => {
  const day = dayjsKorea.day();
  const time = dayjsKorea.hour();

  // 월요일 00시 ~ 21 시
  if (day === 1 && time < 21) {
    return false;
  }

  return true;
};

const checkIsLateReservation = () => {
  const day = dayjsKorea.day();
  const hour = dayjsKorea.hour();
  const minute = dayjsKorea.minute();

  if (day !== 0) {
    return false;
  }

  // 일요일 1:30 ~ 2:30
  if ((hour === 13 && minute >= 30) || (hour === 14 && minute <= 30)) {
    return true;
  }

  return false;
};

module.exports = {
  checkIsAvailableForReservation,
  checkIsLateReservation,
};
