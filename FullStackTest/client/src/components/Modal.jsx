import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/20 bg-white/80 dark:bg-neutral-900/80 p-6 shadow-2xl backdrop-blur-xl"
            >
              {title && (
                <h3 className="mb-4 text-lg font-semibold text-[color:var(--fg)]">
                  {title}
                </h3>
              )}
              <div className="text-sm text-[color:var(--muted)]">
                {children}
              </div>
              {footer && (
                <div className="mt-6 flex justify-end gap-3">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
