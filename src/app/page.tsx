'use client';

import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from '@/lib/store';
import { imageGenerator } from '@/lib/api/imageGenerator';
import PaymentModal, { PricingTier } from '@/components/PaymentModal';

/* ── Presets data ── */
const PRESETS = [
  { id: 1, name: 'سينمائي فاخر',  icon: '🌙', img: '/templetes/Gemini_Generated_Image_64m1dc64m1dc64m1.png' },
  { id: 2, name: 'أنثوي ناعم',    icon: '🌸', img: '/templetes/Gemini_Generated_Image_aoh24raoh24raoh2.png' },
  { id: 3, name: 'عصري راقٍ',     icon: '✨', img: '/templetes/Gemini_Generated_Image_bjb5ovbjb5ovbjb5.png' },
  { id: 4, name: 'صباح العيد',    icon: '🌅', img: '/templetes/Gemini_Generated_Image_nz00j8nz00j8nz00.png' },
  { id: 5, name: 'فناء العيد',    icon: '🌺', img: '/templetes/Gemini_Generated_Image_pxnj80pxnj80pxnj.png' },
  { id: 6, name: 'مجلس دافئ',    icon: '🏮', img: '/templetes/Gemini_Generated_Image_py5xylpy5xylpy5x.png' },
];

/* ── Marquee items ── */
const TICKER_A = ['صنع تهنئتك الآن', 'عيد مبارك ✦', 'تهنئة فاخرة بالذكاء الاصطناعي', 'برق ستديو ⚡'];
const TICKER_B = ['تقبل الله طاعاتكم', 'كل عام وأنتم بخير', 'عيد الفطر المبارك', 'أجمل التهاني ✦'];

export default function Home() {
  const { user, isGenerating, generatedImage, setUser, setGenerating, setGeneratedImage, setError, incrementAttempt, getStats } = useAppStore();

  const [name, setName]                   = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]       = useState<string | null>(null);
  const [activePreset, setActivePreset]   = useState<number>(1);
  const [nameError, setNameError]         = useState('');
  const [imageError, setImageError]       = useState('');
  const [showPayment, setShowPayment]     = useState(false);
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const stats                             = getStats();

  /* init user */
  if (!user) {
    setUser({ id: crypto.randomUUID(), attemptsUsed: 0, isPremium: false });
  }

  const detectLanguage = (text: string): 'ar' | 'en' =>
    /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setImageError('');
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleImageClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleImageSelect(file);
  };

  const handleGenerate = async () => {
    let valid = true;
    if (!name.trim()) { setNameError('الرجاء إدخال الاسم'); valid = false; } else setNameError('');
    if (!selectedImage) { setImageError('الرجاء رفع صورة'); valid = false; } else setImageError('');
    if (!valid) return;

    if (stats.remainingFreeAttempts <= 0 && !stats.premiumUnlocked) {
      setShowPayment(true);
      return;
    }

    setGenerating(true);
    setError(null);
    try {
      const base64Image = await imageGenerator.fileToBase64(selectedImage!);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, imageData: base64Image, language: detectLanguage(name), preset: activePreset }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'فشل توليد الصورة');
      setGeneratedImage(data.imageUrl);
      incrementAttempt();
      toast.success('تم توليد التهنئة بنجاح! 🎉');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'حدث خطأ ما';
      setError(msg);
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `eid-greeting-${name}.png`;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
      toast.success('تم التحميل!');
    } catch { toast.error('فشل التحميل'); }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    if (navigator.share) {
      await navigator.share({ title: 'تهنئة العيد', text: `عيد مبارك من ${name}!`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ الرابط!');
    }
  };

  const handleRetry = () => {
    setGeneratedImage(null);
    setName('');
    setSelectedImage(null);
    setPreviewUrl(null);
    setNameError('');
    setImageError('');
  };

  const handleSelectPlan = async (tier: PricingTier) => {
    if (!user) return;
    try {
      toast.loading('جارٍ تهيئة الدفع...');
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: tier.price, currency: tier.currency,
          customerEmail: user.email || 'user@example.com',
          customerName: name || 'User', userId: user.id,
          language: detectLanguage(name),
        }),
      });
      const data = await response.json();
      if (data.success && data.paymentUrl) window.location.href = data.paymentUrl;
      else toast.error(data.error || 'فشل بدء عملية الدفع');
    } catch { toast.error('فشل بدء عملية الدفع'); }
    finally { toast.dismiss(); }
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="nav-wrap">
        <div className="nav-inner">
          <a href="#" className="nav-logo">⚡ برق ستديو</a>
          <ul className="nav-links">
            <li><a href="#how">كيف يعمل</a></li>
            <li><a href="#presets">الأستايلات</a></li>
            <li><a href="#numbers">أرقامنا</a></li>
            <li><a href="#form">ابدأ الآن</a></li>
            <li>
              <a
                href="https://wa.me/96500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-cta"
              >
                تواصل معنا
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero">
        <div className="hero-orb" />
        <div className="hero-orb-2" />
        <div className="hero-wrap">
          {/* Text */}
          <div>
            <div className="hero-badge">⚡ هدية العيد من برق ستديو</div>
            <h1 className="hero-h1">
              تهنئة عيد <span className="blue">فاخرة</span><br />
              بلمسة <span className="gold">ذهبية</span> شخصية
            </h1>
            <p className="hero-sub">
              ارفع صورتك، اختر الأستايل، وخلّي الذكاء الاصطناعي يصنع لك تهنئة عيد احترافية تبهر أحبابك
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}>
                ✦ ولّد تهنئتي الآن
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('presets')?.scrollIntoView({ behavior: 'smooth' })}>
                شوف الأستايلات
              </button>
            </div>
            <div className="hero-trust">
              <div className="trust-item"><span className="trust-icon">✓</span>+500 تهنئة</div>
              <div className="trust-div" />
              <div className="trust-item"><span className="trust-icon">⚡</span>48 ساعة</div>
              <div className="trust-div" />
              <div className="trust-item"><span className="trust-icon">★</span>97% رضا</div>
            </div>
          </div>

          {/* Cards */}
          <div style={{ position: 'relative' }}>
            <div className="hero-float-badge">+50 علامة تجارية ✦</div>
            <div className="hero-cards-wrap">
              {PRESETS.slice(0, 3).map((p, i) => (
                <div key={p.id} className="hcard">
                  <div className="hcard-inner">
                    <img src={p.img} alt={p.name} />
                    <div className="hcard-overlay" />
                    <div className="hcard-badge">{p.icon}</div>
                    <div className="hcard-label">{p.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-float-badge2">Powered by fal.ai FLUX Dev ✦</div>
          </div>
        </div>
      </section>

      {/* ── BRANDS STRIP ── */}
      <div className="brands-strip">
        <div className="brands-inner">
          {[
            { icon: '🤖', label: 'FLUX Dev' },
            { icon: '⚡', label: 'fal.ai' },
            { icon: '📧', label: 'Resend' },
            { icon: '💳', label: 'MyFatoorah' },
            { icon: '▲', label: 'Vercel' },
          ].map(b => (
            <div key={b.label} className="brand-item">
              <span className="brand-icon">{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="marquee-section">
        <div className="marquee-wrap">
          {/* Strip A - blue forward */}
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
          {/* Strip B - purple reverse */}
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
          <div className="sec-tag">⚙️ كيف يعمل</div>
          <h2 className="sec-h">أربع خطوات بسيطة</h2>
          <p className="sec-sub">من الصورة إلى تهنئة احترافية في دقائق</p>
        </div>
        <div className="how-grid">
          {[
            { num: '١', icon: '📸', title: 'ارفع صورتك', desc: 'ارفع صورة واضحة لك أو للشخص اللي تبي تهنّيه' },
            { num: '٢', icon: '🎨', title: 'اختر الأستايل', desc: 'اختار من بين 6 أستايلات فاخرة مصممة بعناية' },
            { num: '٣', icon: '✍️', title: 'أدخل الاسم', desc: 'اكتب اسم المُهنَّأ بالعربي أو الإنجليزي' },
            { num: '٤', icon: '✨', title: 'ولّد التهنئة', desc: 'الذكاء الاصطناعي يصنع تهنئتك الفاخرة في ثوانٍ' },
          ].map(step => (
            <div key={step.num} className="how-card">
              <div className="how-card-corner">{step.num}</div>
              <div className="how-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRESETS ── */}
      <section id="presets" className="presets-section">
        <div style={{ textAlign: 'center' }}>
          <div className="sec-tag">🎨 الأستايلات</div>
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
              <div className="preset-badge">{p.icon}</div>
              <div className="preset-check">✓</div>
              <div className="preset-content">
                <h4>{p.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM ── */}
      {!generatedImage ? (
        <section id="form" className="form-section">
          <div style={{ textAlign: 'center' }}>
            <div className="sec-tag">✦ ولّد تهنئتك</div>
            <h2 className="sec-h">ابدأ الآن مجاناً</h2>
            <p className="sec-sub">تجربتان مجانيتان · بدون بطاقة ائتمان</p>
          </div>

          <div className="form-card">
            {/* Upload */}
            {previewUrl ? (
              <div className="upload-preview">
                <img src={previewUrl} alt="preview" />
                <button className="upload-preview-remove" onClick={handleImageClear}>✕</button>
              </div>
            ) : (
              <div
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <span className="upload-zone-icon">📷</span>
                <p>اسحب صورتك هنا أو انقر للرفع</p>
                <p className="hint">PNG, JPG حتى 10 ميجا</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }}
                />
              </div>
            )}
            {imageError && <p style={{ color: '#ef4444', fontSize: '.82rem', marginTop: '-.75rem', marginBottom: '1rem' }}>{imageError}</p>}

            {/* Name */}
            <label className="field-label">
              اسم المُهنَّأ <span>*</span>
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

            {/* Preset chosen */}
            <div style={{ marginTop: '1.25rem', padding: '.75rem 1rem', background: 'var(--blue-xxl)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.88rem', color: 'var(--text-m)' }}>
              <span>{PRESETS.find(p => p.id === activePreset)?.icon}</span>
              <span>الأستايل المختار: <strong style={{ color: 'var(--blue)' }}>{PRESETS.find(p => p.id === activePreset)?.name}</strong></span>
            </div>

            {/* Attempts */}
            {!stats.premiumUnlocked && (
              <p style={{ textAlign: 'center', fontSize: '.82rem', color: 'var(--text-s)', marginTop: '1rem' }}>
                متبقي لك {stats.remainingFreeAttempts} {stats.remainingFreeAttempts === 1 ? 'تجربة مجانية' : 'تجارب مجانية'}
              </p>
            )}

            {/* Submit */}
            <button className="btn-submit" onClick={handleGenerate} disabled={isGenerating}>
              <span className="shimmer" />
              {isGenerating ? '⏳ جارٍ التوليد...' : '✦ ولّد تهنئتي ✦'}
            </button>
          </div>
        </section>
      ) : (
        /* ── RESULT ── */
        <section className="result-section">
          <div style={{ textAlign: 'center' }}>
            <div className="sec-tag">🎉 تهنئتك جاهزة!</div>
            <h2 className="sec-h">عيد مبارك يا {name}!</h2>
          </div>
          <div className="result-card">
            <img src={generatedImage} alt="Eid Greeting" className="result-img" />
            <div className="result-actions">
              <button className="btn-dl" onClick={handleDownload}>⬇️ تحميل</button>
              <button className="btn-share" onClick={handleShare}>↗️ مشاركة</button>
              <button className="btn-retry" onClick={handleRetry}>↺ تهنئة جديدة</button>
            </div>
          </div>
        </section>
      )}

      {/* ── NUMBERS ── */}
      <section id="numbers" className="numbers-section">
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div className="sec-tag">📊 أرقامنا</div>
          <h2 className="sec-h">أرقام تتحدث عن نفسها</h2>
        </div>
        <div className="numbers-grid">
          {[
            { val: '+500', label: 'تهنئة تم توليدها' },
            { val: '48h',  label: 'أقصى وقت للتسليم' },
            { val: '%97',  label: 'معدل الرضا' },
            { val: '+50',  label: 'علامة تجارية' },
          ].map(n => (
            <div key={n.val} className="number-card">
              <span className="number-val">{n.val}</span>
              <span className="number-label">{n.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--text)', color: 'rgba(255,255,255,.7)', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '.5rem' }}>⚡ برق ستديو</div>
          <p style={{ fontSize: '.85rem', marginBottom: '1.5rem' }}>تهنئة عيد فاخرة بالذكاء الاصطناعي</p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '.85rem', marginBottom: '2rem' }}>
            <a href="#how"     style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>كيف يعمل</a>
            <a href="#presets" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>الأستايلات</a>
            <a href="#numbers" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>أرقامنا</a>
            <a href="#form"    style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>ابدأ الآن</a>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '1.5rem', fontSize: '.78rem' }}>
            © {new Date().getFullYear()} برق ستديو · جميع الحقوق محفوظة
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSelectPlan={handleSelectPlan}
        />
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="loading-overlay">
          <div className="loader-orb-wrap">
            <div className="loader-ring" />
            <div className="loader-ring loader-ring-2" />
            <span className="loader-emoji">🌙</span>
          </div>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>
            جارٍ توليد تهنئتك...
          </p>
          <p style={{ fontSize: '.88rem', color: 'var(--text-m)', margin: 0 }}>
            الذكاء الاصطناعي يعمل بكل قوته ✨
          </p>
          <div className="loader-progress-wrap">
            <div className="loader-bar" />
          </div>
        </div>
      )}
    </>
  );
}
