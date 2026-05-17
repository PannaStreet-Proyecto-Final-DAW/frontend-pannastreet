import { useState, useCallback } from "react";
import { GameStatus } from "@/types";

/**
 * Configuration for the Game Logic hook.
 * @template T - The type of an individual attempt (e.g., Guess or SelectedPlayer).
 * This allows the hook to be generic and work with any game data structure.
 */
interface GameLogicConfig<T> {
  // The maximum number of attempts allowed before a loss.
  maxAttempts?: number;
  /** 
   * A function that calculates the score based on the history of attempts and current outcome.
   * This is "injected" by each specific game to implement its own scoring rules.
   */
  scoringFormula: (attempts: T[], won: boolean) => number;
  initialState?: {
    attempts: T[];
    status: GameStatus;
    score: number;
  };
}

// Internal state structure for the game logic.
interface InternalGameState<T> {
  attempts: T[];
  status: GameStatus;
  score: number;
}

/**
 * useGameLogic: A generic hook that acts as a "referee".
 * It manages the shared mechanics of all games:
 * 1. Tracking attempts (history)
 * 2. Determining win/loss status
 * 3. Calculating scores using an injected formula
 * 
 * @template T - The data structure used for a single move/attempt in the game.
 */
export function useGameLogic<T>({ maxAttempts, scoringFormula, initialState }: GameLogicConfig<T>) {
  // --- STATE ---
  const [state, setState] = useState<InternalGameState<T>>(() => {
    if (initialState) {
      return initialState;
    }
    return {
      attempts: [],
      status: "playing",
      score: 0,
    };
  });

  /**
   * Records a new attempt and updates the game status and score.
   * This is the primary way games interact with the "referee".
   * 
   * @param attempt - The data for the current move (e.g., the player guessed).
   * @param isWin - Boolean indicating if this specific move triggered a victory.
   */
  const recordAttempt = useCallback((attempt: T, isWin: boolean) => {
    setState((prev) => {
      // Safety check: Don't allow new moves if the game is already over
      if (prev.status !== "playing") return prev;

      // Create a new history array with the latest move
      const newAttempts = [...prev.attempts, attempt];
      let newStatus: GameStatus = "playing";
      let newScore = prev.score;

      // LOGIC BRANCHING:
      if (isWin) {
        // 1. VICTORY: Update status and calculate final winning score
        newStatus = "won";
        newScore = scoringFormula(newAttempts, true);
      } else if (maxAttempts && newAttempts.length >= maxAttempts) {
        // 2. LOSS: Reached max attempts without winning
        newStatus = "lost";
        newScore = scoringFormula(newAttempts, false);
      } else {
        // 3. PROGRESSIVE UPDATE: Still playing, update score (if the game is progressive)
        newScore = scoringFormula(newAttempts, false);
      }

      return {
        attempts: newAttempts,
        status: newStatus,
        score: newScore,
      };
    });
  }, [maxAttempts, scoringFormula]);

  // Resets the referee state to initial values.
  const reset = useCallback(() => {
    setState({
      attempts: [],
      status: "playing",
      score: 0,
    });
  }, []);

  // Return the public API of the referee
  return {
    attempts: state.attempts,
    status: state.status,
    score: state.score,
    recordAttempt,
    reset,
    isGameOver: state.status !== "playing"
  };
}
