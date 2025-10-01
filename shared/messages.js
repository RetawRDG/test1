// Список событий socket.io для синхронизации клиента и сервера
export const SOCKET_EVENTS = {
  PLAYER_JOINED: "player:joined",
  PLAYER_READY: "player:ready",
  TURN_SUBMIT: "turn:submit",
  TURN_RESULT: "turn:result",
  GAME_STATE: "game:state",
  ERROR: "game:error",
};
