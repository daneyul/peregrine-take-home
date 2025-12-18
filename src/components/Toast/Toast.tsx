import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useMeasure } from 'react-use';
import './Toast.css';
import { Cross2Icon } from '@radix-ui/react-icons';

export interface ToastProps {
  id: string;
  message: React.ReactNode;
  icon?: React.ReactNode;
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
}

export const Toast: React.FC<ToastComponentProps> = props => {
  const { message, icon, index, totalToasts, isExpanded, initialScale, initialY, exitScale, onRemove } = props;
  const isFront = index === totalToasts - 1;
  const offset = totalToasts - 1 - index;
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => {
      onRemove();
    }, 150);
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
        y: isExpanded ? offset * 64 : offset * 14,
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
        overflow: isRemoving ? 'hidden' : 'visible',
      }}
    >
      <div ref={ref}>
        <motion.div
          className="toast"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
              {icon && <div className="toast-icon">{icon}</div>}
              <div className="toast-message">{message}</div>
            </div>
            <motion.span
              className="toast-close-button"
              onClick={handleClose}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.7
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, duration: 300 }}
            >
              <Cross2Icon className="dismiss-icon" />
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
Toast.displayName = 'Toast';
