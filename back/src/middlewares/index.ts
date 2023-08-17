import { Request } from 'express';
import { getKoreanTime } from '../utils';

// this logging middleware should be executed only if seat reserve or cancel succeed
export function logSeatChange(req: Request) {
  const { month, date, hour, minute } = getKoreanTime();
  const time = `[${month + 1}/${date} ${hour}:${minute}]`;

  const { id, name, pw } = req.body.params;
  const message =
    req.path === '/makeReservation'
      ? `${time} 예약 완료: ${id}, ${name}, ${pw}`
      : `${time} 삭제 완료: ${id}`;

  console.log(message);
}
