import { Seats } from '../models';

// 좌석 현황 집계에 포함되는 지정석
export const appointedSeats = ['교역자', '방송팀', '새가족'];

export const getNumberOfSeats = (seats: Seats | undefined) => {
  let activeSeats = 0;
  let totalSeats = 0;

  if (seats == null) {
    return { activeSeats, totalSeats };
  }

  Object.keys(seats).forEach((line) => {
    seats[line].forEach((seat) => {
      const { seat_active, name } = seat;

      if ([1, 4, 5].includes(seat_active)) {
        totalSeats += 1;
      }

      if (seat_active === 5) {
        activeSeats += 1;
      }

      // 교역자 3석, 방송팀 1석, 새가족 2석 = 총 6석
      if (seat_active === 4 && appointedSeats.includes(name)) {
        activeSeats += 1;
      }
    });
  });

  return { activeSeats, totalSeats };
};
