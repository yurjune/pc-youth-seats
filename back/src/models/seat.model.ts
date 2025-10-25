export interface Seat {
  id: string; // A-1
  seat_active: number;
  group: string; // 순
  name: string; // 방송팀
  pw: string;
}

export type Seats = Record<string, Seat[]>;

export interface SeatParams extends Pick<Seat, 'id' | 'seat_active' | 'group' | 'name' | 'pw'> {
  line: string; // seat_line_1
  ignoreIsLate?: boolean;
}

export enum SeatActive {
  VACANT = 0, // 예약 가능
  DISABLED = 1, // 예약 불가
  PRIVATE = 2, // 지정석
  RESERVED = 3, // 예약됨
  INVISIBLE = 4, // 공간만 차지하는 투명 좌석
  PATH = 5, // 복도
}
