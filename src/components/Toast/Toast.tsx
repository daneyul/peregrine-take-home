import React, { useState, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { useMeasure } from 'react-use';
import './Toast.css';
import { Cross2Icon } from '@radix-ui/react-icons';

export interface ToastProps {
  id: string;
  message: React.ReactNode;
}

interface ToastComponentProps extends ToastProps {
  onRemove: () => void;
  index: number;
  totalToasts: number;
  isExpanded: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  initialScale?: number;
  initialY?: number;
  exitScale?: number;
  expandedY?: number;
  onUpdateHeight?: (id: string, height: number) => void;
}

export const Toast: React.FC<ToastComponentProps> = props => {
  const { id, message, index, totalToasts, isExpanded, initialScale, initialY, exitScale, expandedY, onUpdateHeight, onRemove } = props;
  const isFront = index === totalToasts - 1;
  const offset = totalToasts - 1 - index;
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  useLayoutEffect(() => {
    if (height && onUpdateHeight) {
      onUpdateHeight(id, height);
    }
  }, [height, id, onUpdateHeight]);

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => {
      onRemove();
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose(e);
    }
  };

  return (
    <motion.div
      className="toast-wrapper"
      data-front={isFront}
      data-expanded={isExpanded}
      initial={{
        opacity: 0,
        y: initialY !== undefined ? initialY : -100,
        scale: initialScale !== undefined ? initialScale : 1
      }}
      animate={{
        opacity: 1,
        y: isExpanded ? (expandedY ?? 0) : offset * 14,
        scale: isExpanded ? 1 : (isFront ? 1 : 1 - offset * 0.05),
        height: isRemoving ? 0 : height || 'auto',
      }}
      exit={{
        opacity: 0,
        y: -32,
        scale: exitScale,
        transition: { duration: 0.25, ease: 'easeOut' }
      }}
      transition={{
        duration: 0.4,
        height: { duration: 0.3, delay: isRemoving ? 0.3 : 0, ease: 'easeOut' }
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: totalToasts - offset,
        overflow: 'visible',
      }}
    >
      <div ref={ref}>
        <motion.div
          className="toast"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderWidth: '1px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          animate={{
            paddingTop: isRemoving ? 0 : '1rem',
            paddingBottom: isRemoving ? 0 : '1rem',
            marginBottom: isRemoving ? 0 : undefined,
            borderWidth: isRemoving ? 0 : '1px',
            boxShadow: isRemoving ? '0px 0px 0px rgba(0, 0, 0, 0)' : '0px 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ opacity: isRemoving ? 0 : 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div
              className="toast-content"
              onClick={(e) => {
                if (isExpanded) {
                  e.stopPropagation();
                }
              }}
            >
              <div className="toast-message">{message}</div>
            </div>
            <motion.button
              className="toast-close-button"
              onClick={handleClose}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClose(e);
                }
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.7
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, duration: 300 }}
              aria-label="Close notification"
              tabIndex={isHovered ? 0 : -1}
            >
              <Cross2Icon className="dismiss-icon" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
Toast.displayName = 'Toast';
