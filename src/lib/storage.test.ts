import test from "node:test";
import assert from "node:assert/strict";
import { STORAGE_KEY, readStore, resetStore, writeStore } from "./storage.ts";

test("versioned storage restores a session after a reload-like read", () => {
  const values = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
  Object.defineProperty(globalThis, "window", {
    value: { localStorage },
    configurable: true,
  });
  const store = {
    version: 1 as const,
    sessions: [],
    preferences: { locale: "vi" as const, theme: "system" as const },
  };
  assert.equal(writeStore(store), true);
  assert.deepEqual(readStore(), store);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...store,
      sessions: [
        {
          id: "session-1",
          name: "Friday",
          gameName: "Cards",
          unitName: "points",
          players: [],
          rounds: [
            {
              id: "round-1",
              number: 1,
              createdAt: "2026-01-01T00:00:00.000Z",
              scores: {},
            },
          ],
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    }),
  );
  assert.equal(
    readStore().sessions[0].rounds[0].updatedAt,
    "2026-01-01T00:00:00.000Z",
  );
  resetStore();
  assert.deepEqual(readStore().sessions, []);
});
