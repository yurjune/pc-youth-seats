import { SeatParams } from './seat.model';

// ref. https://socket.io/docs/v4/typescript/
export interface ServerToClientEvents {
  chat: (arg: SeatParams) => void;
}

export interface ClientToServerEvents {
  chat: (arg: SeatParams) => void;
}
