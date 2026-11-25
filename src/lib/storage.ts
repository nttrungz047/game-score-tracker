import { DEFAULT_PREFERENCES } from "./domain.ts";
import type { AppStore, GameSession, Round } from "./domain.ts";

export const STORAGE_KEY = "write-score-store-v1";

const emptyStore = (): AppStore => ({
  version: 1,
  sessions: [],
  preferences: DEFAULT_PREFERENCES,
});

export function readStore(): AppStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as AppStore;
    if (parsed.version !== 1 || !Array.isArray(parsed.sessions))
      return emptyStore();
    const sessions = parsed.sessions.map((session) => ({
      ...session,
      rounds: session.rounds.map((round: Round) => ({
        ...round,
        updatedAt: round.updatedAt ?? round.createdAt,
      })),
    }));
    return {
      ...emptyStore(),
      ...parsed,
      sessions,
      preferences: { ...DEFAULT_PREFERENCES, ...parsed.preferences },
    };
  } catch {
    return emptyStore();
  }
}

export function writeStore(store: AppStore): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function saveSessions(sessions: GameSession[]): boolean {
  const store = readStore();
  return writeStore({ ...store, sessions });
}

export function resetStore(): void {
  if (typeof window !== "undefined")
    window.localStorage.removeItem(STORAGE_KEY);
}
