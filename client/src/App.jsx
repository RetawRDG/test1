// Основное приложение Fight Game
import { useState } from "react";

import Battle from "./components/Battle.jsx";
import "./styles.css";

const App = () => {
  // Ник игрока генерируем один раз при загрузке
  const [nickname] = useState(() => `Гость-${Math.floor(Math.random() * 1000)}`);

  return <Battle nickname={nickname} />;
};

export default App;
