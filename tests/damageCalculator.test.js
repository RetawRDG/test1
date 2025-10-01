import { BASE_DAMAGE } from "../shared/constants.js";

// Пример базового теста для проверки общих констант
describe("damage calculations", () => {
  it("should use base damage greater than zero", () => {
    expect(BASE_DAMAGE).toBeGreaterThan(0);
  });
});
