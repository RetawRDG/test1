import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

// Общие константы, используемые для расчётов и инициализации
import { BASE_DAMAGE, STARTING_HP } from "../shared/constants.js";

// Создаём и настраиваем Express-приложение
const app = express();

// Оборачиваем Express в HTTP-сервер для работы с socket.io
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

// Простейшее состояние в памяти для пары игроков
const rooms = new Map();

// Обработка подключений клиентов по WebSocket
io.on("connection", (socket) => {
  // Заглушка для логирования подключения
  console.log(`Socket connected: ${socket.id}`);

  // При отключении очищаем возможное состояние
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Запускаем HTTP-сервер на дефолтном порту
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Fight Game server listening on port ${PORT}`);
});
