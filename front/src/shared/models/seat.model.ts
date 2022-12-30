export interface Seat {
  id: string; // A-1
  seat_num: number;
  seat_active: number;
  name: string; // 방송팀
  pw: string;
}

export type Seats = Record<string, Seat[]>;

export interface SeatParams extends Pick<Seat, 'id' | 'seat_active' | 'name' | 'pw'> {
  line: string; // seat_line_1
  ignoreIsLate?: boolean;
}
