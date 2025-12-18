import React, { useState, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { useMeasure } from 'react-use';
import './Toast.css';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  ANIMATION_SCALE,
  ANIMATION_OFFSET,
  ANIMATION_TIMEOUT,
  SPRING_CONFIG,
  TOAST_DEFAULTS,
  TRANSITIONS
} from '../../constants/animations';

export interface ToastProps {
  id: string;
  message: React.ReactNode; // So we can add custom jsx elements like icons, buttons, links
}

interface ToastComponentProps extends ToastProps {
  onRemove: () => void;
  index: number;
  totalToasts: number;
  isExpanded: boolean;
  isHovered?: boolean;
  initialScale?: number;
  initialY?: number;
  exitScale?: number;
  expandedY?: number;
  onUpdateHeight?: (id: string, height: number) => void;
}

export const Toast: React.FC<ToastComponentProps> = props => {
  const { id, message, index, totalToasts, isExpanded, isHovered: isStackHovered, initialScale, initialY, exitScale, expandedY, onUpdateHeight, onRemove } = props;
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
    }, ANIMATION_TIMEOUT.SHORT);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose(e);
    }
  };

  // n collapsed mode, non-front toasts should appear at their final position (not slide from top)
  // only the front toast slides in from -100
  const shouldSlideFromTop = isFront || isExpanded;

  const collapsedSpacing = isStackHovered ? ANIMATION_OFFSET.COLLAPSED_SPACING_HOVER : ANIMATION_OFFSET.COLLAPSED_SPACING;

  const defaultInitialY = initialY !== undefined
    ? initialY
    : (shouldSlideFromTop ? ANIMATION_OFFSET.INITIAL_Y : offset * collapsedSpacing);

  const defaultInitialScale = initialScale !== undefined
    ? initialScale
    : (shouldSlideFromTop ? 1 : (1 - offset * ANIMATION_SCALE.STACK_REDUCTION));

  // custom transition for hover effect in collapsed mode
  const hoverTransition = !isExpanded && isStackHovered !== undefined
    ? { type: 'spring' as const, stiffness: 400, damping: 25, duration: 0.3 }
    : TRANSITIONS.NORMAL_EASE_OUT;

  return (
    <motion.div
      className="toast-wrapper"
      data-front={isFront}
      data-expanded={isExpanded}
      initial={{
        opacity: 0,
        y: defaultInitialY,
        scale: defaultInitialScale
      }}
      animate={{
        opacity: 1,
        y: isExpanded ? (expandedY ?? 0) : offset * collapsedSpacing,
        scale: isExpanded ? 1 : (isFront ? 1 : 1 - offset * ANIMATION_SCALE.STACK_REDUCTION),
        height: isRemoving ? 0 : height || 'auto',
      }}
      exit={{
        opacity: 0,
        y: -ANIMATION_OFFSET.VERTICAL,
        scale: exitScale,
        transition: TRANSITIONS.QUICK_EASE_OUT
      }}
      transition={{
        ...hoverTransition,
        height: { ...TRANSITIONS.NORMAL_EASE_OUT, delay: isRemoving ? TRANSITIONS.NORMAL_EASE_OUT.duration : 0 }
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000 + (totalToasts - offset),
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
          initial={{
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderWidth: '1px',
            boxShadow: TOAST_DEFAULTS.BOX_SHADOW,
          }}
          animate={{
            paddingTop: isRemoving ? 0 : '1rem',
            paddingBottom: isRemoving ? 0 : '1rem',
            marginBottom: isRemoving ? 0 : undefined,
            borderWidth: isRemoving ? 0 : '1px',
            boxShadow: isRemoving ? TOAST_DEFAULTS.BOX_SHADOW_HIDDEN : TOAST_DEFAULTS.BOX_SHADOW,
          }}
          transition={TRANSITIONS.NORMAL_EASE_OUT}
        >
          <motion.div
            animate={{ opacity: isRemoving ? 0 : 1 }}
            transition={TRANSITIONS.FAST_EASE_OUT}
          >
            <div
              className="toast-content"
              onClick={(e) => {
                if (isExpanded) {
                  e.stopPropagation();
                } else {
                  // Prevent links from opening in collapsed state
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'A' || target.closest('a')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
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
              initial={{ opacity: 0, scale: ANIMATION_SCALE.HIDDEN }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? ANIMATION_SCALE.VISIBLE : ANIMATION_SCALE.HIDDEN
              }}
              transition={{ type: 'spring', ...SPRING_CONFIG, duration: 300 }}
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
