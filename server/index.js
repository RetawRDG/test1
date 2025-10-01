// Сервер Fight Game на базе Express + socket.io
import express from "express";
import http from "http";
import { Server } from "socket.io";

import { ATTACK_ZONES, STARTING_HP } from "../shared/constants.js";
import { SOCKET_EVENTS } from "../shared/messages.js";
import { resolveTurn } from "../shared/gameEngine.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Игровое состояние сервера
const players = new Map();
let turnCounter = 1;

// Подготовка данных игрока для отправки на клиент
const mapPlayerForClient = (player) => ({
  id: player.id,
  nickname: player.nickname,
  hp: player.hp,
  ready: player.ready,
  turn: player.turn,
});

// Отправка актуального состояния всем участникам
const broadcastState = () => {
  io.emit(SOCKET_EVENTS.GAME_STATE, {
    players: Array.from(players.values()).map(mapPlayerForClient),
    turn: turnCounter,
  });
};

// Проверяем валидность переданных зон
const isValidZone = (zone) => !zone || ATTACK_ZONES.includes(zone);

io.on("connection", (socket) => {
  // Создаём нового игрока при подключении
  const nickname = socket.handshake.query.nickname || `Боец-${socket.id.slice(-4)}`;
  const player = {
    id: socket.id,
    nickname,
    hp: STARTING_HP,
    attack: null,
    block: null,
    ready: false,
    turn: turnCounter,
  };

  players.set(socket.id, player);
  broadcastState();

  // Обработка готовности игрока к ходу
  socket.on(SOCKET_EVENTS.PLAYER_READY, (payload) => {
    const currentPlayer = players.get(socket.id);
    if (!currentPlayer) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: "Игрок не найден" });
      return;
    }

    const { attack, block } = payload || {};

    // Валидация выбранных зон
    if (!isValidZone(attack) || !isValidZone(block)) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: "Некорректные зоны атаки или блока" });
      return;
    }

    currentPlayer.attack = attack;
    currentPlayer.block = block;
    currentPlayer.ready = true;

    broadcastState();

    // Проверяем, готовы ли оба игрока
    const allPlayers = Array.from(players.values());
    if (allPlayers.length < 2) {
      return;
    }

    const everyoneReady = allPlayers.every((p) => p.ready);
    if (!everyoneReady) {
      return;
    }

    const [first, second] = allPlayers;

    // Считаем результат хода между двумя игроками
    const { playerDamage, opponentDamage } = resolveTurn({
      player: first,
      opponent: second,
    });

    first.hp = Math.max(0, first.hp - opponentDamage);
    second.hp = Math.max(0, second.hp - playerDamage);

    const resultPayload = {
      turn: turnCounter,
      players: {
        [first.id]: {
          damageTaken: opponentDamage,
          hp: first.hp,
        },
        [second.id]: {
          damageTaken: playerDamage,
          hp: second.hp,
        },
      },
    };

    // Уведомляем участников о результате хода
    io.emit(SOCKET_EVENTS.TURN_RESULT, resultPayload);

    turnCounter += 1;

    // Сбрасываем параметры на следующий ход
    for (const p of allPlayers) {
      p.ready = false;
      p.attack = null;
      p.block = null;
      p.turn = turnCounter;
    }

    broadcastState();
  });

  socket.on("disconnect", () => {
    // Удаляем игрока и уведомляем остальных
    players.delete(socket.id);
    broadcastState();
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Fight Game server listening on port ${PORT}`);
});
