'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { imageGenerator } from '@/lib/api/imageGenerator';
import { toast } from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import NameInput from '@/components/NameInput';
import GenerateButton from '@/components/GenerateButton';
import ResultPreview from '@/components/ResultPreview';
import PaymentModal, { PricingTier } from '@/components/PaymentModal';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Image as ImageIcon,
  Palette,
  Wand2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Rocket,
  Sparkles as SparklesIcon,
  Layers,
  Command
} from 'lucide-react';

export default function Home() {
  const {
    user,
    isGenerating,
    generatedImage,
    setUser,
    setGenerating,
    setGeneratedImage,
    setError,
    incrementAttempt,
    getStats,
  } = useAppStore();

  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [nameError, setNameError] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const stats = getStats();

  // Initialize user session
  useEffect(() => {
    if (!user) {
      setUser({
        id: crypto.randomUUID(),
        attemptsUsed: 0,
        isPremium: false,
      });
    }
  }, [user, setUser]);

  // Validate inputs
  const validateInputs = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Please enter your name');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!selectedImage) {
      setImageError('Please upload a photo');
      isValid = false;
    } else {
      setImageError('');
    }

    return isValid;
  };

  // Handle image selection
  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setImageError('');
  };

  // Handle image clear
  const handleImageClear = () => {
    setSelectedImage(null);
  };

  // Detect language (Arabic or English)
  const detectLanguage = (text: string): 'ar' | 'en' => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text) ? 'ar' : 'en';
  };

  // Handle generate
  const handleGenerate = async () => {
    if (!validateInputs()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (stats.remainingFreeAttempts <= 0 && !stats.premiumUnlocked) {
      setShowPaymentModal(true);
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const base64Image = await imageGenerator.fileToBase64(selectedImage!);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          imageData: base64Image,
          language: detectLanguage(name),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
      incrementAttempt();
      toast.success('Eid greeting generated successfully!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  // Handle download
  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eid-greeting-${name}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!generatedImage) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Eid Greeting',
          text: `Happy Eid from ${name}!`,
          url: window.location.href,
        });
      } catch (error) {
        toast.error('Failed to share');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Handle retry
  const handleRetry = () => {
    setGeneratedImage(null);
    setName('');
    setSelectedImage(null);
    setNameError('');
    setImageError('');
  };

  // Handle payment plan selection
  const handleSelectPlan = async (tier: PricingTier) => {
    if (!user) {
      toast.error('User session not initialized');
      return;
    }

    try {
      toast.loading('Initiating payment...');

      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: tier.price,
          currency: tier.currency,
          customerEmail: user.email || 'user@example.com',
          customerName: name || 'User',
          userId: user.id,
          language: detectLanguage(name),
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || 'Failed to initiate payment');
      }
    } catch (error) {
      toast.error('Payment initialization failed');
    } finally {
      toast.dismiss();
    }
  };

  return (
    <main className="min-h-screen deep-bg relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[10%] right-[15%] w-96 h-96 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center max-w-5xl mx-auto mb-20"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-12 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </motion.div>
                <span className="text-base font-semibold text-white/90">AI-Powered Eid Greetings</span>
                <Star className="w-4 h-4 text-yellow-400" />
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              >
                <span className="block mb-2">Create Stunning</span>
                <span className="animated-gradient-text">Eid Greetings</span>
                <span className="block mt-2">with AI</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Transform your photos into beautiful, personalized Eid greeting cards using cutting-edge AI technology. Share joy with your loved ones.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-5"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl font-bold text-white text-lg shadow-2xl shadow-purple-500/30 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Get Started Free
                    <Rocket className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white/20 rounded-2xl font-bold text-white text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  View Gallery
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Generator Section - Premium Glass Card */}
            <motion.div
              id="generator"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                {/* Gradient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {!generatedImage ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                      >
                        <NameInput
                          value={name}
                          onChange={setName}
                          error={nameError}
                        />

                        <ImageUploader
                          onImageSelect={handleImageSelect}
                          onImageClear={handleImageClear}
                          selectedImage={selectedImage}
                          error={imageError}
                        />

                        <GenerateButton
                          onClick={handleGenerate}
                          isLoading={isGenerating}
                          disabled={stats.remainingFreeAttempts <= 0 && !stats.premiumUnlocked}
                          remainingAttempts={stats.remainingFreeAttempts}
                        />

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-center pt-6 border-t border-white/10"
                        >
                          <p className="text-base text-white/60">
                            {stats.premiumUnlocked ? (
                              <span className="text-purple-400 font-semibold flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Premium Unlocked - Unlimited Generations
                              </span>
                            ) : (
                            `${stats.totalAttempts} of 2 free attempts used`
                            )}
                          </p>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ResultPreview
                          imageUrl={generatedImage}
                          onDownload={handleDownload}
                          onShare={handleShare}
                          onRetry={handleRetry}
                          isLoading={isGenerating}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Why Choose <span className="gradient-text">Barq</span>
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Experience the future of digital greetings with our AI-powered platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Wand2 className="w-10 h-10" />,
                  title: 'AI-Powered Design',
                  description: 'Our advanced AI creates stunning, unique designs tailored to your photos',
                },
                {
                  icon: <Clock className="w-10 h-10" />,
                  title: 'Instant Generation',
                  description: 'Get beautiful greeting cards in seconds, not hours',
                },
                {
                  icon: <ImageIcon className="w-10 h-10" />,
                  title: 'High Quality Output',
                  description: 'Download your greetings in crisp, print-ready resolution',
                },
                {
                  icon: <Palette className="w-10 h-10" />,
                  title: 'Beautiful Templates',
                  description: 'Choose from a variety of professionally designed templates',
                },
                {
                  icon: <Shield className="w-10 h-10" />,
                  title: 'Secure & Private',
                  description: 'Your photos are processed securely and never shared',
                },
                {
                  icon: <Zap className="w-10 h-10" />,
                  title: 'Easy to Use',
                  description: 'No design skills needed - just upload and generate',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-2xl p-8 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-white/60 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden">
              {/* Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { value: '10K+', label: 'Greetings Created' },
                  { value: '98%', label: 'Satisfaction Rate' },
                  { value: '24/7', label: 'AI Processing' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    className="text-center"
                  >
                    <div className="text-6xl md:text-7xl font-bold animated-gradient-text mb-4">
                      {stat.value}
                    </div>
                    <div className="text-xl text-white/60 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-card rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20" />
                
                <div className="relative z-10">
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl mb-10 shadow-2xl shadow-purple-500/40"
                  >
                    <SparklesIcon className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="text-5xl md:text-6xl font-bold mb-6">
                    Ready to Create Your{' '}
                    <span className="gradient-text">Perfect Greeting?</span>
                  </h2>
                  <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of users who have already created beautiful Eid greetings. Start for free today!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                    className="relative px-10 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl font-bold text-white text-xl shadow-2xl shadow-purple-500/30 overflow-hidden group mx-auto block"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Start Creating Now
                      <Rocket className="w-6 h-6" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectPlan={handleSelectPlan}
      />
    </main>
  );
}