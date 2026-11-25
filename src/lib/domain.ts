export type Locale = "vi" | "en";
export type Theme = "light" | "dark" | "system";

export type Player = {
  id: string;
  name: string;
};

export type Round = {
  id: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  note?: string;
  scores: Record<string, number>;
};

export type GameSession = {
  id: string;
  name: string;
  gameName: string;
  unitName: string;
  players: Player[];
  rounds: Round[];
  createdAt: string;
  updatedAt: string;
};

export type Preferences = {
  locale: Locale;
  theme: Theme;
};

export type AppStore = {
  version: 1;
  sessions: GameSession[];
  preferences: Preferences;
};

export type PlayerStanding = Player & { total: number; rank: number };

export type SessionMetrics = {
  totalScore: number;
  averageScore: number;
  roundsPlayed: number;
  highestScore: number;
};

export const DEFAULT_PREFERENCES: Preferences = {
  locale: "vi",
  theme: "system",
};

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createSession(input: {
  name: string;
  gameName: string;
  unitName: string;
  playerNames: string[];
}): GameSession {
  const now = new Date().toISOString();
  return {
    id: createId("session"),
    name: input.name.trim(),
    gameName: input.gameName.trim(),
    unitName: input.unitName.trim() || "points",
    players: uniqueNames(input.playerNames).map((name) => ({
      id: createId("player"),
      name,
    })),
    rounds: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function uniqueNames(names: string[]): string[] {
  const seen = new Set<string>();
  return names
    .map((name) => name.trim())
    .filter((name) => {
      const key = name.toLocaleLowerCase();
      if (!name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function calculateStandings(session: GameSession): PlayerStanding[] {
  const totals = new Map(session.players.map((player) => [player.id, 0]));
  session.rounds.forEach((round) => {
    Object.entries(round.scores).forEach(([playerId, score]) => {
      if (totals.has(playerId))
        totals.set(playerId, (totals.get(playerId) ?? 0) + score);
    });
  });
  const sorted = session.players
    .map((player) => ({
      ...player,
      total: totals.get(player.id) ?? 0,
      rank: 0,
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  return sorted.map((player, index) => ({ ...player, rank: index + 1 }));
}

export function calculateSessionMetrics(session: GameSession): SessionMetrics {
  const standings = calculateStandings(session);
  const totalScore = standings.reduce((sum, player) => sum + player.total, 0);
  return {
    totalScore,
    averageScore: session.players.length
      ? totalScore / session.players.length
      : 0,
    roundsPlayed: session.rounds.length,
    highestScore: standings[0]?.total ?? 0,
  };
}

export function chartSeries(
  session: GameSession,
): Array<{ round: number; totals: Record<string, number> }> {
  const running = new Map(session.players.map((player) => [player.id, 0]));
  return session.rounds.map((round) => {
    Object.entries(round.scores).forEach(([playerId, score]) => {
      if (running.has(playerId))
        running.set(playerId, (running.get(playerId) ?? 0) + score);
    });
    return { round: round.number, totals: Object.fromEntries(running) };
  });
}

export function addRound(
  session: GameSession,
  scores: Record<string, number>,
  note = "",
): GameSession {
  const now = new Date().toISOString();
  return {
    ...session,
    rounds: [
      ...session.rounds,
      {
        id: createId("round"),
        number: session.rounds.length + 1,
        createdAt: now,
        updatedAt: now,
        note: note.trim(),
        scores,
      },
    ],
    updatedAt: now,
  };
}

export function updateRound(
  session: GameSession,
  roundId: string,
  scores: Record<string, number>,
  note = "",
): GameSession {
  return {
    ...session,
    rounds: session.rounds.map((round) =>
      round.id === roundId
        ? {
            ...round,
            scores,
            note: note.trim(),
            updatedAt: new Date().toISOString(),
          }
        : round,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function deleteRound(
  session: GameSession,
  roundId: string,
): GameSession {
  const rounds = session.rounds
    .filter((round) => round.id !== roundId)
    .map((round, index) => ({ ...round, number: index + 1 }));
  return { ...session, rounds, updatedAt: new Date().toISOString() };
}

export function duplicateSession(session: GameSession): GameSession {
  const now = new Date().toISOString();
  return {
    ...session,
    id: createId("session"),
    name: `${session.name} (Copy)`,
    players: session.players.map((player) => ({
      ...player,
      id: createId("player"),
    })),
    rounds: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function addPlayer(session: GameSession, name: string): GameSession {
  const trimmed = name.trim();
  if (
    !trimmed ||
    session.players.some(
      (player) =>
        player.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase(),
    )
  )
    return session;
  return {
    ...session,
    players: [...session.players, { id: createId("player"), name: trimmed }],
    updatedAt: new Date().toISOString(),
  };
}

export function renamePlayer(
  session: GameSession,
  playerId: string,
  name: string,
): GameSession {
  const trimmed = name.trim();
  if (
    !trimmed ||
    session.players.some(
      (player) =>
        player.id !== playerId &&
        player.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase(),
    )
  )
    return session;
  return {
    ...session,
    players: session.players.map((player) =>
      player.id === playerId ? { ...player, name: trimmed } : player,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function removePlayer(
  session: GameSession,
  playerId: string,
): GameSession {
  return {
    ...session,
    players: session.players.filter((player) => player.id !== playerId),
    rounds: session.rounds.map((round) => {
      const scores = { ...round.scores };
      delete scores[playerId];
      return { ...round, scores };
    }),
    updatedAt: new Date().toISOString(),
  };
}
