import { getKoreanTime } from './time';

export const logWithTime = (text: string) => {
  const { month, date, hour, minute } = getKoreanTime();
  console.log(`[${month + 1}/${date} ${hour}:${minute}] ${text}`);
};
