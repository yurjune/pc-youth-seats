import { useMemo } from 'react';
import { Seats } from '../models';

export const useCountSeats = (seats: Seats | undefined) => {
  const { totalSeats, activeSeats } = useMemo(() => {
    let totalSeats = 0;
    let activeSeats = 0;

    if (seats == null) {
      return { totalSeats, activeSeats };
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

        if (seat_active === 4 && name !== '') {
          activeSeats += 1;
        }
      });
    });

    return { totalSeats, activeSeats };
  }, [seats]);

  return { totalSeats, activeSeats };
};
