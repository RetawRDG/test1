const { calculateDamage, applyDamage, BASE_DAMAGE } = require('../battle');

// Ensure battle calculation helpers behave as expected for core scenarios
// that drive the turn resolution logic on the server.
describe('battle calculations', () => {
  test('attack equals block results in zero damage', () => {
    expect(calculateDamage('head', 'head')).toBe(0);
  });

  test('attack different from block results in base damage', () => {
    expect(calculateDamage('head', 'body')).toBe(BASE_DAMAGE);
  });

  test('defender HP decreases correctly when taking damage', () => {
    const defender = { hp: 50 };
    const updatedDefender = applyDamage(defender, 'head', 'body');

    expect(updatedDefender.hp).toBe(50 - BASE_DAMAGE);
  });
});
