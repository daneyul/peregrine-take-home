import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TrashIcon } from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Toast, ToastProps } from '../Toast/Toast';
import { AnimatedChevron } from './AnimatedChevron';
import {
  ANIMATION_SCALE,
  ANIMATION_OFFSET,
  ANIMATION_TIMEOUT,
  TOAST_SPACING,
  TOAST_DEFAULTS,
  TRANSITIONS
} from '../../constants/animations';
import './Toaster.css';

export interface ToasterProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
  onRemoveAll: () => void;
  maxToasts?: number;
}

const topOffset = ANIMATION_OFFSET.VERTICAL;

export const Toaster: React.FC<ToasterProps> = props => {
  const { toasts, onRemove, onRemoveAll, maxToasts = 3 } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [heights, setHeights] = useState<Map<string, number>>(new Map());
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (toasts.length > 1) {
      setIsExpanded(prev => !prev);
    }
  };

  // Auto-dismiss all toasts after duration
  useEffect(() => {
    if (!TOAST_DEFAULTS.AUTO_DISMISS_ENABLED) return;
    if (toasts.length === 0) return;
    if (isHovered || isExpanded) return;

    const timer = setTimeout(() => {
      onRemoveAll();
    }, TOAST_DEFAULTS.AUTO_DISMISS_DURATION);

    return () => clearTimeout(timer);
  }, [toasts.length, isHovered, isExpanded, onRemoveAll]);

  const updateHeight = (id: string, height: number) => {
    setHeights(prev => {
      const currentHeight = prev.get(id);
      if (currentHeight === height) return prev;
      const newMap = new Map(prev);
      newMap.set(id, height);
      return newMap;
    });
  };

  const collapsedSpacing = TOAST_SPACING.COLLAPSED;
  const expandedSpacing = TOAST_SPACING.EXPANDED;

  // total container height
  const visibleCount = isExpanded ? toasts.length : Math.min(toasts.length, maxToasts);
  let totalHeight = 0;
  if (isExpanded) {
    toasts.forEach((toast, i) => {
      const height = heights.get(toast.id) || TOAST_DEFAULTS.HEIGHT;
      totalHeight += height;
      if (i < toasts.length - 1) totalHeight += expandedSpacing;
    });
  } else {
    const frontToastHeight = heights.get(toasts[toasts.length - 1]?.id) || TOAST_DEFAULTS.HEIGHT;
    totalHeight = frontToastHeight + (visibleCount - 1) * collapsedSpacing;
  }

  return (
    <>
      <AnimatePresence>
        {isExpanded && toasts.length > 0 && (
          <motion.div
            className="toaster-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.NORMAL_EASE_OUT}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
      <div
        className="toaster"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Notifications"
      >
        <div
          style={{
            position: 'relative',
            paddingBottom: expandedSpacing + collapsedSpacing * 4,
            minHeight: `${totalHeight}px`,
            transition: 'min-height 0.4s ease-out',
          }}
        >
          <AnimatePresence mode="sync">
            {toasts.map((toast, index) => {
              const shouldBeVisible = isExpanded || index >= toasts.length - maxToasts;
              if (!shouldBeVisible) return null;

              const backToastScale = 1 - (maxToasts - 1) * ANIMATION_SCALE.STACK_REDUCTION;
              // cards beyond max toasts enter from back, not top
              const isEnteringBeyondMax = index < toasts.length - maxToasts;
              const lastVisibleToastY = (maxToasts - 1) * collapsedSpacing;

              // calculate cumulative y-pos of each toast when expanded
              // sorting by front toast (newest) onwards
              let expandedY = 0;
              for (let i = toasts.length - 1; i > index; i--) {
                const nextHeight = heights.get(toasts[i].id) || TOAST_DEFAULTS.HEIGHT;
                expandedY += nextHeight + expandedSpacing;
              }

              return (
                <Toast
                  key={toast.id}
                  {...toast}
                  index={index}
                  totalToasts={toasts.length}
                  isExpanded={isExpanded}
                  isHovered={isHovered}
                  exitScale={backToastScale}
                  initialScale={isEnteringBeyondMax ? backToastScale : undefined}
                  initialY={isEnteringBeyondMax ? lastVisibleToastY : undefined}
                  expandedY={expandedY}
                  onUpdateHeight={updateHeight}
                  onRemove={() => onRemove(toast.id)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <Tooltip.Provider delayDuration={300}>
        <AnimatePresence>
          {((toasts.length > maxToasts && !isExpanded) || (toasts.length > 1 && isExpanded)) && (
            <motion.div
              className="options-button-container"
              initial={{ opacity: 0, y: -topOffset }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -topOffset }}
              transition={TRANSITIONS.SLOW_EASE_OUT}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setIsExpanded(prev => !prev);
                    }}
                    className="collapse-all-button"
                    aria-label={isExpanded ? "Collapse all toasts" : "Expand all toasts"}
                  >
                    <AnimatedChevron isExpanded={isExpanded} />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content asChild sideOffset={5} side="right">
                    <motion.div
                      className="tooltip-content"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={TRANSITIONS.FAST_EASE_OUT}
                    >
                      {isExpanded ? "Collapse All" : "Expand All"}
                    </motion.div>
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <AnimatePresence>
                {isExpanded && (
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <motion.button
                        onClick={e => {
                          e.stopPropagation();
                          setIsExpanded(false);
                          setTimeout(() => {
                            onRemoveAll();
                          }, ANIMATION_TIMEOUT.SHORT);
                        }}
                        className="dismiss-all-button"
                        initial={{ opacity: 0, scale: ANIMATION_SCALE.HIDDEN }}
                        animate={{ opacity: 1, scale: ANIMATION_SCALE.VISIBLE }}
                        exit={{ opacity: 0, scale: ANIMATION_SCALE.HIDDEN }}
                        transition={TRANSITIONS.SLOW_SPRING}
                        aria-label="Dismiss all toasts"
                      >
                        <TrashIcon className="trash-icon" />
                      </motion.button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content asChild sideOffset={5} side="right">
                        <motion.div
                          className="tooltip-content"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={TRANSITIONS.FAST_EASE_OUT}
                        >
                          Dismiss all
                        </motion.div>
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </Tooltip.Provider>
    </>
  );
};
Toaster.displayName = 'Toaster';
