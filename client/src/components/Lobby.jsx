// Лобби для входа игроков в бой
import { useState } from "react";

// Компонент принимает обработчик onJoin и пробрасывает никнейм игрока наружу
const Lobby = ({ onJoin }) => {
  // Локально храним ввод пользователя, чтобы не дергать родительский стейт каждый символ
  const [nickname, setNickname] = useState("");

  // При отправке формы валидируем и вызываем обработчик присоединения
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      return;
    }

    onJoin(trimmedNickname);
  };

  return (
    <section className="lobby" aria-label="Лобби игры">
      <h1>Fight Game</h1>
      <p className="lobby__hint">Введите ник, чтобы присоединиться к бою.</p>
      <form className="lobby__form" onSubmit={handleSubmit}>
        <label className="lobby__label" htmlFor="nickname">
          Никнейм
        </label>
        <input
          id="nickname"
          className="lobby__input"
          name="nickname"
          type="text"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="Например, Ударник"
        />
        <button className="lobby__submit" type="submit" disabled={!nickname.trim()}>
          Join game
        </button>
      </form>
    </section>
  );
};

export default Lobby;
