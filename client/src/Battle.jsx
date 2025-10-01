import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Available battle zones for attack and block selectors
const BATTLE_ZONES = ["head", "body", "arms", "legs"];

const Battle = () => {
  // Track socket instance separately to ensure a single connection
  const [socket, setSocket] = useState(null);
  // Keep human-readable connection status for the UI
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  // Manage the currently selected attack zone
  const [attackZone, setAttackZone] = useState(BATTLE_ZONES[0]);
  // Manage the currently selected block zone
  const [blockZone, setBlockZone] = useState(BATTLE_ZONES[1]);
  // Track when the player has submitted their choice to disable the button
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Store HP values received from the server for the local player
  const [playerHp, setPlayerHp] = useState(100);
  // Store HP values received from the server for the opponent player
  const [opponentHp, setOpponentHp] = useState(100);
  // Keep a log of turn results to display history
  const [resultLog, setResultLog] = useState([]);

  // Establish socket connection once on mount
  useEffect(() => {
    // Create socket connection to the server using default origin
    const newSocket = io();
    setSocket(newSocket);
    setConnectionStatus("connecting");

    // Update UI state when connection is established
    newSocket.on("connect", () => setConnectionStatus("connected"));
    // Handle disconnects to reflect connection status
    newSocket.on("disconnect", () => setConnectionStatus("disconnected"));
    // Surface connection errors to the player for debugging
    newSocket.on("connect_error", () => setConnectionStatus("error"));

    // Clean up the socket connection when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Subscribe to battle updates coming from the server
  useEffect(() => {
    // Avoid registering listeners before the socket is ready
    if (!socket) {
      return undefined;
    }

    // Process state updates from the server after each resolved turn
    const handleBattleUpdate = ({ playerHp: nextPlayerHp, opponentHp: nextOpponentHp, message }) => {
      setPlayerHp(nextPlayerHp);
      setOpponentHp(nextOpponentHp);
      if (message) {
        setResultLog((prevLog) => [message, ...prevLog]);
      }
      setIsSubmitting(false);
    };

    // Allow the server to push general notifications (errors, waiting states, etc.)
    const handleBattleNotice = (notice) => {
      if (notice) {
        setResultLog((prevLog) => [notice, ...prevLog]);
      }
      setIsSubmitting(false);
    };

    socket.on("battle:update", handleBattleUpdate);
    socket.on("battle:notice", handleBattleNotice);

    // Remove listeners when the socket changes or unmounts
    return () => {
      socket.off("battle:update", handleBattleUpdate);
      socket.off("battle:notice", handleBattleNotice);
    };
  }, [socket]);

  // Emit the player's choices to the server to resolve the turn
  const handleReady = () => {
    if (!socket) {
      return;
    }

    setIsSubmitting(true);
    setResultLog((prevLog) => ["Waiting for opponent...", ...prevLog]);

    socket.emit("battle:turn", {
      attack: attackZone,
      block: blockZone,
    });
  };

  return (
    <div className="battle-container">
      {/* High-level layout that wraps the entire battle interface */}
      <h2>Battle Arena</h2>
      <p className={`connection-status connection-status--${connectionStatus}`}>
        Status: {connectionStatus}
      </p>

      <div className="hp-panel">
        {/* Display the player's current HP */}
        <div className="hp-panel__item">
          <h3>Your HP</h3>
          <span className="hp-panel__value">{playerHp}</span>
        </div>
        {/* Display the opponent's current HP */}
        <div className="hp-panel__item">
          <h3>Opponent HP</h3>
          <span className="hp-panel__value">{opponentHp}</span>
        </div>
      </div>

      <div className="selectors">
        {/* Selector for choosing the attack zone */}
        <label className="selectors__group">
          <span>Attack target</span>
          <select value={attackZone} onChange={(event) => setAttackZone(event.target.value)}>
            {BATTLE_ZONES.map((zone) => (
              <option key={`attack-${zone}`} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>

        {/* Selector for choosing the block zone */}
        <label className="selectors__group">
          <span>Block zone</span>
          <select value={blockZone} onChange={(event) => setBlockZone(event.target.value)}>
            {BATTLE_ZONES.map((zone) => (
              <option key={`block-${zone}`} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Action button that sends the selected zones to the server */}
      <button type="button" onClick={handleReady} disabled={isSubmitting}>
        {isSubmitting ? "Waiting..." : "Ready"}
      </button>

      <div className="result-log">
        {/* Display messages returned from the server after each turn */}
        <h3>Turn Log</h3>
        {resultLog.length === 0 ? (
          <p>No turns yet. Make your move!</p>
        ) : (
          <ul>
            {resultLog.map((entry, index) => (
              <li key={`log-${index}`}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Battle;
