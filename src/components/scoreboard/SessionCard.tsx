"use client";

import { Copy, Eye, Trash2 } from "lucide-react";
import type { GameSession } from "@/lib/domain";
import type { Resources } from "@/lib/resources";
import styles from "@/app/page.module.css";
import { formatDateTime } from "./elements";

type SessionCardProps = {
  session: GameSession;
  resources: Resources;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export function SessionCard({
  session,
  resources: t,
  onOpen,
  onDuplicate,
  onDelete,
}: SessionCardProps) {
  return (
    <article className={styles.sessionCard}>
      <div>
        <h2>{session.name}</h2>
        <p>
          {session.players.length} {t.players.toLocaleLowerCase()} ·{" "}
          {session.rounds.length} {t.roundCount}
        </p>
      </div>
      <div className={styles.cardActions}>
        <button onClick={onOpen}>
          <Eye size={15} aria-hidden="true" /> {t.open}
        </button>
        <button onClick={onDuplicate}>
          <Copy size={15} aria-hidden="true" /> {t.duplicate}
        </button>
        <button onClick={onDelete}>
          <Trash2 size={15} aria-hidden="true" /> {t.delete}
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
  );
}
