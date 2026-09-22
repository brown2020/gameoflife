import React, { memo, useEffect, useCallback, useRef } from "react";

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
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 bg-gray-800 p-6 rounded-lg max-w-md text-white shadow-xl">
        <h2 id="modal-title" className="text-white text-xl mb-4">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
});

Modal.displayName = "Modal";
