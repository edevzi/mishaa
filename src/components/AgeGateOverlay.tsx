'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface AgeGateOverlayProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmAction: () => void;
  cancelAction: () => void;
  zIndex?: number;
}

export default function AgeGateOverlay({
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmAction,
  cancelAction,
  zIndex = 20000,
}: AgeGateOverlayProps) {
  return (
    <LazyMotion features={domAnimation} strict>
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      className="ic-dialog-scrim"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        className="ic-dialog"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-btn bg-accent-tint text-accent-text">
            <ShieldAlert size={20} aria-hidden />
          </span>
          <span className="ic-eyebrow">Age verification</span>
        </div>

        <h2 className="ic-dialog__title">{title}</h2>
        <p className="ic-dialog__body whitespace-pre-line">{description}</p>

        <div className="ic-dialog__actions">
          <button type="button" onClick={cancelAction} className="ic-btn ic-btn--ghost ic-btn--md">
            {cancelLabel}
          </button>
          <button type="button" onClick={confirmAction} className="ic-btn ic-btn--primary ic-btn--md">
            {confirmLabel}
          </button>
        </div>
      </m.div>
    </m.div>
    </LazyMotion>
  );
}
