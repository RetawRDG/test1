// Компонент боя, отвечает за взаимодействие клиента с сервером
import { useEffect, useMemo, useState } from "react";

import AttackDefenseSelector from "./AttackDefenseSelector.jsx";
import PlayerStatus from "./PlayerStatus.jsx";
import ReadyButton from "./ReadyButton.jsx";
import { socket, SOCKET_EVENTS } from "../socket.js";

const Battle = ({ nickname }) => {
  // Сохраняем выбор атаки и блока игрока
  const [selection, setSelection] = useState({ attack: "", block: "" });
  // Держим актуальное состояние, полученное от сервера
  const [gameState, setGameState] = useState({ players: [], turn: 1 });
  // Фиксируем результаты последнего хода
  const [turnResult, setTurnResult] = useState(null);
  // Сохраняем ошибки, чтобы подсветить их в интерфейсе
  const [error, setError] = useState(null);

  // Настраиваем соединение с сервером и обработчики событий
  useEffect(() => {
    socket.io.opts.query = { nickname };
    if (!socket.connected) {
      socket.connect();
    }

    const handleGameState = (state) => {
      setGameState(state);
    };

    const handleTurnResult = (result) => {
      setTurnResult(result);
    };

    const handleError = (payload) => {
      setError(payload?.message ?? "Неизвестная ошибка");
      setTimeout(() => setError(null), 3000);
    };

    socket.on(SOCKET_EVENTS.GAME_STATE, handleGameState);
    socket.on(SOCKET_EVENTS.TURN_RESULT, handleTurnResult);
    socket.on(SOCKET_EVENTS.ERROR, handleError);

    return () => {
      socket.off(SOCKET_EVENTS.GAME_STATE, handleGameState);
      socket.off(SOCKET_EVENTS.TURN_RESULT, handleTurnResult);
      socket.off(SOCKET_EVENTS.ERROR, handleError);
    };
  }, [nickname]);

  // Находим информацию о текущем игроке по никнейму
  const currentPlayer = useMemo(
    () => gameState.players.find((player) => player.nickname === nickname),
    [gameState.players, nickname]
  );

  // Собираем быстрый доступ к игрокам по их идентификатору
  const playersById = useMemo(() => {
    const map = new Map();
    gameState.players.forEach((player) => {
      map.set(player.id, player);
    });
    return map;
  }, [gameState.players]);

  // Определяем, ожидаем ли мы подключения соперника
  const waitingForOpponent = gameState.players.length === 1;
  // Проверяем, готовы ли оба игрока для показа статуса
  const bothPlayersReady =
    gameState.players.length === 2 && gameState.players.every((player) => player.ready);

  // Отправляем серверу готовность к ходу
  const handleReady = () => {
    socket.emit(SOCKET_EVENTS.PLAYER_READY, selection);
  };

  // Запрещаем готовность, если выбор не сделан или уже подтвержден
  const disableReady = !selection.attack || !selection.block || currentPlayer?.ready;

  return (
    <main className="app" aria-live="polite">
      <header className="app__header">
        <div>
          <h1>Fight Game</h1>
          <p className="app__subtitle">Тактический PvP с синхронными ходами</p>
        </div>
        <dl className="app__meta">
          <div>
            <dt>Ваш ник</dt>
            <dd>{nickname}</dd>
          </div>
          <div>
            <dt>Текущий ход</dt>
            <dd>#{gameState.turn}</dd>
          </div>
        </dl>
      </header>

      {error && <p className="app__error">Ошибка: {error}</p>}

      {waitingForOpponent && (
        <p className="battle__status" role="status">
          Ожидание соперника… Поделитесь ссылкой на бой!
        </p>
      )}

      {bothPlayersReady && (
        <p className="battle__status battle__status--ready" role="status">
          Оба бойца готовы! Расчет хода начнется сразу после подтверждения обоих игроков.
        </p>
      )}

      <section className="players" aria-label="Состояние бойцов">
        {gameState.players.map((player) => (
          <PlayerStatus key={player.id} {...player} />
        ))}
      </section>

      <AttackDefenseSelector
        attack={selection.attack}
        block={selection.block}
        onChange={setSelection}
      />

      <div className="app__actions">
        <ReadyButton disabled={disableReady} onClick={handleReady} />
        <p className="app__actions-hint">
          Нажмите «Готов», когда выбор сделан. Вы можете изменить решение до окончания хода.
        </p>
      </div>

      {turnResult && (
        <section className="result">
          <h2>Результаты хода #{turnResult.turn}</h2>
          <ul>
            {Object.entries(turnResult.players).map(([playerId, result]) => {
              const player = playersById.get(playerId);
              return (
                <li key={playerId}>
                  <strong>{player?.nickname ?? playerId}</strong> получил {result.damageTaken} урона,
                  HP: {result.hp}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
};

export default Battle;
