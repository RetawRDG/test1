// Компонент отображения информации об игроке
const PlayerStatus = ({ nickname, hp, ready, turn }) => (
  <article className="player-status">
    <h3>{nickname}</h3>
    <p>HP: {hp}</p>
    <p>Готовность: {ready ? "готов" : "ждём"}</p>
    <p>Текущий ход: {turn}</p>
  </article>
);

export default PlayerStatus;
