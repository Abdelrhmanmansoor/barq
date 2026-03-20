'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, ArrowRight } from 'lucide-react';
import PaymentModal, { PricingTier } from '@/components/PaymentModal';

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'مجاني',
    price: 0,
    currency: 'KWD',
    features: [
      'تحميلان مجانيان',
      'جودة عادية',
      'تحميل الصور',
      'دعم أساسي',
    ],
    popular: false,
  },
  {
    id: 'daily',
    name: 'يومي',
    price: 15,
    currency: 'KWD',
    features: [
      'تحميلات غير محدودة',
      'جودة عالية',
      'تسليم فوري',
      'بدون علامة مائية',
      'دعم متميز',
      'قوالب احترافية',
    ],
    popular: true,
  },
  {
    id: 'monthly',
    name: 'شهري',
    price: 30,
    currency: 'KWD',
    features: [
      'تحميلات غير محدودة',
      'جودة عالية',
      'تسليم فوري',
      'بدون علامة مائية',
      'دعم متميز',
      'تصاميم حصرية',
      'وصول مبكر للميزات الجديدة',
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.id === 'free') {
      window.location.href = '/';
      return;
    }
    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen deep-bg">
      {/* Hero Section - Inspired by Thmanyah */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-card px-6 py-2 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white/80">
                اختر الخطة المناسبة لك
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-zain">
              <span className="text-white">أسعار</span>{' '}
              <span className="gradient-text">شفافة</span>{' '}
              <span className="text-white">وواضحة</span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white/60 max-w-2xl mx-auto font-zain"
            >
              بدون رسوم خفية، إلغاء في أي وقت. اختر الخطة التي تناسب احتياجاتك
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards - Thmanyah-inspired Design */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className={`relative group ${
                  tier.popular
                    ? 'md:-mt-8 md:mb-8'
                    : ''
                }`}
              >
                {/* Glow Effect for Popular */}
                {tier.popular && (
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl blur-2xl -z-10"
                  />
                )}

                {/* Card */}
                <div
                  className={`relative h-full glass-card rounded-3xl p-8 transition-all duration-500 ${
                    tier.popular
                      ? 'border-purple-500/50 shadow-2xl'
                      : 'hover:border-purple-400/30 hover:shadow-2xl hover:shadow-purple-500/10'
                  }`}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-purple-500/30">
                        <Crown className="w-4 h-4" />
                        الأكثر طلباً
                      </div>
                    </motion.div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8 pt-6">
                    <h3 className="text-2xl font-bold mb-4 text-white font-zain">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-bold text-white font-zain">
                        {tier.price}
                      </span>
                      <span className="text-xl text-white/60 font-zain">
                        {tier.currency}
                      </span>
                    </div>
                    {tier.id !== 'free' && (
                      <p className="text-white/50 mt-2 font-zain">
                        {tier.id === 'daily' ? 'لليوم الواحد' : 'للشهر الواحد'}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.15 + 0.4 + idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`flex-shrink-0 mt-0.5 ${
                          tier.popular ? 'text-purple-400' : 'text-pink-400'
                        }`}>
                          <Check className="w-5 h-5" />
                        </div>
                        <span className="text-white/80 font-zain">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPlan(tier)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/30'
                        : 'glass text-white hover:bg-white/10'
                    } font-zain`}
                  >
                    {tier.id === 'free' ? 'ابدأ مجاناً' : 'اختر الخطة'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Premium Dark */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-16 font-zain"
          >
            <span className="gradient-text">أسئلة</span> شائعة
          </motion.h2>

          <div className="space-y-6">
            {[
              {
                question: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
                answer:
                  'نعم، يمكنك إلغاء اشتراكك في أي وقت. سيستمر الوصول الخاص بك حتى نهاية الفترة الحالية للفوترة.',
              },
              {
                question: 'ما هي طرق الدفع المتاحة؟',
                answer:
                  'نقبل جميع البطاقات الائتمانية الرئيسية وبطاقات الخصم عبر بوابة الدفع MyFatoorah.',
              },
              {
                question: 'هل يمكنني تجربة الخدمة مجاناً؟',
                answer:
                  'نعم! نقدم تحميلين مجانيين لتتمكن من تجربة خدمتنا قبل الالتزام بخطة مدفوعة.',
              },
              {
                question: 'ما هي جودة الصور التي أحصل عليها؟',
                answer:
                  'تشمل جميع الخطط المدفوعة صور عالية الدقة (1024×1024) مناسبة للطباعة والمشاركة الرقمية.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 hover:border-purple-400/30 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3 font-zain">
                  {faq.question}
                </h3>
                <p className="text-white/60 font-zain leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        
        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 left-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-10 right-1/3 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Icon */}
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 shadow-2xl shadow-purple-500/30 mb-8"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-zain">
              جاهز لإنشاء تحيات <span className="gradient-text">جميلة</span>؟
            </h2>

            {/* Subheading */}
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto font-zain">
              ابدأ بنسختنا المجانية وشاهد سحر تحيات العيد المولدة بالذكاء الاصطناعي
            </p>

            {/* CTA Button */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 font-zain"
            >
              جرب النسخة المجانية
              <ArrowRight className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectPlan={(tier) => {
          console.log('Selected plan:', tier);
        }}
      />
    </div>
  );
}