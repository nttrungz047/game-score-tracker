"use client";

import type { GameSession } from "@/lib/domain";
import type { ReactNode } from "react";
import type { Resources } from "@/lib/resources";
import styles from "@/app/page.module.css";
import { SessionCard } from "./SessionCard";

type SessionListProps = {
  sessions: GameSession[];
  resources: Resources;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  children?: ReactNode;
};

export function SessionList({
  sessions,
  resources: t,
  onOpen,
  onDuplicate,
  onDelete,
  children,
}: SessionListProps) {
  if (children) return <div className={styles.sessionGrid}>{children}</div>;

  return (
    <div className={styles.sessionGrid}>
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          resources={t}
          onOpen={() => onOpen(session.id)}
          onDuplicate={() => onDuplicate(session.id)}
          onDelete={() => onDelete(session.id)}
        />
      ))}
    </div>
  );
}
