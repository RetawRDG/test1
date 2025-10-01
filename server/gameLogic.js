// Core fight resolution logic shared across the server.
const { ATTACK_ZONES, BASE_DAMAGE } = require("../shared/constants");

/**
 * Resolves a single exchange between two fighters.
 * @param {Object} attacker - Attacking player payload.
 * @param {string} attacker.attack - Attack zone selected by the attacker.
 * @param {Object} defender - Defending player payload.
 * @param {string} defender.block - Block zone selected by the defender.
 * @returns {number} - Damage dealt to the defender.
 */
function resolveDamage(attacker, defender) {
  // Validate that the attack zone is one of the allowed options.
  if (!ATTACK_ZONES.includes(attacker.attack)) {
    throw new Error(`Unknown attack zone: ${attacker.attack}`);
  }

  // Successful block negates all damage, otherwise apply base damage.
  return attacker.attack === defender.block ? 0 : BASE_DAMAGE;
}

module.exports = {
  resolveDamage,
};
