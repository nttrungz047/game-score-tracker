"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { resources } from "@/lib/resources";
import styles from "@/app/page.module.css";

export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
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

export function formatDateTime(value: string): string {
  const date = new Date(value);
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
