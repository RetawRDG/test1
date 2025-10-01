// Основное приложение Fight Game
import { useEffect, useMemo, useState } from "react";

import AttackDefenseSelector from "./components/AttackDefenseSelector.jsx";
import Lobby from "./components/Lobby.jsx";
import PlayerStatus from "./components/PlayerStatus.jsx";
import ReadyButton from "./components/ReadyButton.jsx";
import { socket, SOCKET_EVENTS } from "./socket.js";
import "./styles.css";

const App = () => {
  // Управляем экраном приложения: лобби перед подключением и бой после присоединения
  const [screen, setScreen] = useState("lobby");
  // Ник игрока сохраняем после подтверждения во время входа
  const [nickname, setNickname] = useState("");
  // Храним состояние выбора атаки/блока
  const [selection, setSelection] = useState({ attack: "", block: "" });
  // Состояние игры, приходящее от сервера
  const [gameState, setGameState] = useState({ players: [], turn: 1 });
  // Информация о последнем результате хода
  const [turnResult, setTurnResult] = useState(null);
  // Состояние ошибок для отображения игроку
  const [error, setError] = useState(null);

  // Подписываемся на события сервера только после перехода в режим боя
  useEffect(() => {
    if (screen !== "battle" || !nickname) {
      return undefined;
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
  }, [nickname, screen]);

  // Обрабатываем присоединение игрока и устанавливаем соединение с сервером
  const handleJoin = (playerNickname) => {
    const trimmedNickname = playerNickname.trim();

    if (!trimmedNickname) {
      return;
    }

    setNickname(trimmedNickname);
    setSelection({ attack: "", block: "" });
    setGameState({ players: [], turn: 1 });
    setTurnResult(null);

    socket.io.opts.query = { nickname: trimmedNickname };
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit(SOCKET_EVENTS.PLAYER_JOINED, { nickname: trimmedNickname });

    setScreen("battle");
  };

  // Ищем текущего игрока в списке по никнейму только во время боя
  const currentPlayer = useMemo(() => {
    if (screen !== "battle") {
      return null;
    }

    return gameState.players.find((player) => player.nickname === nickname);
  }, [gameState.players, nickname, screen]);

  const playersById = useMemo(() => {
    if (screen !== "battle") {
      return new Map();
    }

    const map = new Map();
    gameState.players.forEach((player) => {
      map.set(player.id, player);
    });
    return map;
  }, [gameState.players, screen]);

  // Отправка готовности сервера (используем только после входа в бой)
  const handleReady = () => {
    if (screen !== "battle") {
      return;
    }

    socket.emit(SOCKET_EVENTS.PLAYER_READY, selection);
  };

  const disableReady =
    screen !== "battle" || !selection.attack || !selection.block || currentPlayer?.ready;

  if (screen === "lobby") {
    return (
      <main className="app" aria-live="polite">
        <Lobby onJoin={handleJoin} />
      </main>
    );
  }

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
                  <strong>{player?.nickname ?? playerId}</strong> получил {result.damageTaken} урона, HP: {result.hp}
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
