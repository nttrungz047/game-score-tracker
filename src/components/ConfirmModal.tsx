import { AlertTriangle, Check, X } from "lucide-react";
import type { Resources } from "@/lib/resources";
import styles from "./ConfirmModal.module.css";

type ConfirmModalProps = {
  resources: Resources;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  resources,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onCancel}>
      <section
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.icon}>
            <AlertTriangle size={20} aria-hidden="true" />
          </div>
          <button
            className={styles.close}
            onClick={onCancel}
            aria-label={resources.close}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <h2 id="confirm-title">{resources.confirm}</h2>
        <p>{resources.confirmDescription}</p>
        <div className={styles.actions}>
          <button onClick={onCancel}>
            <X size={16} aria-hidden="true" /> {resources.cancel}
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            <Check size={16} aria-hidden="true" /> {resources.confirmAction}
          </button>
        </div>
      </section>
    </div>
  );
}
