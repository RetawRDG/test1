// Base damage dealt when an attack is not blocked successfully.
const BASE_DAMAGE = 10;

/**
 * Calculates damage based on attack and block zones.
 * @param {string} attack - The attack zone chosen by the attacker.
 * @param {string} block - The block zone chosen by the defender.
 * @returns {number} The damage dealt for the turn.
 */
function calculateDamage(attack, block) {
  return attack === block ? 0 : BASE_DAMAGE;
}

/**
 * Applies damage to the defender and returns the updated state.
 * @param {{ hp: number }} defender - Defender's current state with HP.
 * @param {string} attack - The attack zone chosen by the attacker.
 * @param {string} block - The block zone chosen by the defender.
 * @returns {{ hp: number }} Defender state with updated HP after damage.
 */
function applyDamage(defender, attack, block) {
  const damage = calculateDamage(attack, block);
  return {
    ...defender,
    hp: Math.max(0, defender.hp - damage),
  };
}

module.exports = {
  BASE_DAMAGE,
  calculateDamage,
  applyDamage,
};
