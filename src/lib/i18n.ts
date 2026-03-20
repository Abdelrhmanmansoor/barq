// Language support for Barq
export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      pricing: 'الأسعار',
      gallery: 'المعرض',
      contact: 'اتصل بنا',
    },
    // Home
    home: {
      heroTitle: 'صمم بطاقة عيد مميزة',
      heroSubtitle: 'أنشئ بطاقات تهنئة عيد شخصية باستخدام الذكاء الاصطناعي',
      uploadPhoto: 'رفع صورة',
      enterName: 'أدخل اسمك',
      generate: 'إنشاء بطاقة',
    },
    // About
    about: {
      title: 'عن برق',
      subtitle: 'إنشاء بطاقات تهنئة عيد جميلة ومخصصة مدعومة بالذكاء الاصطناعي',
      mission: 'مهمتنا',
      features: 'لماذا تختار برق؟',
      story: 'قصتنا',
      ready: 'جاهز لإنشاء بطاقتك؟',
    },
    // Pricing
    pricing: {
      title: 'أسعار بسيطة وشفافة',
      subtitle: 'اختر الخطة التي تناسبك. لا رسوم خفية، إلغاء في أي وقت',
      free: 'تجربة مجانية',
      daily: '24 ساعة',
      monthly: '30 يوم',
      getStarted: 'ابدأ مجاناً',
      choosePlan: 'اختر الخطة',
      popular: 'الأكثر شعبية',
    },
    // Footer
    footer: {
      company: 'الشركة',
      product: 'المنتج',
      support: 'الدعم',
      legal: 'قانوني',
      rights: 'جميع الحقوق محفوظة',
      securePayment: 'دفع آمن ومحمي',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      pricing: 'Pricing',
      gallery: 'Gallery',
      contact: 'Contact',
    },
    // Home
    home: {
      heroTitle: 'Create Premium Eid Cards',
      heroSubtitle: 'Generate personalized Eid greeting cards using AI',
      uploadPhoto: 'Upload Photo',
      enterName: 'Enter Your Name',
      generate: 'Generate Card',
    },
    // About
    about: {
      title: 'About Barq',
      subtitle: 'Creating beautiful, personalized Eid greetings powered by artificial intelligence',
      mission: 'Our Mission',
      features: 'Why Choose Barq?',
      story: 'Our Story',
      ready: 'Ready to Create Your Greeting?',
    },
    // Pricing
    pricing: {
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that fits your needs. No hidden fees, cancel anytime',
      free: 'Free Trial',
      daily: '24 Hours',
      monthly: '30 Days',
      getStarted: 'Get Started Free',
      choosePlan: 'Choose Plan',
      popular: 'MOST POPULAR',
    },
    // Footer
    footer: {
      company: 'Company',
      product: 'Product',
      support: 'Support',
      legal: 'Legal',
      rights: 'All rights reserved',
      securePayment: 'Secure Payment',
    },
  },
};

export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

export function isRTL(lang: Language): boolean {
  return lang === 'ar';
}