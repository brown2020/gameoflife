import React, { memo, useEffect, useCallback, useRef } from "react";
import { Button } from "./Button";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export const Modal = memo<ModalProps>(({ children, title, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  const handleCancel = useCallback(
    (e: React.SyntheticEvent<HTMLDialogElement>) => {
      e.preventDefault();
      onClose();
    },
    [onClose]
  );

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 open:flex open:items-center open:justify-center"
      onCancel={handleCancel}
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 cursor-default"
        aria-label="Dismiss dialog backdrop"
        tabIndex={-1}
        onClick={onClose}
      />
      <div className="relative z-10 bg-gray-800 p-6 rounded-lg max-w-md text-white shadow-xl pointer-events-auto">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-white text-xl">
            {title}
          </h2>
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            aria-label="Close dialog"
          >
            Close
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  );
});

Modal.displayName = "Modal";
