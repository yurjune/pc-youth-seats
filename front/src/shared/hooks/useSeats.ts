import { useState } from 'react';
import { SeatParams, Seats } from '../models';

export const useSeats = () => {
  const [seats, setSeats] = useState<Seats>();

  const modifySeats = (params: SeatParams) => {
    if (params == null) {
      return;
    }

    const newSeat = {
      id: params.id,
      seat_active: params.seat_active,
      seat_num: 100, // TODO
      name: params.name,
      pw: params.pw,
    };

    setSeats((prev) => {
      if (prev == null) {
        return;
      }

      const newLine = prev[params.line]?.map((seat) => {
        if (seat.id === params.id) {
          return newSeat;
        }

        return seat;
      });

      return { ...prev, [params.line]: newLine };
    });
  };

  return [seats, setSeats, modifySeats] as const;
};
