'use client';

import { motion } from 'framer-motion';
import { Wand2, Sparkles, Lock } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  remainingAttempts?: number;
}

export default function GenerateButton({ onClick, isLoading, disabled, remainingAttempts }: GenerateButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative w-full py-5 rounded-2xl font-bold text-lg
        transition-all duration-300 overflow-hidden
        ${disabled && !isLoading
          ? 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
          : 'cursor-pointer'
        }
      `}
    >
      {disabled && !isLoading ? (
        <div className="relative z-10 flex items-center justify-center gap-3">
          <Lock className="w-5 h-5" />
          <span>Free attempts exhausted</span>
        </div>
      ) : isLoading ? (
        <div className="relative z-10 flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <span>Creating your greeting...</span>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10 flex items-center justify-center gap-3 text-white">
            <Wand2 className="w-6 h-6" />
            <span>Generate Greeting</span>
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shine" />
        </>
      )}
    </motion.button>
  );
}