import { io, Socket } from 'socket.io-client';
import { env } from './shared/constants';
import { ClientToServerEvents, ServerToClientEvents } from './shared/models';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(env.SERVER_URL, {
  path: '/socket.io',
  transports: ['websocket'],
});

export default socket;
