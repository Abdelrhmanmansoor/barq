'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-[#423099]">Barq</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Creating beautiful, personalized Eid greetings powered by artificial intelligence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At Barq, we believe every Eid greeting should be as unique as the person receiving it. 
              Our AI-powered platform transforms your photos into stunning, personalized greeting cards 
              that capture the joy and spirit of Eid celebrations.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you're celebrating with family near or far, our platform makes it easy to 
              create and share beautiful, heartfelt greetings that will be treasured for years to come.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 text-center mb-12"
          >
            Why Choose Barq?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered',
                description: 'Advanced AI creates stunning, unique designs tailored to your preferences.',
              },
              {
                icon: Zap,
                title: 'Instant Results',
                description: 'Generate beautiful greeting cards in seconds, not hours or days.',
              },
              {
                icon: Heart,
                title: 'Personal Touch',
                description: 'Add your name and photo for a truly personalized experience.',
              },
              {
                icon: Star,
                title: 'Premium Quality',
                description: 'High-resolution outputs perfect for printing or sharing online.',
              },
              {
                icon: Heart,
                title: 'Easy Sharing',
                description: 'Download, print, or share directly to social media with one click.',
              },
              {
                icon: Sparkles,
                title: 'Affordable',
                description: 'Premium quality at competitive prices with free trials.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-[#423099]/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-[#423099]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Barq was born from a simple idea: Eid greetings should be personal, beautiful, 
                  and easy to create. Our founders noticed that traditional greeting cards were often 
                  generic and lacked the personal touch that makes Eid special.
                </p>
                <p>
                  Combining cutting-edge AI technology with beautiful design principles, we created 
                  a platform that transforms your memories into stunning greeting cards. Every card 
                  tells a story, carries emotion, and creates lasting connections.
                </p>
                <p>
                  Today, we're proud to help thousands of families celebrate Eid with unique, 
                  personalized greetings that bring joy and warmth to their celebrations.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-6xl font-bold text-[#423099] mb-2">1000+</div>
                <div className="text-xl text-gray-700 mb-8">Happy Customers</div>
                <div className="text-6xl font-bold text-[#423099] mb-2">5000+</div>
                <div className="text-xl text-gray-700">Greetings Created</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Create Your Greeting?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are creating beautiful, personalized Eid greetings
            </p>
            <a
              href="/"
              className="inline-block bg-white text-[#423099] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Free
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}