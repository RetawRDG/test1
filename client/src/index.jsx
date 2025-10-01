import React from "react";
import { createRoot } from "react-dom/client";

// Импорт общих констант для отображения базовых настроек боя
import { ATTACK_ZONES } from "../../shared/constants";

// Корневой компонент приложения с заглушкой интерфейса
const App = () => {
  // Подготавливаем список доступных зон для будущих форм
  const zones = ATTACK_ZONES.join(", ");

  return (
    <main>
      {/* Краткое приветствие и подсказка по зонам */}
      <h1>Моргиналово Западное</h1>
      <p>Доступные зоны атаки/блока: {zones}</p>
      <p>
        Интерфейс боя находится в разработке. Следуйте дорожной карте из README, чтобы
        реализовать полноценный функционал.
      </p>
    </main>
  );
};

// Монтируем React-приложение в DOM
const container = document.getElementById("root");
createRoot(container).render(<App />);
