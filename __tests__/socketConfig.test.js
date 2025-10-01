import { jest } from "@jest/globals";

// Создаем заглушку для socket.io-client
const ioMock = jest.fn(() => ({
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  io: { opts: {} },
}));

jest.mock("socket.io-client", () => ({
  __esModule: true,
  io: ioMock,
}));

describe("socket client configuration", () => {
  beforeEach(() => {
    jest.resetModules();
    ioMock.mockClear();
  });

  it("инициализирует клиент с autoConnect = false", async () => {
    await import("../client/src/socket.js");

    expect(ioMock).toHaveBeenCalledWith(
      "http://localhost:3001",
      expect.objectContaining({
        autoConnect: false,
        transports: ["websocket"],
      })
    );
  });
});
