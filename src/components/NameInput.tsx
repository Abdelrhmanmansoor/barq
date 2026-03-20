'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function NameInput({ value, onChange, error }: NameInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
    >
      <label htmlFor="name" className="block text-base font-bold text-white/90 mb-4">
        Your Name
      </label>
      
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <motion.div
            animate={error ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.3 }}
          >
            <User className={`h-5 w-5 transition-colors duration-300 ${error ? 'text-red-400' : 'text-purple-400 group-hover:text-purple-300'}`} />
          </motion.div>
        </div>
        
        <motion.input
          type="text"
          id="name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your name"
          whileFocus={{ scale: 1.01 }}
          className={`
            w-full pl-14 pr-5 py-4 rounded-2xl border-2
            transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-purple-500/20
            bg-white/5 backdrop-blur-sm text-white placeholder:text-white/30
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-white/10 focus:border-purple-500/60 hover:border-white/20'
            }
          `}
          maxLength={50}
        />
        
        {/* Focus glow effect */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-blue-500/0 group-focus-within:from-purple-500/20 group-focus-within:via-pink-500/10 group-focus-within:to-blue-500/20 transition-all duration-500 blur-xl opacity-0 group-focus-within:opacity-100" />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-red-400 text-sm mt-3 font-medium flex items-center gap-2"
        >
          <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full" />
          {error}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 mt-3 px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20"
      >
        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
        <p className="text-sm text-white/60 font-medium">
          Supports Arabic and English names (max 50 characters)
        </p>
      </motion.div>
    </motion.div>
  );
}