import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronUpIcon, TrashIcon } from '@radix-ui/react-icons';
import { Toast, ToastProps } from '../Toast/Toast';
import './Toaster.css';

export interface ToasterProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
  onRemoveAll: () => void;
  maxToasts?: number;
}

const topOffset = 32;

export const Toaster: React.FC<ToasterProps> = props => {
  const { toasts, onRemove, onRemoveAll, maxToasts = 3 } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (toasts.length > 1) {
      setIsExpanded(prev => !prev);
    }
  };

  const toastHeight = 64;
  const collapsedSpacing = 14;
  const expandedSpacing = 64;

  const visibleCount = isExpanded ? toasts.length : Math.min(toasts.length, maxToasts);
  const contentHeight = isExpanded
    ? toasts.length * (toastHeight + expandedSpacing)
    : visibleCount > 0 ? toastHeight + (visibleCount - 1) * collapsedSpacing
    : 0;

  return (
    <>
      <AnimatePresence>
        {isExpanded && toasts.length > 0 && (
          <motion.div
            className="toaster-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
      <div
        className="toaster"
        onClick={handleClick}
        aria-label="Notifications"
      >
        <div style={{ position: 'relative', height: `${contentHeight}px`, transition: 'height 0.4s ease-out' }}>
          <AnimatePresence mode="sync">
            {toasts.map((toast, index) => {
              const shouldBeVisible = isExpanded || index >= toasts.length - maxToasts;
              if (!shouldBeVisible) return null;

              const backToastScale = 1 - (maxToasts - 1) * 0.05;
              const isEnteringBeyondMax = isExpanded && index < toasts.length - maxToasts;
              const lastVisibleToastY = (maxToasts - 1) * collapsedSpacing;

              return (
                <Toast
                  key={toast.id}
                  {...toast}
                  index={index}
                  totalToasts={toasts.length}
                  isExpanded={isExpanded}
                  exitScale={backToastScale}
                  initialScale={isEnteringBeyondMax ? backToastScale : undefined}
                  initialY={isEnteringBeyondMax ? lastVisibleToastY : undefined}
                  onRemove={() => onRemove(toast.id)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      {/* {isExpanded && toasts.length > maxToasts && (
        <div className="toaster-scroll-indicator" />
      )} */}
      <AnimatePresence>
        {toasts.length > 1 && isExpanded && (
          <div className="options-button-container">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="collapse-all-button"
              initial={{ opacity: 0, y: -topOffset }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -topOffset }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              aria-label="Collapse all toasts"
            >
              <ChevronUpIcon className="close-icon" />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
                setTimeout(() => {
                  onRemoveAll();
                }, 150);
              }}
              className="dismiss-all-button"
              initial={{ opacity: 0, y: -topOffset * 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -topOffset }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              aria-label="Dismiss all toasts"
            >
              <TrashIcon className="trash-icon" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
Toaster.displayName = 'Toaster';
