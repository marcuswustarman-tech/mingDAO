"use client";

import { motion } from 'motion/react';
import { ChartStyle } from './CandlestickChart';

interface ChartStyleSwitcherProps {
  currentStyle: ChartStyle;
  onStyleChange: (style: ChartStyle) => void;
}

export default function ChartStyleSwitcher({ currentStyle, onStyleChange }: ChartStyleSwitcherProps) {
  const styles: { value: ChartStyle; label: string }[] = [
    { value: 'ink', label: '1' },
    { value: 'pixel', label: '2' },
    { value: 'default', label: '3' },
    { value: 'river', label: '4' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="fixed bottom-8 right-8 z-[100] flex gap-1"
    >
      {styles.map((style) => (
        <motion.button
          key={style.value}
          onClick={() => onStyleChange(style.value)}
          className={`
            w-10 h-10 bg-white dark:bg-white
            text-black font-bold text-lg
            transition-all duration-300
            ${currentStyle === style.value
              ? 'border-4 border-black'
              : 'border-2 border-black hover:border-3'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            borderWidth: currentStyle === style.value ? '4px' : '2px',
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {style.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
