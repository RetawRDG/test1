// Кнопка подтверждения готовности игрока
const ReadyButton = ({ disabled, onClick }) => (
  <button type="button" disabled={disabled} onClick={onClick}>
    Я готов
  </button>
);

export default ReadyButton;
