import test from "node:test";
import assert from "node:assert/strict";
import {
  addPlayer,
  addRound,
  calculateStandings,
  createSession,
  deleteRound,
  duplicateSession,
  removePlayer,
  updateRound,
} from "./domain.ts";

test("scores are aggregated and ranked", () => {
  let session = createSession({
    name: "Friday",
    gameName: "Cards",
    unitName: "points",
    playerNames: ["An", "Binh"],
  });
  session = addRound(session, {
    [session.players[0].id]: 10,
    [session.players[1].id]: 20,
  });
  session = addRound(session, {
    [session.players[0].id]: 30,
    [session.players[1].id]: -5,
  });
  assert.equal(session.rounds[0].updatedAt, session.rounds[0].createdAt);
  assert.deepEqual(
    calculateStandings(session).map(({ name, total, rank }) => ({
      name,
      total,
      rank,
    })),
    [
      { name: "An", total: 40, rank: 1 },
      { name: "Binh", total: 15, rank: 2 },
    ],
  );
});

test("editing and deleting rounds recalculates totals", () => {
  let session = createSession({
    name: "Friday",
    gameName: "Cards",
    unitName: "points",
    playerNames: ["An"],
  });
  session = addRound(session, { [session.players[0].id]: 10 });
  session = updateRound(session, session.rounds[0].id, {
    [session.players[0].id]: 25,
  });
  assert.ok(session.rounds[0].updatedAt);
  assert.equal(calculateStandings(session)[0].total, 25);
  session = deleteRound(session, session.rounds[0].id);
  assert.equal(calculateStandings(session)[0].total, 0);
});

test("duplicate preserves configuration and players but drops history", () => {
  let session = createSession({
    name: "Friday",
    gameName: "Cards",
    unitName: "stars",
    playerNames: ["An", "Binh"],
  });
  session = addRound(session, {
    [session.players[0].id]: 5,
    [session.players[1].id]: 3,
  });
  const copy = duplicateSession(session);
  assert.equal(copy.gameName, session.gameName);
  assert.equal(copy.unitName, session.unitName);
  assert.deepEqual(
    copy.players.map((player) => player.name),
    ["An", "Binh"],
  );
  assert.equal(copy.rounds.length, 0);
  assert.notEqual(copy.id, session.id);
  assert.notEqual(copy.players[0].id, session.players[0].id);
});

test("player changes preserve IDs and remove score entries immutably", () => {
  let session = createSession({
    name: "Friday",
    gameName: "Cards",
    unitName: "points",
    playerNames: ["An", "Binh"],
  });
  const playerId = session.players[0].id;
  session = addPlayer(session, "Chi");
  session = addRound(session, { [playerId]: 4 });
  const next = removePlayer(session, playerId);
  assert.equal(
    next.players.some((player) => player.id === playerId),
    false,
  );
  assert.equal(next.rounds[0].scores[playerId], undefined);
  assert.equal(
    session.players.some((player) => player.id === playerId),
    true,
  );
});
