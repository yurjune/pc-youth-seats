import { io, Socket } from 'socket.io-client';
import { env } from './constants';
import { ClientToServerEvents, ServerToClientEvents } from './models/socket.model';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(env.SERVER_URL, {
  path: '/socket.io',
  transports: ['websocket'],
});

export default socket;
