import { useState } from 'react';
import { SeatParams, Seats } from '../models/seat.model';

export const useSeats = () => {
  const [seats, setSeats] = useState<Seats>({});

  const modifySeats = (params: SeatParams) => {
    const newSeat = {
      id: params.id,
      seat_active: params.seat_active,
      name: params.name,
      pw: params.pw,
    };

    setSeats((prev) => {
      const newLine = prev[params.line]?.map((seat) => (seat.id === params.id ? newSeat : seat));
      return { ...prev, [params.line]: newLine };
    });
  };

  return [seats, setSeats, modifySeats] as const;
};
