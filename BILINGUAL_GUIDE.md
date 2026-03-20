# Bilingual Implementation Guide - Barq

## 🌐 Overview

Barq now supports full Arabic (RTL) and English (LTR) language switching. Users can seamlessly switch between languages with automatic text direction updates.

## ✨ Features

### 1. Language Context
- **Location:** `src/lib/languageContext.tsx`
- **Features:**
  - Global language state management
  - Automatic RTL/LTR switching
  - LocalStorage persistence
  - React Context API

### 2. Translation System
- **Location:** `src/lib/i18n.ts`
- **Features:**
  - Centralized translation keys
  - Easy to add new languages
  - Type-safe translations
  - Support for nested keys

### 3. Language Switcher
- **Location:** Footer component
- **Features:**
  - Toggle between Arabic and English
  - Visual feedback for active language
  - Instant language switching

## 📝 How to Use

### For Developers

#### 1. Adding New Translations

Edit `src/lib/i18n.ts`:

```typescript
export const translations = {
  ar: {
    // Add new Arabic translations
    newKey: 'الترجمة العربية',
  },
  en: {
    // Add English translations
    newKey: 'English Translation',
  },
};
```

#### 2. Using Translations in Components

```typescript
import { useLanguage } from '@/lib/languageContext';
import { t } from '@/lib/i18n';

function MyComponent() {
  const { language } = useLanguage();
  
  return (
    <div>
      <h1>{t(language, 'newKey')}</h1>
      <p>{t(language, 'section.subtitle')}</p>
    </div>
  );
}
```

#### 3. Accessing Language Context

```typescript
import { useLanguage } from '@/lib/languageContext';

function MyComponent() {
  const { language, setLanguage, dir } = useLanguage();
  
  // language: 'ar' | 'en'
  // setLanguage: (lang: Language) => void
  // dir: 'ltr' | 'rtl'
  
  return <div dir={dir}>...</div>;
}
```

### For Users

#### Switching Language

Users can switch languages in two ways:

1. **Footer Language Switcher**
   - Scroll to the bottom of any page
   - Click "العربية" or "English" button
   - Language changes instantly

2. **Programmatic Switching**
   ```typescript
   const { setLanguage } = useLanguage();
   setLanguage('ar'); // Switch to Arabic
   setLanguage('en'); // Switch to English
   ```

## 🎨 RTL/LTR Support

### Automatic Direction Switching

The system automatically handles:
- Text direction (`dir="rtl"` or `dir="ltr"`)
- Layout mirroring for RTL
- Proper spacing and alignment

### Styling for RTL

Tailwind CSS automatically handles RTL when `dir` is set on the HTML element:

```html
<html dir="rtl"> {/* Arabic */}
<html dir="ltr"> {/* English */}
```

### RTL-Specific Styling

If you need RTL-specific styles:

```typescript
import { isRTL } from '@/lib/i18n';

const isRTL = isRTL(language);

// Apply conditional classes
<div className={isRTL ? 'ml-4' : 'mr-4'}>
  Content
</div>
```

## 📋 Translation Keys Structure

### Current Keys

```typescript
// Navigation
nav.home, nav.about, nav.pricing, nav.gallery, nav.contact

// Home
home.heroTitle, home.heroSubtitle, home.uploadPhoto, home.enterName, home.generate

// About
about.title, about.subtitle, about.mission, about.features, about.story, about.ready

// Pricing
pricing.title, pricing.subtitle, pricing.free, pricing.daily, pricing.monthly, 
pricing.getStarted, pricing.choosePlan, pricing.popular

// Footer
footer.company, footer.product, footer.support, footer.legal, 
footer.rights, footer.securePayment
```

### Adding New Sections

1. Add translation keys to `src/lib/i18n.ts`
2. Update components to use the new keys
3. Test both languages

## 🔧 Technical Details

### Language Context Flow

```
Layout.tsx
  ├── LanguageProvider
  │     ├── Navigation (uses useLanguage)
  │     ├── Footer (uses useLanguage)
  │     └── Pages (use useLanguage)
  └── Children
```

### State Management

- **Storage:** LocalStorage (`language` key)
- **Default:** Arabic (`'ar'`)
- **Persistence:** Survives page refreshes
- **Type Safety:** TypeScript for all language operations

### DOM Updates

When language changes:
1. Context updates language state
2. `setLanguage` updates localStorage
3. HTML `dir` attribute updates
4. `lang` attribute updates
5. Components re-render with new language

## 🚀 Best Practices

### 1. Always Use Translation Keys

❌ **Don't:**
```typescript
<h1>Welcome to Barq</h1>
```

✅ **Do:**
```typescript
<h1>{t(language, 'home.heroTitle')}</h1>
```

### 2. Group Related Keys

```typescript
good: {
  title: '...',
  subtitle: '...',
  description: '...',
}
```

### 3. Use Descriptive Key Names

```typescript
// Good
contact.form.namePlaceholder

// Avoid
contact.name
contact.input1
```

### 4. Test Both Languages

Always test:
- Arabic text displays correctly
- English text displays correctly
- Layout works for both RTL and LTR
- Navigation works in both directions

### 5. Handle Missing Translations

The `t()` function falls back to the key name if translation is missing:

```typescript
{t(language, 'missing.key')}
// Returns: 'missing.key' if not found
```

## 📱 Mobile Responsiveness

The bilingual system works seamlessly on:
- Desktop browsers
- Mobile devices
- Tablets
- All screen sizes

## 🌍 Adding New Languages

To add a new language (e.g., French):

### 1. Update Language Type

```typescript
// src/lib/i18n.ts
export type Language = 'ar' | 'en' | 'fr';
```

### 2. Add Translations

```typescript
export const translations = {
  ar: { /* ... */ },
  en: { /* ... */ },
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      // ...
    },
    // ...
  },
};
```

### 3. Update Language Switcher

```typescript
// src/components/Footer.tsx
<button onClick={() => setLanguage('fr')}>Français</button>
```

### 4. Update RTL Detection

```typescript
// src/lib/i18n.ts
export function isRTL(lang: Language): boolean {
  return lang === 'ar' || lang === 'he'; // Add other RTL languages
}
```

## 🐛 Troubleshooting

### Language Not Switching

**Problem:** Clicking language buttons doesn't change language

**Solution:**
1. Check if LanguageProvider wraps the app
2. Verify useLanguage hook is being used
3. Check browser console for errors

### Text Direction Wrong

**Problem:** Arabic displays LTR instead of RTL

**Solution:**
1. Ensure `dir` attribute is set on HTML element
2. Check if `isRTL()` returns correct value
3. Verify LanguageProvider is initialized

### Translations Missing

**Problem:** Shows key names instead of translations

**Solution:**
1. Check if key exists in both ar and en
2. Verify key spelling matches exactly
3. Check for typos in translation object

### LocalStorage Issues

**Problem:** Language resets on refresh

**Solution:**
1. Check if LocalStorage is enabled
2. Verify localStorage.setItem is called
3. Check browser privacy settings

## 📊 Performance

The bilingual system is optimized:
- **Minimal Re-renders:** Only components using translations re-render
- **Efficient State:** React Context prevents prop drilling
- **Fast Switching:** Language change is instant
- **Small Bundle:** Translation strings are text, not code

## 🔐 Security

- No user data is stored
- Language preference is local only
- No server-side language tracking
- Privacy-respecting design

## 📚 Additional Resources

- [Next.js i18n Docs](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Tailwind RTL Plugin](https://tailwindcss.com/docs/configuration#rtl-support)
- [React Context API](https://react.dev/reference/react/useContext)
- [MDN: dir Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)

## ✅ Checklist for New Pages

When creating a new page:

- [ ] Add translation keys to `src/lib/i18n.ts`
- [ ] Import `useLanguage` and `t` functions
- [ ] Use translation keys for all text
- [ ] Test in Arabic (RTL)
- [ ] Test in English (LTR)
- [ ] Verify mobile responsiveness
- [ ] Check text alignment
- [ ] Ensure navigation works

## 🎯 Summary

Barq's bilingual system provides:
- ✅ Seamless language switching
- ✅ Automatic RTL/LTR support
- ✅ Persistent language preference
- ✅ Type-safe translations
- ✅ Developer-friendly API
- ✅ Excellent user experience

For questions or issues, refer to the main documentation or create an issue.

---

Built with ❤️ for a global audience