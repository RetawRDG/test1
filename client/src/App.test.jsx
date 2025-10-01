/** @jest-environment jsdom */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import App from "./App.jsx";

// Мокаем socket, чтобы исключить реальные подключения во время тестов
jest.mock("./socket.js", () => ({
  socket: {
    io: { opts: {} },
    connected: false,
    connect: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  SOCKET_EVENTS: {
    GAME_STATE: "GAME_STATE",
    PLAYER_JOINED: "PLAYER_JOINED",
    PLAYER_READY: "PLAYER_READY",
    TURN_RESULT: "TURN_RESULT",
    ERROR: "ERROR",
  },
}));

describe("App", () => {
  it("отображает лобби до присоединения", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: /join game/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/лобби/i)).toBeInTheDocument();
  });
});
