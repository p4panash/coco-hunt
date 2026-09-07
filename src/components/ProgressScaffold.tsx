import { motion } from "motion/react";
import type { CheckpointIndex } from "../state/huntReducer";

type Props = {
  /** The full QR image (shown once the single stop is unlocked). */
  qrUrl: string | null;
  /** unlocked[0] gates the one cell. */
  unlocked: boolean[];
  currentN: CheckpointIndex | null;
  /** While the reveal animation plays, keep the cell empty so the centered
   * QR in the Reveal screen is the only one on screen. */
  revealingN: CheckpointIndex | null;
};

/**
 * Single-cell progress marker. One stop, one locker — so this is really just
 * a "you haven't got there yet / you got there" pip that fills with the QR.
 */
export default function ProgressScaffold({
  qrUrl,
  unlocked,
  currentN,
  revealingN,
}: Props) {
  const isCompleted = unlocked[0] && revealingN !== 0;
  const isActive = !isCompleted && currentN === 0;

  return (
    <div className="scaffold" role="progressbar" aria-label="hunt progress">
      <motion.div
        className={[
          "scaffold__cell",
          isCompleted && "scaffold__cell--done",
          isActive && "scaffold__cell--active",
        ]
          .filter(Boolean)
          .join(" ")}
        animate={isActive ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={
          isActive
            ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.25 }
        }
      >
        {isCompleted && qrUrl ? (
          <motion.img
            key="qr"
            src={qrUrl}
            alt=""
            initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            draggable={false}
          />
        ) : (
          <span className="scaffold__num" aria-hidden>
            ?
          </span>
        )}
      </motion.div>
    </div>
  );
}
