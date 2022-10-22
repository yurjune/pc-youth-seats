import { useState } from 'react';
import { SeatParams, Seats } from '../models';

export const useSeats = () => {
  const [seats, setSeats] = useState<Seats>();

  const modifySeats = (params: SeatParams) => {
    if (params == null) {
      return;
    }

    const newSeat = {
      id: params.seatId,
      seat_active: params.seat_active,
      seat_num: 100, // TODO
      name: params.name,
      pw: params.pw,
    };

    setSeats((prev) => {
      if (prev == null) {
        return;
      }

      const newLine = prev[params.seat]?.map((seat) => {
        if (seat.id === params.seatId) {
          return newSeat;
        }

        return seat;
      });

      return { ...prev, [params.seat]: newLine };
    });
  };

  return [seats, setSeats, modifySeats] as const;
};
