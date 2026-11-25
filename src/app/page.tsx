"use client";

import { SubmitEvent, useEffect, useMemo, useState } from "react";
import {
  addPlayer as addPlayerToSession,
  addRound,
  calculateSessionMetrics,
  calculateStandings,
  chartSeries,
  createSession,
  deleteRound,
  duplicateSession,
  GameSession,
  Locale,
  removePlayer as removePlayerFromSession,
  renamePlayer,
  Theme,
  updateRound,
} from "@/lib/domain";
import { readStore, resetStore, writeStore } from "@/lib/storage";
import { resources } from "@/lib/resources";
import type { Resources } from "@/lib/resources";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  ArrowLeft,
  Check,
  Clipboard,
  Copy,
  Download,
  Eye,
  Pencil,
  Plus,
  RotateCcw,
  Settings,
  Share2,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import styles from "./page.module.css";

function makeImage(
  session: GameSession,
  standings: ReturnType<typeof calculateStandings>,
  locale: Locale,
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 250 + Math.max(standings.length, 1) * 70;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(new Blob());
      return;
    }
    ctx.fillStyle = "#101828";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Arial";
    ctx.fillText(session.gameName || session.name, 48, 60);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#a5b4fc";
    const t = resources[locale];
    ctx.fillText(
      `${session.name} · ${session.rounds.length} ${t.roundCount}`,
      48,
      98,
    );
    ctx.font = "18px Arial";
    ctx.fillStyle = "#c7d2fe";
    ctx.fillText(
      `${t.createdAt}: ${formatDateTime(new Date().toISOString())}`,
      48,
      130,
    );
    ctx.font = "bold 17px Arial";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("#", 52, 205);
    ctx.fillText(t.players, 130, 205);
    ctx.textAlign = "right";
    ctx.fillText(t.metricTotal, 840, 205);
    ctx.textAlign = "left";
    standings.forEach((player, index) => {
      const y = 245 + index * 70;
      ctx.fillStyle = index === 0 ? "#fbbf24" : "#e5e7eb";
      ctx.font = "bold 25px Arial";
      ctx.fillText(`#${player.rank}`, 52, y);
      ctx.fillStyle = "#ffffff";
      ctx.font = "24px Arial";
      ctx.fillText(player.name, 130, y);
      ctx.textAlign = "right";
      ctx.fillText(`${player.total} ${session.unitName}`, 840, y);
      ctx.textAlign = "left";
    });
    if (standings.length === 0) {
      ctx.fillStyle = "#e5e7eb";
      ctx.font = "24px Arial";
      ctx.fillText(t.noRounds, 52, 245);
    }
    canvas.toBlob((blob) => resolve(blob ?? new Blob()), "image/png");
  });
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [locale, setLocale] = useState<Locale>("vi");
  const [theme, setTheme] = useState<Theme>("system");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<"score" | "history" | "chart">("score");
  const [showCreate, setShowCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [roundEditing, setRoundEditing] = useState<string | null>(null);
  const [confirmRequest, setConfirmRequest] = useState<(() => void) | null>(
    null,
  );
  const t = resources[locale];
  const active = sessions.find((session) => session.id === activeId) ?? null;
  const standings = useMemo(
    () => (active ? calculateStandings(active) : []),
    [active],
  );
  // localStorage is the external source of truth; hydrate the client once after mount.
  useEffect(() => {
    const store = readStore();
    // Hydration intentionally initializes React state from the browser-only store.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessions(store.sessions);
    setLocale(store.preferences.locale);
    setTheme(store.preferences.theme);
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale;
    writeStore({ version: 1, sessions, preferences: { locale, theme } });
  }, [sessions, locale, theme, hydrated]);
  function updateSession(next: GameSession) {
    setSessions((items) =>
      items.map((item) => (item.id === next.id ? next : item)),
    );
  }
  function removeSession(id: string) {
    setConfirmRequest(() => () => {
      setSessions((items) => items.filter((item) => item.id !== id));
      if (activeId === id) setActiveId(null);
    });
  }
  function duplicate(id: string) {
    const source = sessions.find((item) => item.id === id);
    if (!source) return;
    const copySession = duplicateSession(source);
    setSessions((items) => [...items, copySession]);
    setActiveId(copySession.id);
  }
  function resetAll() {
    setConfirmRequest(() => () => {
      resetStore();
      setSessions([]);
      setActiveId(null);
    });
  }
  if (!hydrated) return <main className={styles.loading}>Loading...</main>;
  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <button
          className={styles.brand}
          onClick={() => {
            setActiveId(null);
            setShowSettings(false);
          }}
        >
          <Trophy size={20} aria-hidden="true" /> {t.app}
        </button>
        <button
          className={styles.iconButton}
          onClick={() => setShowSettings(true)}
          aria-label={t.settings}
        >
          <Settings size={18} aria-hidden="true" />
        </button>
      </header>
      {!active ? (
        <section className={styles.home}>
          <div className={styles.hero}>
            <span className={styles.eyebrow}>{t.localScoreboard}</span>
            <h1>{t.sessions}</h1>
            <p>{t.empty}</p>
            <button
              className={styles.primary}
              onClick={() => setShowCreate(true)}
            >
              <Plus size={18} aria-hidden="true" /> {t.newSession}
            </button>
          </div>
          <div className={styles.sessionGrid}>
            {sessions.map((session) => (
              <article className={styles.sessionCard} key={session.id}>
                <div>
                  {/* <span className={styles.cardKicker}>
                    {session.gameName || t.defaultGame}
                  </span> */}
                  <h2>{session.name}</h2>
                  <p>
                    {session.players.length} {t.players.toLocaleLowerCase()} ·{" "}
                    {session.rounds.length} {t.roundCount}
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => setActiveId(session.id)}>
                    <Eye size={15} aria-hidden="true" />
                    {t.open}
                  </button>
                  <button onClick={() => duplicate(session.id)}>
                    <Copy size={15} aria-hidden="true" />
                    {t.duplicate}
                  </button>
                  <button onClick={() => removeSession(session.id)}>
                    <Trash2 size={15} aria-hidden="true" />
                    {t.delete}
                  </button>
                </div>
                <div className={styles.timestampRow}>
                  <small>
                    {t.createdAt}: {formatDateTime(session.createdAt)}
                  </small>
                  <small>
                    {t.updatedAt}: {formatDateTime(session.updatedAt)}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <SessionView
          session={active}
          standings={standings}
          locale={locale}
          view={view}
          setView={setView}
          updateSession={updateSession}
          setRoundEditing={setRoundEditing}
          roundEditing={roundEditing}
          t={t}
          requestConfirmation={(action) => setConfirmRequest(() => action)}
          onBack={() => setActiveId(null)}
          onDuplicate={() => duplicate(active.id)}
          onDelete={() => removeSession(active.id)}
        />
      )}
      {showCreate && (
        <CreateDialog
          t={t}
          onClose={() => setShowCreate(false)}
          onCreate={(session) => {
            setSessions((items) => [...items, session]);
            setShowCreate(false);
            setActiveId(session.id);
          }}
        />
      )}
      {showSettings && (
        <SettingsDialog
          t={t}
          locale={locale}
          theme={theme}
          setLocale={setLocale}
          setTheme={setTheme}
          onReset={resetAll}
          onClose={() => setShowSettings(false)}
        />
      )}
      {confirmRequest && (
        <ConfirmModal
          resources={t}
          onCancel={() => setConfirmRequest(null)}
          onConfirm={() => {
            confirmRequest();
            setConfirmRequest(null);
          }}
        />
      )}
    </main>
  );
}

function CreateDialog({
  t,
  onClose,
  onCreate,
}: {
  t: Resources;
  onClose: () => void;
  onCreate: (session: GameSession) => void;
}) {
  const [gameName, setGameName] = useState("");
  const [unitName, setUnitName] = useState(t.defaultUnit);
  const [players, setPlayers] = useState("");
  function submit(event: SubmitEvent) {
    event.preventDefault();
    onCreate(
      createSession({
        name: gameName.trim() || t.newSession,
        gameName,
        unitName,
        playerNames: players.split(","),
      }),
    );
  }
  return (
    <Dialog title={t.create} onClose={onClose}>
      <form onSubmit={submit} className={styles.form}>
        <label>
          {t.game}
          <input
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            autoFocus
          />
        </label>
        <label>
          {t.unit}
          <input
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
          />
        </label>
        <label>
          {t.players}
          <input
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
            placeholder={t.playersPlaceholder}
          />
        </label>
        <div className={styles.dialogActions}>
          <button type="button" onClick={onClose}>
            <X size={16} aria-hidden="true" />
            {t.cancel}
          </button>
          <button className={styles.primary} type="submit">
            <Check size={16} aria-hidden="true" />
            {t.create}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function SessionView({
  session,
  standings,
  locale,
  view,
  setView,
  updateSession,
  setRoundEditing,
  roundEditing,
  t,
  requestConfirmation,
  onBack,
  onDuplicate,
  onDelete,
}: {
  session: GameSession;
  standings: ReturnType<typeof calculateStandings>;
  locale: Locale;
  view: "score" | "history" | "chart";
  setView: (view: "score" | "history" | "chart") => void;
  updateSession: (session: GameSession) => void;
  setRoundEditing: (id: string | null) => void;
  roundEditing: string | null;
  t: Resources;
  requestConfirmation: (action: () => void) => void;
  onBack: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [showRound, setShowRound] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState("");
  const metrics = calculateSessionMetrics(session);
  function addPlayer() {
    if (
      !playerName.trim() ||
      session.players.some(
        (p) => p.name.toLowerCase() === playerName.trim().toLowerCase(),
      )
    )
      return;
    updateSession(addPlayerToSession(session, playerName));
    setPlayerName("");
  }
  function removePlayer(id: string) {
    const remove = () => updateSession(removePlayerFromSession(session, id));
    if (session.rounds.some((round) => id in round.scores))
      requestConfirmation(remove);
    else remove();
  }
  function startRename(player: GameSession["players"][number]) {
    setEditingPlayerId(player.id);
    setEditingPlayerName(player.name);
  }
  function saveRename() {
    if (!editingPlayerId) return;
    updateSession(renamePlayer(session, editingPlayerId, editingPlayerName));
    setEditingPlayerId(null);
    setEditingPlayerName("");
  }
  return (
    <section className={styles.sessionPage}>
      <div className={styles.sessionBackRow}>
        <button className={styles.back} onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" /> {t.back}
        </button>
      </div>
      <div className={styles.sessionHeader}>
        <div className={styles.sessionTitle}>
          {/* <span>{session.gameName || t.defaultGame}</span> */}
          <h1>{session.name}</h1>
          <small>
            {session.players.length} {t.players.toLocaleLowerCase()} ·{" "}
            {session.rounds.length} {t.roundCount}
          </small>
        </div>
        <div className={styles.cardActions}>
          <button onClick={onDuplicate}>
            <Copy size={15} aria-hidden="true" />
            {t.duplicate}
          </button>
          <button onClick={onDelete}>
            <Trash2 size={15} aria-hidden="true" />
            {t.delete}
          </button>
        </div>
        <div className={styles.timestampRow}>
          <small>
            {t.createdAt}: {formatDateTime(session.createdAt)}
          </small>
          <small>
            {t.updatedAt}: {formatDateTime(session.updatedAt)}
          </small>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primary} onClick={() => setShowRound(true)}>
            <Plus size={18} aria-hidden="true" /> {t.addRound}
          </button>
          <button onClick={() => setShowShare(true)}>
            <Share2 size={16} aria-hidden="true" /> {t.share}
          </button>
        </div>
      </div>
      <div className={styles.tabs}>
        <button
          className={view === "score" ? styles.activeTab : ""}
          onClick={() => setView("score")}
        >
          {t.ranking}
        </button>
        <button
          className={view === "history" ? styles.activeTab : ""}
          onClick={() => setView("history")}
        >
          {t.history}
        </button>
        <button
          className={view === "chart" ? styles.activeTab : ""}
          onClick={() => setView("chart")}
        >
          {t.chart}
        </button>
      </div>
      {view === "score" && (
        <>
          <div className={styles.scoreGrid}>
            {standings.map((player) => (
              <div
                className={`${styles.scoreCard} ${player.rank === 1 ? styles.winner : ""}`}
                key={player.id}
              >
                <span>#{player.rank}</span>
                <strong>{player.name}</strong>
                <b>{player.total}</b>
                <small>{session.unitName}</small>
              </div>
            ))}
          </div>
          <div className={styles.metrics} aria-label={t.ranking}>
            <div className={styles.metricCard}>
              <span>{t.metricTotal}</span>
              <strong>
                {metrics.totalScore} {session.unitName}
              </strong>
            </div>
            <div className={styles.metricCard}>
              <span>{t.metricAverage}</span>
              <strong>
                {metrics.averageScore.toLocaleString(
                  locale === "vi" ? "vi-VN" : "en-US",
                  { maximumFractionDigits: 2 },
                )}{" "}
                {session.unitName}
              </strong>
            </div>
            <div className={styles.metricCard}>
              <span>{t.metricRounds}</span>
              <strong>{metrics.roundsPlayed}</strong>
            </div>
            <div className={styles.metricCard}>
              <span>{t.metricHighest}</span>
              <strong>
                {metrics.highestScore} {session.unitName}
              </strong>
            </div>
          </div>
          <div className={styles.panel}>
            <h2>{t.players}</h2>
            <div className={styles.playerList}>
              {session.players.map((player) => (
                <div key={player.id}>
                  {editingPlayerId === player.id ? (
                    <div className={styles.inlineEdit}>
                      <input
                        value={editingPlayerName}
                        onChange={(event) =>
                          setEditingPlayerName(event.target.value)
                        }
                        aria-label={t.playerName}
                        autoFocus
                      />
                      <button onClick={saveRename} aria-label={t.save}>
                        <Check size={16} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setEditingPlayerId(null)}
                        aria-label={t.cancel}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{player.name}</span>
                      <div className={styles.playerActions}>
                        <button
                          onClick={() => startRename(player)}
                          aria-label={`${t.edit} ${player.name}`}
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => removePlayer(player.id)}
                          aria-label={`${t.delete} ${player.name}`}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.inlineAdd}>
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t.playerName}
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              />
              <button onClick={addPlayer}>
                <Plus size={16} aria-hidden="true" /> {t.addPlayer}
              </button>
            </div>
          </div>
        </>
      )}
      {view === "history" && (
        <History
          session={session}
          t={t}
          onEdit={(id) => {
            setRoundEditing(id);
            setShowRound(true);
          }}
          onDelete={(id) => {
            requestConfirmation(() => updateSession(deleteRound(session, id)));
          }}
        />
      )}
      {view === "chart" && (
        <Chart session={session} standings={standings} t={t} />
      )}
      {showRound && (
        <RoundDialog
          session={session}
          roundId={roundEditing}
          t={t}
          onClose={() => {
            setShowRound(false);
            setRoundEditing(null);
          }}
          onSave={(next) => {
            updateSession(next);
            setShowRound(false);
            setRoundEditing(null);
          }}
        />
      )}
      {showShare && (
        <ShareDialog
          session={session}
          standings={standings}
          locale={locale}
          t={t}
          onClose={() => setShowShare(false)}
        />
      )}
    </section>
  );
}

function RoundDialog({
  session,
  roundId,
  t,
  onClose,
  onSave,
}: {
  session: GameSession;
  roundId: string | null;
  t: Resources;
  onClose: () => void;
  onSave: (session: GameSession) => void;
}) {
  const round = session.rounds.find((item) => item.id === roundId);
  const [scores, setScores] = useState<Record<string, string>>(
    Object.fromEntries(
      session.players.map((p) => [p.id, round?.scores[p.id]?.toString() ?? ""]),
    ),
  );
  const [note, setNote] = useState(round?.note ?? "");
  function submit(e: SubmitEvent) {
    e.preventDefault();
    const numeric = Object.fromEntries(
      Object.entries(scores).map(([id, value]) => [id, Number(value) || 0]),
    );
    onSave(
      round
        ? updateRound(session, round.id, numeric, note)
        : addRound(session, numeric, note),
    );
  }
  return (
    <Dialog
      title={round ? `${t.edit} ${t.round} ${round.number}` : t.addRound}
      onClose={onClose}
    >
      <form onSubmit={submit} className={styles.form}>
        {session.players.map((player) => (
          <label key={player.id}>
            {player.name}
            <input
              type="number"
              inputMode="decimal"
              value={scores[player.id]}
              placeholder={t.scorePlaceholder}
              onChange={(e) =>
                setScores({ ...scores, [player.id]: e.target.value })
              }
            />
          </label>
        ))}
        <label>
          {t.note}
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <div className={styles.dialogActions}>
          <button type="button" onClick={onClose}>
            <X size={16} aria-hidden="true" />
            {t.cancel}
          </button>
          <button className={styles.primary} type="submit">
            <Check size={16} aria-hidden="true" />
            {t.save}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function History({
  session,
  t,
  onEdit,
  onDelete,
}: {
  session: GameSession;
  t: Resources;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={styles.history}>
      {session.rounds.length === 0 ? (
        <div className={styles.empty}>{t.noRounds}</div>
      ) : (
        [...session.rounds].reverse().map((round) => (
          <article className={styles.roundCard} key={round.id}>
            <div>
              <strong>
                {t.round} {round.number}
              </strong>
              <small>{round.note}</small>
            </div>
            <div className={styles.roundScores}>
              {session.players.map((player) => (
                <span key={player.id}>
                  {player.name}: <b>{round.scores[player.id] ?? 0}</b>
                </span>
              ))}
            </div>
            <div className={styles.cardActions}>
              <div className={styles.roundActions}>
                <button
                  className={styles.iconAction}
                  onClick={() => onEdit(round.id)}
                  aria-label={`${t.edit} ${t.round} ${round.number}`}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  className={`${styles.dangerText} ${styles.iconAction}`}
                  onClick={() => onDelete(round.id)}
                  aria-label={`${t.delete} ${t.round} ${round.number}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
              <div className={styles.timestampRow}>
                <small>
                  {t.createdAt}: {formatDateTime(round.createdAt)}
                </small>
                <small>
                  {t.updatedAt}: {formatDateTime(round.updatedAt)}
                </small>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function Chart({
  session,
  standings,
  t,
}: {
  session: GameSession;
  standings: ReturnType<typeof calculateStandings>;
  t: Resources;
}) {
  const series = chartSeries(session);
  const max = Math.max(
    1,
    ...series.flatMap((point) => Object.values(point.totals)),
    0,
  );
  const colors = ["#7c3aed", "#0ea5e9", "#f97316", "#10b981"];
  const chartWidth = Math.max(560, series.length * 90 + 80);
  const xFor = (index: number) =>
    40 + index * ((chartWidth - 80) / Math.max(series.length - 1, 1));
  const yFor = (value: number) => 220 - (value / max) * 180;
  return (
    <div className={styles.panel}>
      <h2>{t.chart}</h2>
      {series.length === 0 ? (
        <div className={styles.empty}>{t.noRounds}</div>
      ) : (
        <div className={styles.chart}>
          <svg
            className={styles.trendChart}
            viewBox={`0 0 ${chartWidth} 260`}
            role="img"
            aria-label={t.chart}
          >
            <line
              x1="40"
              y1="220"
              x2={chartWidth - 40}
              y2="220"
              stroke="currentColor"
            />
            {standings.map((player, index) => {
              const color = colors[index % colors.length];
              const points = series
                .map(
                  (point, pointIndex) =>
                    `${xFor(pointIndex)},${yFor(point.totals[player.id] ?? 0)}`,
                )
                .join(" ");
              return (
                <g key={player.id}>
                  <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {series.map((point, pointIndex) => (
                    <circle
                      key={`${player.id}-${point.round}`}
                      cx={xFor(pointIndex)}
                      cy={yFor(point.totals[player.id] ?? 0)}
                      r="5"
                      fill={color}
                    />
                  ))}
                </g>
              );
            })}
            {series.map((point, index) => (
              <text
                key={point.round}
                x={xFor(index)}
                y="248"
                textAnchor="middle"
              >
                {point.round}
              </text>
            ))}
          </svg>
          <div className={styles.chartLegend}>
            {standings.map((player, index) => (
              <span key={player.id}>
                <i style={{ background: colors[index % colors.length] }} />{" "}
                {player.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShareDialog({
  session,
  standings,
  locale,
  t,
  onClose,
}: {
  session: GameSession;
  standings: ReturnType<typeof calculateStandings>;
  locale: Locale;
  t: Resources;
  onClose: () => void;
}) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    makeImage(session, standings, locale).then(setBlob);
  }, [session, standings, locale]);
  function download() {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.name.replace(/[^a-z0-9-_]/gi, "-")}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function copyImage() {
    if (!blob || !("ClipboardItem" in window) || !navigator.clipboard?.write) {
      setMessage(t.unsupported);
      return;
    }
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setMessage(t.copied);
    } catch {
      setMessage(t.unsupported);
    }
  }
  return (
    <Dialog title={t.share} onClose={onClose}>
      <div className={styles.shareButtons}>
        <button className={styles.primary} onClick={download}>
          <Download size={16} aria-hidden="true" /> {t.download}
        </button>
        <button onClick={copyImage}>
          <Clipboard size={16} aria-hidden="true" /> {t.copyImage}
        </button>
      </div>
      {message && <p className={styles.notice}>{message}</p>}
    </Dialog>
  );
}

function SettingsDialog({
  t,
  locale,
  theme,
  setLocale,
  setTheme,
  onReset,
  onClose,
}: {
  t: Resources;
  locale: Locale;
  theme: Theme;
  setLocale: (value: Locale) => void;
  setTheme: (value: Theme) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog title={t.settings} onClose={onClose}>
      <div className={styles.form}>
        <label>
          {t.language}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </label>
        <label>
          {t.theme}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
          >
            <option value="system">{t.system}</option>
            <option value="light">{t.light}</option>
            <option value="dark">{t.dark}</option>
          </select>
        </label>
        <button className={styles.dangerButton} onClick={onReset}>
          <RotateCcw size={16} aria-hidden="true" />
          {t.reset}
        </button>
      </div>
    </Dialog>
  );
}

function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label={resources.en.close}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
