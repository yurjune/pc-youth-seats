import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './shared/models';

const URL = 'http://localhost:5000';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  path: '/socket.io',
  transports: ['websocket'],
});

export default socket;
