import { motion } from 'motion/react';

interface AnimatedChevronProps {
  isExpanded: boolean;
}

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
        x1="4"
        y1="6"
        x2="8"
        y2="10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{
          x1: isExpanded ? 4 : 4,
          y1: isExpanded ? 10 : 6,
          x2: 8,
          y2: isExpanded ? 6 : 10,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
      {/* Right line */}
      <motion.line
        x1="8"
        y1="10"
        x2="12"
        y2="6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{
          x1: 8,
          y1: isExpanded ? 6 : 10,
          x2: isExpanded ? 12 : 12,
          y2: isExpanded ? 10 : 6,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </svg>
  );
};
