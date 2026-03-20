'use client';

import { useLanguage } from '@/lib/languageContext';
import { t } from '@/lib/i18n';
import { Globe, Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const { language, setLanguage } = useLanguage();

  const isRTL = language === 'ar';

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 border-t border-white/5">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-2xl shadow-purple-500/40"
              >
                <Globe className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Barq
              </h3>
            </div>
            <p className="text-white/60 mb-6 leading-relaxed">
              {language === 'ar' 
                ? 'أنشئ بطاقات تهنئة عيد جميلة ومخصصة باستخدام الذكاء الاصطناعي'
                : 'Create beautiful, personalized Eid greetings using AI'
              }
            </p>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  language === 'ar'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                }`}
              >
                English
              </button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t(language, 'footer.company')}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: t(language, 'nav.about') },
                { href: '/contact', label: t(language, 'nav.contact') },
                { href: '/pricing', label: t(language, 'nav.pricing') },
                { href: '/gallery', label: t(language, 'nav.gallery') },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-300 hover:pl-2 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t(language, 'footer.support')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:support@barq-studio.com" className="text-white/60 hover:text-white transition-colors">
                  support@barq-studio.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/60">+965 1234 5678</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/60">Kuwait City, Kuwait</span>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t(language, 'footer.legal')}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/privacy', label: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' },
                { href: '/terms', label: language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions' },
                { href: '/refund', label: language === 'ar' ? 'سياسة الاسترجاع' : 'Refund Policy' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-300 hover:pl-2 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <motion.a
                href="https://twitter.com/barqstudio"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border border-white/10"
              >
                <Twitter className="w-5 h-5 text-white/60" />
              </motion.a>
              <motion.a
                href="https://instagram.com/barqstudio"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border border-white/10"
              >
                <Instagram className="w-5 h-5 text-white/60" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/company/barqstudio"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border border-white/10"
              >
                <Linkedin className="w-5 h-5 text-white/60" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-white/60">
              <Globe className="w-5 h-5 text-purple-400" />
              <span>{t(language, 'footer.securePayment')}</span>
            </div>

            {/* Payment Logos */}
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300 border border-white/10">
                <img
                  src="https://myfatoorah.com/img/myfatoorah-logo.png"
                  alt="MyFatoorah"
                  className="h-8 w-auto"
                />
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 hover:bg-white/10 transition-all duration-300 border border-white/10">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png"
                  alt="Visa"
                  className="h-6 w-auto"
                />
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 hover:bg-white/10 transition-all duration-300 border border-white/10">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png"
                  alt="Mastercard"
                  className="h-6 w-auto"
                />
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 hover:bg-white/10 transition-all duration-300 border border-white/10">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png"
                  alt="PayPal"
                  className="h-6 w-auto"
                />
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 hover:bg-white/10 transition-all duration-300 border border-white/10">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png"
                  alt="Apple Pay"
                  className="h-6 w-auto"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Barq. {t(language, 'footer.rights')}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </motion.div>
                <span className="text-sm text-white/70 font-medium">Made with ❤️ in Kuwait</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}