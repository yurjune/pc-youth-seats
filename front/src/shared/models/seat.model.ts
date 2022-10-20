export interface Seat {
  id: string;
  seat_num: number;
  seat_active: number;
  name: string;
  pw: string;
}

export type Seats = Record<string, Seat[]>;

export interface SeatParam {
  seat: string; // seat_line_1
  seatId: string; // B-1
  seat_active: number;
  seatPlace: string;
  name: string;
  pw: string;
}
