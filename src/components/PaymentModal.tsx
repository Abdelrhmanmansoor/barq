'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles } from 'lucide-react';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'single',
    name: 'Single Use',
    price: 5,
    currency: 'KWD',
    features: [
      '1 premium generation',
      'High-quality output',
      'Instant delivery',
      'No watermarks',
    ],
  },
  {
    id: 'daily',
    name: '24 Hours',
    price: 15,
    currency: 'KWD',
    features: [
      'Unlimited generations',
      'High-quality output',
      'Instant delivery',
      'No watermarks',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'monthly',
    name: '30 Days',
    price: 30,
    currency: 'KWD',
    features: [
      'Unlimited generations',
      'High-quality output',
      'Instant delivery',
      'No watermarks',
      'Priority support',
      'Exclusive designs',
    ],
  },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (tier: PricingTier) => void;
}

export default function PaymentModal({ isOpen, onClose, onSelectPlan }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="glass-card rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 pointer-events-none" />
              
              {/* Header */}
              <div className="relative z-10 sticky top-0 bg-transparent backdrop-blur-xl p-8 flex items-center justify-between border-b border-white/10 rounded-t-[2.5rem]">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40"
                  >
                    <Crown className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Upgrade to Premium</h2>
                    <p className="text-base text-white/60">Unlock unlimited Eid greeting generations</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  <X className="w-6 h-6 text-white/70 hover:text-white" />
                </motion.button>
              </div>

              {/* Pricing Tiers */}
              <div className="relative z-10 p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {PRICING_TIERS.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className={`
                        relative p-8 rounded-3xl border-2 transition-all duration-300
                        ${tier.popular
                          ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 scale-105 shadow-2xl shadow-purple-500/30'
                          : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                        }
                      `}
                    >
                      {tier.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg shadow-purple-500/30 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Most Popular
                          </div>
                        </div>
                      )}

                      <h3 className="text-2xl font-bold text-white mb-3">{tier.name}</h3>
                      <div className="mb-6">
                        <span className="text-5xl font-bold animated-gradient-text">{tier.price}</span>
                        <span className="text-white/60 ml-2 text-xl">{tier.currency}</span>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base text-white/80">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectPlan(tier)}
                        className={`
                          w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden
                          ${tier.popular
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                          }
                        `}
                      >
                        {tier.popular && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full hover:animate-shine" />
                        )}
                        <span className="relative z-10">Select Plan</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-10 pt-8 border-t border-white/10">
                  <div className="flex flex-wrap justify-center gap-8 text-base">
                    {[
                      { icon: <Check className="w-5 h-5" />, text: 'Secure Payment' },
                      { icon: <Check className="w-5 h-5" />, text: 'Instant Activation' },
                      { icon: <Check className="w-5 h-5" />, text: '24/7 Support' },
                    ].map((badge, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="flex items-center gap-3 text-white/60"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          {badge.icon}
                        </div>
                        <span className="font-medium">{badge.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-white/40 mb-4">Powered by MyFatoorah</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 hover:bg-white/20 transition-all duration-300">
                      <img
                        src="https://myfatoorah.com/img/myfatoorah-logo.png"
                        alt="MyFatoorah"
                        className="h-8 w-auto"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/40">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Secure & Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}