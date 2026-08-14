import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions = null, // React nodes (Buttons)
  className = '',
  maxWidth = 'max-w-md' // max-w-sm, max-w-md, max-w-lg, max-w-xl
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-sp-16 font-sans">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidth} bg-bg-surface border border-border rounded-modal shadow-3 flex flex-col overflow-hidden max-h-[90vh] ${className}`}
          >
            {/* Header */}
            <div className="px-sp-24 py-sp-16 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-card font-semibold text-text-primary">{title}</h3>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary p-sp-4 rounded-button hover:bg-bg-secondary transition-all duration-150 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-sp-24 py-sp-24 overflow-y-auto flex-1 text-body text-text-secondary leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            {footerActions && (
              <div className="px-sp-24 py-sp-16 border-t border-border-subtle bg-bg-secondary flex items-center justify-end gap-sp-12">
                {footerActions}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
