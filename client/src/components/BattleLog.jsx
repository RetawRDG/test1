// Журнал боя для отображения последовательности событий

// Компонент принимает список событий и отображает их в виде упорядоченного списка
const BattleLog = ({ events = [], playersById = new Map() }) => {
  // Функция для получения имени игрока по id либо из события
  const resolveName = (id, fallbackName) => {
    if (!id) {
      return fallbackName ?? "Неизвестный";
    }

    const player = playersById?.get?.(id);
    if (player?.nickname) {
      return player.nickname;
    }

    return fallbackName ?? id;
  };

  return (
    <section className="battle-log" aria-label="Журнал боя">
      <h2>Журнал боя</h2>
      {events.length === 0 ? (
        <p className="battle-log__empty">Ещё не было ни одного удара.</p>
      ) : (
        <ol className="battle-log__list">
          {events.map((event) => {
            const key = event.id ?? `${event.turn}-${event.attackerId}-${event.attackZone}`;
            const attackerName = resolveName(event.attackerId, event.attackerName);
            const defenderName = resolveName(event.defenderId, event.defenderName);

            return (
              <li key={key} className="battle-log__item">
                <span className="battle-log__turn">Ход #{event.turn}:</span>{" "}
                <strong>{attackerName}</strong> атаковал зону <strong>{event.attackZone}</strong>{" "}
                противника <strong>{defenderName}</strong> и нанёс {event.damage} урона.
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

export default BattleLog;
