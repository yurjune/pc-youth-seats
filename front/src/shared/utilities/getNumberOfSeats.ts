import { Seats } from '../models';

export const getNumberOfSeats = (seats: Seats | undefined) => {
  let activeSeats = 0;
  let totalSeats = 0;

  if (seats == null) {
    return { activeSeats, totalSeats };
  }

  Object.keys(seats).map((line) => {
    seats[line].map((seat) => {
      const { seat_active, name } = seat;

      if ([1, 4, 5].includes(seat_active)) {
        totalSeats += 1;
      }

      if (seat_active === 5) {
        activeSeats += 1;
      }

      // 교역자 3석, 방송팀 1석, 새가족석 2석 = 총 6석
      if (seat_active === 4 && name !== '') {
        activeSeats += 1;
      }
    });
  });

  return { activeSeats, totalSeats };
};
