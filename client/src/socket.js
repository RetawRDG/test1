// Инициализация socket.io-клиента для взаимодействия с сервером
import { io } from "socket.io-client";

import { SOCKET_EVENTS } from "../../shared/messages.js";

const socket = io("http://localhost:3001", {
  autoConnect: true,
  transports: ["websocket"],
});

export { socket, SOCKET_EVENTS };
