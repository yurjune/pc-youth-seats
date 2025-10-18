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

export enum SeatActive {
  PATH = 0, // 복도
  VACANT = 1, // 예약 가능
  DISABLED = 2, // 예약 불가
  PRIVATE = 4, // 지정석
  RESERVED = 5, // 예약됨
  INVISIBLE = 6, // 공간만 차지하는 투명 좌석
}

export const SeatActiveToSeatClassMap: Record<SeatActive, string> = {
  [SeatActive.PATH]: 'path',
  [SeatActive.VACANT]: 'vacant',
  [SeatActive.DISABLED]: 'disabled',
  [SeatActive.PRIVATE]: 'private',
  [SeatActive.RESERVED]: 'reserved',
  [SeatActive.INVISIBLE]: 'invisible',
};
