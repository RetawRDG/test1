# 🥊 Fight Game MVP

**Простой клиент-серверный прототип пошагового файтинга** на базе React, Express и Socket.IO.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.2-green.svg)](https://socket.io/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey.svg)](https://expressjs.com/)

## 📋 Описание

Минималистичный MVP файтинг-игры с:
- **Реал-тайм мультиплеер** через WebSocket соединения
- **Разделяемая логика** между клиентом и сервером
- **Модульная архитектура** с четким разделением ответственности
- **Unit тесты** для критических компонентов

## 🚀 Быстрый старт

### Установка
```bash
# Клонируйте репозиторий
git clone https://github.com/RetawRDG/test1.git
cd test1

# Установите зависимости
npm install
```

### Запуск разработки
```bash
# Терминал 1: Запуск сервера
npm run dev:server

# Терминал 2: Запуск клиента  
npm run dev:client
```

**Игра будет доступна по адресу:** `http://localhost:1234`

### Тестирование
```bash
# Запуск всех тестов
npm test

# Запуск в watch режиме
npm test -- --watch
```

## 🏗️ Архитектура проекта

```
fight-game-mvp/
├── client/          # Frontend React приложение
├── server/          # Backend Express + Socket.IO сервер
├── shared/          # Общая логика (игровые правила, утилиты)
├── __tests__/       # Unit тесты
├── package.json     # Конфигурация проекта
└── README.md        # Документация
```

### Технологический стек

#### Frontend
- **React 18.2** - UI библиотека
- **Parcel 2.9** - Сборщик модулей
- **Socket.IO Client** - WebSocket соединения

#### Backend  
- **Express 4.18** - Web сервер
- **Socket.IO 4.7** - Реал-тайм коммуникации
- **Node.js** - Серверная среда выполнения

#### Тестирование
- **Jest 29.7** - Тестовый фреймворк
- **Babel** - Транспиляция ES6+ для тестов

## 🎮 Особенности игры

- **Пошаговые бои** с простой механикой
- **Мультиплеер** - несколько игроков одновременно
- **Синхронизированное состояние** между всеми клиентами
- **Отказоустойчивость** - обработка отключений игроков

## 🔧 Скрипты разработки

| Команда | Описание |
|---------|----------|
| `npm run dev:server` | Запуск сервера в режиме разработки |
| `npm run dev:client` | Запуск клиента с hot reload |
| `npm test` | Запуск всех тестов |

## 📁 Структура папок

### `/client` - Фронтенд
Пользовательский интерфейс игры на React

### `/server` - Бэкенд  
Игровой сервер с WebSocket поддержкой

### `/shared` - Общий код
Разделяемые модули:
- Игровые правила и логика
- Валидация ходов
- Константы и утилиты

### `/__tests__` - Тесты
Unit тесты для всех компонентов

## 🚀 Roadmap

- [ ] **v1.1** - Система уровней персонажей
- [ ] **v1.2** - Различные типы атак
- [ ] **v1.3** - Комнаты для приватных игр  
- [ ] **v1.4** - Сохранение истории боев
- [ ] **v2.0** - UI/UX редизайн

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature ветку (`git checkout -b feature/AmazingFeature`)
3. Коммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Пушьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Проект распространяется под лицензией MIT. Детали в файле [LICENSE](LICENSE).

## 👨‍💻 Автор

**retaw** - [GitHub](https://github.com/RetawRDG)

---

⭐ **Поставьте звезду, если проект был полезен!**