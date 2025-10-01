// Логика расчёта урона между двумя игроками
import { BASE_DAMAGE } from "./constants.js";

/**
 * Рассчитываем урон для атакующего по защищающемуся
 * @param {Object} params
 * @param {string} params.attack - зона атаки атакующего
 * @param {string} params.block - зона блока защищающегося
 * @returns {number}
 */
export const calculateDamage = ({ attack, block }) => {
  // Если атака совпала с блоком противника — урон отсутствует
  if (!attack || attack === block) {
    return 0;
  }

  // В остальных случаях наносим базовый урон
  return BASE_DAMAGE;
};

/**
 * Рассчитываем результат хода для двух игроков
 * @param {Object} turnState
 * @param {Object} turnState.player - действия первого игрока
 * @param {Object} turnState.opponent - действия второго игрока
 * @returns {{ playerDamage: number, opponentDamage: number }}
 */
export const resolveTurn = ({ player, opponent }) => {
  // Урон по сопернику
  const playerDamage = calculateDamage({
    attack: player?.attack,
    block: opponent?.block,
  });

  // Урон по текущему игроку
  const opponentDamage = calculateDamage({
    attack: opponent?.attack,
    block: player?.block,
  });

  return { playerDamage, opponentDamage };
};
