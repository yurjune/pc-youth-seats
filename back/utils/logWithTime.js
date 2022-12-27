const { getKoreanTime } = require('./time');

const logWithTime = (text) => {
  const { month, date, hour, minute } = getKoreanTime();
  console.log(`[${month + 1}/${date} ${hour}:${minute}] ${text}`);
};

module.exports = {
  logWithTime,
};
