import { motion } from 'motion/react';
import { TRANSITIONS } from '../../constants/animations';

interface AnimatedChevronProps {
  isExpanded: boolean;
}

// These are two lines that form a chevron and can be animated separately

export const AnimatedChevron: React.FC<AnimatedChevronProps> = ({ isExpanded }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Left line */}
      <motion.line
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{
          x1: 4,
          y1: 6,
          x2: 8,
          y2: 10,
        }}
        animate={{
          x1: 4,
          y1: isExpanded ? 10 : 6,
          x2: 8,
          y2: isExpanded ? 6 : 10,
        }}
        transition={TRANSITIONS.NORMAL_EASE_IN_OUT}
      />
      {/* Right line */}
      <motion.line
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{
          x1: 8,
          y1: 10,
          x2: 12,
          y2: 6,
        }}
        animate={{
          x1: 8,
          y1: isExpanded ? 6 : 10,
          x2: 12,
          y2: isExpanded ? 10 : 6,
        }}
        transition={TRANSITIONS.NORMAL_EASE_IN_OUT}
      />
    </svg>
  );
};
