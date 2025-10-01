/** @jest-environment jsdom */

import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import Lobby from "../Lobby.jsx";

describe("Lobby", () => {
  it("отображает поле ввода и кнопку", () => {
    const noop = () => {};

    render(<Lobby onJoin={noop} />);

    expect(screen.getByLabelText(/никнейм/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join game/i })).toBeInTheDocument();
  });

  it("вызывает onJoin с введенным ником", () => {
    const handleJoin = jest.fn();

    render(<Lobby onJoin={handleJoin} />);

    const input = screen.getByLabelText(/никнейм/i);
    fireEvent.change(input, { target: { value: "  Боец  " } });
    fireEvent.click(screen.getByRole("button", { name: /join game/i }));

    expect(handleJoin).toHaveBeenCalledWith("Боец");
  });
});
