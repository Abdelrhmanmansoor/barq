'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultPreviewProps {
  imageUrl: string | null;
  onDownload: () => void;
  onShare: () => void;
  onRetry: () => void;
  isLoading: boolean;
}

export default function ResultPreview({ 
  imageUrl, 
  onDownload, 
  onShare, 
  onRetry,
  isLoading 
}: ResultPreviewProps) {
  // Trigger confetti when image is loaded
  const handleImageLoad = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8b5cf6', '#ec4899', '#f43f5e', '#667eea'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8b5cf6', '#ec4899', '#f43f5e', '#667eea'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  return (
    <AnimatePresence mode="wait">
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="glass-card rounded-3xl overflow-hidden relative">
            {/* Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            
            {/* Image Container */}
            <div className="relative aspect-square w-full bg-gradient-to-br from-purple-900/20 to-pink-900/20">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <p className="text-white/60 font-medium">Creating your greeting...</p>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt="Generated Eid Greeting"
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 p-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 relative overflow-hidden group"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onShare}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </motion.button>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-purple-500/50 text-purple-400 rounded-2xl font-bold hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                Generate Another
              </motion.button>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-sm text-white/60 flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </motion.div>
                  Your Eid greeting is ready to share!
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}