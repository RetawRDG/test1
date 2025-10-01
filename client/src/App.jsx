// Основное приложение Fight Game
import { useEffect, useMemo, useState } from "react";

import AttackDefenseSelector from "./components/AttackDefenseSelector.jsx";
import PlayerStatus from "./components/PlayerStatus.jsx";
import ReadyButton from "./components/ReadyButton.jsx";
import { socket, SOCKET_EVENTS } from "./socket.js";
import "./styles.css";

const App = () => {
  // Ник игрока генерируем один раз при загрузке
  const [nickname] = useState(() => `Гость-${Math.floor(Math.random() * 1000)}`);
  // Храним состояние выбора атаки/блока
  const [selection, setSelection] = useState({ attack: "", block: "" });
  // Состояние игры, приходящее от сервера
  const [gameState, setGameState] = useState({ players: [], turn: 1 });
  // Информация о последнем результате хода
  const [turnResult, setTurnResult] = useState(null);
  // Состояние ошибок для отображения игроку
  const [error, setError] = useState(null);

  // Подписка на события сокета
  useEffect(() => {
    // Подключаемся к серверу при входе в лобби с выбранным ником
    const joinLobby = () => {
      socket.io.opts.query = { nickname };
      if (!socket.connected) {
        socket.connect();
      }
    };

    joinLobby();

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
      // Отключаемся при выходе, чтобы очистить соединение и query-параметры
      if (socket.connected) {
        socket.disconnect();
      }
      socket.io.opts.query = {};
    };
  }, [nickname]);

  // Ищем текущего игрока в списке по никнейму
  const currentPlayer = useMemo(
    () => gameState.players.find((player) => player.nickname === nickname),
    [gameState.players, nickname]
  );

  const playersById = useMemo(() => {
    const map = new Map();
    gameState.players.forEach((player) => {
      map.set(player.id, player);
    });
    return map;
  }, [gameState.players]);

  // Отправка готовности сервера
  const handleReady = () => {
    socket.emit(SOCKET_EVENTS.PLAYER_READY, selection);
  };

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

export default App;
