import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  danger?: boolean;
}

export function Modal({
  open,
  title,
  children,
  onClose,
  confirmLabel,
  cancelLabel = 'Отмена',
  onConfirm,
  danger = false,
}: ModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal__head">
          <h2 id={titleId}>{title}</h2>
          <button ref={closeRef} type="button" className="icon-button" aria-label="Закрыть" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__actions">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && confirmLabel ? (
            <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
