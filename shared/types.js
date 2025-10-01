// Тип действий игрока в одном ходу боя
export const PlayerActionShape = {
  attack: "string", // выбранная зона атаки
  block: "string", // выбранная зона блока
};

// Тип игрока, участвующего в бою
export const PlayerShape = {
  id: "string", // уникальный идентификатор игрока/сокета
  nickname: "string", // отображаемое имя
  hp: "number", // текущее здоровье
  isReady: "boolean", // готов ли игрок завершить ход
};
