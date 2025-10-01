// Компонент выбора зоны атаки и блока
import { ATTACK_ZONES } from "../../../shared/constants.js";

const ZONE_DESCRIPTIONS = {
  head: "Прицельный удар по голове — шанс на крит",
  body: "Корпус — стабильный выбор для урона",
  arms: "Руки — ослабляем контратаку",
  legs: "Ноги — выбиваем опору",
};

const AttackDefenseSelector = ({ attack, block, onChange }) => {
  // Обновляем выбранную зону и передаём наружу
  const handleSelect = (type, value) => {
    onChange((prev) => ({ ...prev, [type]: value }));
  };

  // Снимаем выбор для указанного типа
  const handleReset = (type) => {
    onChange((prev) => ({ ...prev, [type]: "" }));
  };

  // Рендерим карточки выбора для атаки/блока
  const renderZoneGroup = (type, currentValue) => (
    <fieldset className={`zone-group zone-group--${type}`}>
      <legend>{type === "attack" ? "Зоны атаки" : "Зоны блока"}</legend>
      <div className="zone-group__grid">
        {ATTACK_ZONES.map((zone) => {
          const id = `${type}-${zone}`;
          const isSelected = currentValue === zone;

          return (
            <label
              key={id}
              htmlFor={id}
              className={`zone-card${isSelected ? " zone-card--selected" : ""}`}
            >
              <input
                type="radio"
                id={id}
                name={type}
                value={zone}
                checked={isSelected}
                onChange={() => handleSelect(type, zone)}
              />
              <span className="zone-card__badge" aria-hidden>
                {zone}
              </span>
              <span className="zone-card__title">
                {ZONE_DESCRIPTIONS[zone] ?? zone}
              </span>
            </label>
          );
        })}
      </div>
      <button
        type="button"
        className="zone-group__reset"
        onClick={() => handleReset(type)}
      >
        Сбросить выбор
      </button>
    </fieldset>
  );

  return (
    <section className="selector" aria-labelledby="zones-title">
      <h2 id="zones-title">Тактическая раскладка</h2>
      <p className="selector__hint">
        Отметьте приоритетные зоны для наступления и защиты. Нажмите по карточке, чтобы
        активировать её, либо сбросьте выбор кнопкой.
      </p>
      <div className="selector__layout">
        {renderZoneGroup("attack", attack)}
        {renderZoneGroup("block", block)}
      </div>
    </section>
  );
};

export default AttackDefenseSelector;
