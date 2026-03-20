'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import {
  Zap, CheckCircle2, Star, Camera, Palette, PenLine, Wand2,
  Upload, Download, Share2, RotateCcw, Users, Clock, ThumbsUp, Building2,
  ChevronLeft,
} from 'lucide-react';

/* ── Banner images with natural dimensions captured on load ── */
type BannerInfo = { w: number; h: number };

/* ── Loading messages ── */
const LOADING_MSGS = [
  'يا رب تطلع حلوة 🤲',
  'الذكاء الاصطناعي شغّال بكل طاقته ⚡',
  'أبشر، ما يخيب الظن 😄',
  'شوي شوي، كل شي بوقته 🕐',
  'عم يرسم وجهك بالذهب ✨',
  'جاهز تعرضها على أهلك؟ 😏',
  'خلّها تشتغل، النتيجة تستاهل 🎨',
  'أحسن من أي مصمم والله 💪',
];

import { useAppStore } from '@/lib/store';
import { imageGenerator } from '@/lib/api/imageGenerator';
import PaymentModal, { PricingTier } from '@/components/PaymentModal';

/* ── Presets ── */
const PRESETS = [
  { id: 1, name: 'سينمائي فاخر', img: '/templetes/Gemini_Generated_Image_64m1dc64m1dc64m1.png' },
  { id: 2, name: 'أنثوي ناعم',   img: '/templetes/Gemini_Generated_Image_aoh24raoh24raoh2.png' },
  { id: 3, name: 'عصري راقٍ',    img: '/templetes/Gemini_Generated_Image_bjb5ovbjb5ovbjb5.png' },
  { id: 4, name: 'صباح العيد',   img: '/templetes/Gemini_Generated_Image_nz00j8nz00j8nz00.png' },
  { id: 5, name: 'فناء العيد',   img: '/templetes/Gemini_Generated_Image_pxnj80pxnj80pxnj.png' },
  { id: 6, name: 'مجلس دافئ',   img: '/templetes/Gemini_Generated_Image_py5xylpy5xylpy5x.png' },
];

/* ── Ticker ── */
const TICKER_A = ['صنع تهنئتك الآن', 'عيد مبارك', 'تهنئة فاخرة بالذكاء الاصطناعي', 'برق ستديو'];
const TICKER_B = ['تقبل الله طاعاتكم', 'كل عام وأنتم بخير', 'عيد الفطر المبارك', 'أجمل التهاني'];

/* ── Icon helper ── */
const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="how-icon">{children}</div>
);

export default function Home() {
  const {
    user, isGenerating, generatedImage,
    setUser, setGenerating, setGeneratedImage, setError, incrementAttempt, getStats,
  } = useAppStore();

  const [name, setName]                   = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]       = useState<string | null>(null);
  const [activePreset, setActivePreset]   = useState(1);
  const [nameError, setNameError]         = useState('');
  const [imageError, setImageError]       = useState('');
  const [showPayment, setShowPayment]     = useState(false);
  const [banner1, setBanner1]             = useState<BannerInfo | null>(null);
  const [banner2, setBanner2]             = useState<BannerInfo | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const stats                             = getStats();

  useEffect(() => {
    if (!user) setUser({ id: crypto.randomUUID(), attemptsUsed: 0, isPremium: false });
  }, [user, setUser]);

  useEffect(() => {
    if (!isGenerating) return;
    setLoadingMsgIdx(0);
    const id = setInterval(() => setLoadingMsgIdx(i => (i + 1) % LOADING_MSGS.length), 2200);
    return () => clearInterval(id);
  }, [isGenerating]);

  const detectLanguage = (t: string): 'ar' | 'en' => /[\u0600-\u06FF]/.test(t) ? 'ar' : 'en';

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setImageError('');
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleImageSelect(file);
  };

  const handleGenerate = async () => {
    let valid = true;
    if (!name.trim()) { setNameError('الرجاء إدخال الاسم'); valid = false; } else setNameError('');
    if (!selectedImage) { setImageError('الرجاء رفع صورة'); valid = false; } else setImageError('');
    if (!valid) return;
    if (stats.remainingFreeAttempts <= 0 && !stats.premiumUnlocked) { setShowPayment(true); return; }

    setGenerating(true); setError(null);
    try {
      const base64Image = await imageGenerator.fileToBase64(selectedImage!);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, imageData: base64Image, imageType: selectedImage!.type, presetId: activePreset }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'فشل توليد الصورة');
      setGeneratedImage(data.imageUrl);
      incrementAttempt();
      toast.success('تم توليد التهنئة بنجاح!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'حدث خطأ ما';
      setError(msg); toast.error(msg);
    } finally { setGenerating(false); }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const blob = await (await fetch(generatedImage)).blob();
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: `eid-greeting-${name}.png` });
      document.body.appendChild(a); a.click();
      URL.revokeObjectURL(url); document.body.removeChild(a);
      toast.success('تم التحميل!');
    } catch { toast.error('فشل التحميل'); }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    if (navigator.share) await navigator.share({ title: 'تهنئة العيد', text: `عيد مبارك من ${name}!`, url: location.href });
    else { navigator.clipboard.writeText(location.href); toast.success('تم نسخ الرابط!'); }
  };

  const handleRetry = () => {
    setGeneratedImage(null); setName(''); setSelectedImage(null);
    setPreviewUrl(null); setNameError(''); setImageError('');
  };

  const handleSelectPlan = async (tier: PricingTier) => {
    if (!user) return;
    try {
      toast.loading('جارٍ تهيئة الدفع...');
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: tier.price, currency: tier.currency,
          customerEmail: user.email || 'user@example.com',
          customerName: name || 'User', userId: user.id,
          language: detectLanguage(name),
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentUrl) location.href = data.paymentUrl;
      else toast.error(data.error || 'فشل بدء الدفع');
    } catch { toast.error('فشل بدء الدفع'); }
    finally { toast.dismiss(); }
  };


  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="nav-wrap">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <img src="/Barq-Logo1.png" alt="برق ستديو" className="nav-logo-img" />
          </a>
          <ul className="nav-links">
            <li><a href="#how">كيف يعمل</a></li>
            <li><a href="#presets">الأستايلات</a></li>
            <li><a href="#numbers">أرقامنا</a></li>
            <li><a href="#form">ابدأ الآن</a></li>
            <li>
              <a href="https://wa.me/96500000000" target="_blank" rel="noopener noreferrer" className="nav-cta">
                تواصل معنا
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero">
        {/* Background: two images side by side, darkened */}
        <div className="hero-bg">
          <div className="hero-bg-panel">
            <img
              src="/Saudi_family_celebrating_202603200328.jpeg"
              alt=""
              onLoad={e => { const t = e.currentTarget; setBanner1({ w: t.naturalWidth, h: t.naturalHeight }); }}
            />
            {banner1 && <span className="hero-dim-tag">{banner1.w} × {banner1.h} px</span>}
          </div>
          <div className="hero-bg-panel">
            <img
              src="/Saudi_family_celebrating_202603200325.jpeg"
              alt=""
              onLoad={e => { const t = e.currentTarget; setBanner2({ w: t.naturalWidth, h: t.naturalHeight }); }}
            />
            {banner2 && <span className="hero-dim-tag">{banner2.w} × {banner2.h} px</span>}
          </div>
        </div>

        {/* Foreground content */}
        <div className="hero-wrap">
          {/* Text — left */}
          <div>
            <div className="hero-badge">
              <Zap size={13} />
              هدية العيد من برق ستديو
            </div>
            <h1 className="hero-h1">
              تهنئة عيد <span className="blue">فاخرة</span><br />
              بلمسة <span className="gold">ذهبية</span> شخصية
            </h1>
            <p className="hero-sub">
              ارفع صورتك، اختر الأستايل، وخلّي الذكاء الاصطناعي يصنع لك تهنئة عيد احترافية تبهر أحبابك
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}>
                ولّد تهنئتي الآن
                <ChevronLeft size={16} />
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('presets')?.scrollIntoView({ behavior: 'smooth' })}>
                شوف الأستايلات
              </button>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-icon"><CheckCircle2 size={13} /></span>
                +500 تهنئة
              </div>
              <div className="trust-div" />
              <div className="trust-item">
                <span className="trust-icon"><Clock size={13} /></span>
                48 ساعة
              </div>
              <div className="trust-div" />
              <div className="trust-item">
                <span className="trust-icon"><Star size={13} /></span>
                97% رضا
              </div>
            </div>
          </div>

          {/* Template thumbnails — right */}
          <div>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.78rem', fontWeight: 700, marginBottom: '.75rem', letterSpacing: '.5px', textTransform: 'uppercase' }}>
              اختر أستايلك
            </p>
            <div className="hero-templates">
              {PRESETS.map(p => (
                <div
                  key={p.id}
                  className={`hero-tpl${activePreset === p.id ? ' active' : ''}`}
                  onClick={() => setActivePreset(p.id)}
                >
                  <img src={p.img} alt={p.name} loading="lazy" />
                  <div className="hero-tpl-overlay" />
                  <div className="hero-tpl-check"><CheckCircle2 size={11} /></div>
                  <div className="hero-tpl-label">{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── MARQUEE ── */}
      <div className="marquee-section">
        <div className="marquee-wrap">
          <div className="ticker-strip strip-a">
            <div className="ticker-inner">
              {[...Array(4)].flatMap((_, i) =>
                TICKER_A.map((txt, j) => (
                  <span key={`a-${i}-${j}`} className="ticker-item">
                    {txt} <span className="ticker-sep" />
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="ticker-strip strip-b">
            <div className="ticker-inner">
              {[...Array(4)].flatMap((_, i) =>
                TICKER_B.map((txt, j) => (
                  <span key={`b-${i}-${j}`} className="ticker-item">
                    {txt} <span className="ticker-sep" />
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="how-section">
        <div style={{ textAlign: 'center' }}>
          <div className="sec-tag">كيف يعمل</div>
          <h2 className="sec-h">أربع خطوات بسيطة</h2>
          <p className="sec-sub">من الصورة إلى تهنئة احترافية في دقائق</p>
        </div>
        <div className="how-grid">
          {[
            { num: '01', Icon: Camera,   title: 'ارفع صورتك',    desc: 'ارفع صورة واضحة لك أو للشخص اللي تبي تهنّيه' },
            { num: '02', Icon: Palette,  title: 'اختر الأستايل', desc: 'اختار من بين 6 أستايلات فاخرة مصممة بعناية' },
            { num: '03', Icon: PenLine,  title: 'أدخل الاسم',    desc: 'اكتب اسم المُهنَّأ بالعربي أو الإنجليزي' },
            { num: '04', Icon: Wand2,    title: 'ولّد التهنئة',  desc: 'الذكاء الاصطناعي يصنع تهنئتك الفاخرة في ثوانٍ' },
          ].map(step => (
            <div key={step.num} className="how-card">
              <div className="how-card-corner">{step.num}</div>
              <IconBox><step.Icon size={22} strokeWidth={1.6} color="var(--blue)" /></IconBox>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRESETS GRID ── */}
      <section id="presets" className="presets-section">
        <div className="presets-section-header">
          <div className="sec-tag">الأستايلات</div>
          <h2 className="sec-h">اختر أستايلك المفضل</h2>
          <p className="sec-sub">6 أستايلات فاخرة مصممة خصيصاً لعيد الفطر المبارك</p>
        </div>
        <div className="presets-grid">
          {PRESETS.map(p => (
            <div
              key={p.id}
              className={`preset-card${activePreset === p.id ? ' active' : ''}`}
              onClick={() => setActivePreset(p.id)}
            >
              <img src={p.img} alt={p.name} />
              <div className="preset-overlay" />
              {activePreset === p.id && (
                <div className="preset-check">
                  <CheckCircle2 size={14} />
                </div>
              )}
              <div className="preset-glass-label">{p.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM ── */}
      {!generatedImage ? (
        <section id="form" className="form-section">
          <div style={{ textAlign: 'center' }}>
            <div className="sec-tag">ولّد تهنئتك</div>
            <h2 className="sec-h">ابدأ الآن مجاناً</h2>
            <p className="sec-sub">تجربتان مجانيتان · بدون بطاقة ائتمان</p>
          </div>
          <div className="form-card">
            {/* Upload */}
            {previewUrl ? (
              <div className="upload-preview">
                <img src={previewUrl} alt="preview" />
                <button className="upload-preview-remove" onClick={handleImageClear}>
                  <RotateCcw size={13} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="main-image-upload"
                className="upload-zone"
                style={{ cursor: 'pointer', display: 'block' }}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.75rem' }}>
                  <Upload size={36} strokeWidth={1.4} color="var(--blue-l)" />
                </div>
                <p>اسحب صورتك هنا أو انقر للرفع</p>
                <p className="hint">PNG, JPG حتى 10 ميجا</p>
                <input
                  ref={fileInputRef}
                  id="main-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, overflow: 'hidden' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }}
                />
              </label>
            )}
            {imageError && <p style={{ color: '#ef4444', fontSize: '.82rem', marginTop: '-.5rem', marginBottom: '1rem' }}>{imageError}</p>}

            {/* Name */}
            <label className="field-label" style={{ marginTop: '.5rem', display: 'block' }}>
              اسم المُهنَّأ <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              className="field-input"
              type="text"
              placeholder="مثال: أحمد محمد"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              maxLength={40}
            />
            {nameError && <p style={{ color: '#ef4444', fontSize: '.82rem', marginTop: '.25rem' }}>{nameError}</p>}

            {/* Active preset */}
            <div style={{ marginTop: '1.25rem', padding: '.75rem 1rem', background: 'var(--blue-xxl)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.88rem', color: 'var(--text-m)' }}>
              <Palette size={15} color="var(--blue)" />
              الأستايل المختار: <strong style={{ color: 'var(--blue)' }}>{PRESETS.find(p => p.id === activePreset)?.name}</strong>
            </div>

            {/* Attempts */}
            {!stats.premiumUnlocked && (
              <p style={{ textAlign: 'center', fontSize: '.82rem', color: 'var(--text-s)', marginTop: '1rem' }}>
                متبقي لك {stats.remainingFreeAttempts} {stats.remainingFreeAttempts === 1 ? 'تجربة مجانية' : 'تجارب مجانية'}
              </p>
            )}

            <button className="btn-submit" onClick={handleGenerate} disabled={isGenerating}>
              <span className="shimmer" />
              {isGenerating ? 'جارٍ التوليد...' : 'ولّد تهنئتي'}
            </button>
          </div>
        </section>
      ) : (
        /* ── RESULT ── */
        <section className="result-section">
          <div style={{ textAlign: 'center' }}>
            <div className="sec-tag">تهنئتك جاهزة</div>
            <h2 className="sec-h">عيد مبارك يا {name}</h2>
          </div>
          <div className="result-card">
            <img src={generatedImage} alt="Eid Greeting" className="result-img" />
            <div className="result-actions">
              <button className="btn-dl" onClick={handleDownload}>
                <Download size={16} /> تحميل
              </button>
              <button className="btn-share" onClick={handleShare}>
                <Share2 size={16} /> مشاركة
              </button>
              <button className="btn-retry" onClick={handleRetry}>
                <RotateCcw size={15} /> تهنئة جديدة
              </button>
            </div>
          </div>
        </section>
      )}


      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          {/* Brand */}
          <div>
            <img src="/Barq-Logo1.png" alt="برق ستديو" className="footer-brand-logo" />
            <p className="footer-brand-desc">
              منصة توليد تهنئة عيد فاخرة بالذكاء الاصطناعي — اصنع تهنئتك في ثوانٍ وأبهر أحبابك
            </p>
          </div>
          {/* Links */}
          <div>
            <p className="footer-col-title">روابط سريعة</p>
            <ul className="footer-links">
              <li><a href="#how">كيف يعمل</a></li>
              <li><a href="#presets">الأستايلات</a></li>
              <li><a href="#numbers">أرقامنا</a></li>
              <li><a href="#form">ابدأ الآن</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <p className="footer-col-title">تواصل معنا</p>
            <ul className="footer-links">
              <li>
                <a href="https://wa.me/96500000000" target="_blank" rel="noopener noreferrer">
                  واتساب
                </a>
              </li>
              <li>
                <a href="mailto:hello@barq-studio.com">
                  hello@barq-studio.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-copy">
            © {new Date().getFullYear()} برق ستديو · جميع الحقوق محفوظة
          </span>
          <a
            href="https://solimanx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-credit"
            title="solimanx.com"
          >
            <img
              src="/00000-0٤.png"
              alt="سليمان"
              className="footer-credit-logo"
            />
            <span className="footer-credit-text">by solimanx</span>
          </a>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} onSelectPlan={handleSelectPlan} />
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="loading-overlay">
          <div className="loader-orb-wrap">
            <div className="loader-ring" />
            <div className="loader-ring loader-ring-2" />
            <Wand2 size={32} strokeWidth={1.5} color="var(--blue)" />
          </div>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>جارٍ توليد تهنئتك...</p>
          <p key={loadingMsgIdx} style={{ fontSize: '.95rem', color: 'var(--blue-l)', margin: 0, animation: 'fadeMsg .4s ease' }}>
            {LOADING_MSGS[loadingMsgIdx]}
          </p>
          <div className="loader-progress-wrap">
            <div className="loader-bar" />
          </div>
        </div>
      )}
    </>
  );
}
