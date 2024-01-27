import { Seats } from '@shared/models/seat.model';

export const APPOINTED_SEAT_NAMES = ['교역자', '방송팀', '새가족', '05또래', '사역팀'];
export const ACTIVE_SEATS = [1, 4, 5];

export const getNumberOfSeats = (seats: Seats) => {
  const allSeats = Object.values(seats).flat();

  const totalSeatCount = allSeats.reduce(
    (acc, seat) => (ACTIVE_SEATS.includes(seat.seat_active) ? acc + 1 : acc),
    0,
  );

  const activeSeatCount = allSeats.reduce((acc, { seat_active, name }) => {
    if (seat_active === 5) return acc + 1;
    if (seat_active === 4 && APPOINTED_SEAT_NAMES.includes(name)) return acc + 1;
    return acc;
  }, 0);

  return [activeSeatCount, totalSeatCount] as const;
};
