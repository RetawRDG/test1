// Тестируем боевую логику
import { BASE_DAMAGE } from "../shared/constants.js";
import { calculateDamage, resolveTurn } from "../shared/gameEngine.js";

describe("calculateDamage", () => {
  it("возвращает 0, если атака совпала с блоком", () => {
    expect(calculateDamage({ attack: "head", block: "head" })).toBe(0);
  });

  it("возвращает базовый урон при успешной атаке", () => {
    expect(calculateDamage({ attack: "body", block: "head" })).toBe(BASE_DAMAGE);
  });
});

describe("resolveTurn", () => {
  it("правильно распределяет урон между игроками", () => {
    const result = resolveTurn({
      player: { attack: "head", block: "body" },
      opponent: { attack: "arms", block: "legs" },
    });

    expect(result).toEqual({
      playerDamage: BASE_DAMAGE,
      opponentDamage: BASE_DAMAGE,
    });
  });

  it("учитывает блоки обоих игроков", () => {
    const result = resolveTurn({
      player: { attack: "head", block: "legs" },
      opponent: { attack: "head", block: "head" },
    });

    expect(result).toEqual({
      playerDamage: 0,
      opponentDamage: BASE_DAMAGE,
    });
  });
});
