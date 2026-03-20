# Barq - Premium Eid Greeting Generator 🎨✨

A production-ready web application that generates personalized Eid greeting images using AI. Built with Next.js 14, featuring premium UI/UX, payment integration, and scalable architecture.

## 🌟 Features

- **AI-Powered Generation**: Create stunning Eid greeting cards with advanced AI image generation
- **Premium UI/UX**: Clean, elegant design with smooth animations using Framer Motion
- **Multi-Language Support**: Arabic and English name support with automatic detection
- **Free & Premium Tiers**: 2 free attempts, then upgrade via MyFatoorah payment gateway
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Secure Payments**: Integrated with MyFatoorah for secure transactions
- **State Management**: Persistent state using Zustand with localStorage
- **Image Upload**: Drag-and-drop with preview and validation
- **Download & Share**: Easy download and social sharing capabilities

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand with persistence middleware
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Payment**: MyFatoorah API integration

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- AI API key (e.g., Replicate, OpenAI DALL-E, Stable Diffusion)
- MyFatoorah account (for payment integration)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd barq

# Install dependencies
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# AI Image Generation
NEXT_PUBLIC_AI_API_URL=https://api.provider.com/v1
AI_API_KEY=your_actual_api_key_here

# MyFatoorah Payment
MYFATOORAH_API_KEY=your_mf_api_key
MYFATOORAH_SECRET_KEY=your_mf_secret
NEXT_PUBLIC_MYFATOORAH_MODE=test

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
barq/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/          # Image generation API route
│   │   │   └── payment/          # Payment webhook handler
│   │   ├── components/
│   │   │   ├── ImageUploader.tsx   # Drag & drop image upload
│   │   │   ├── NameInput.tsx      # Name input with validation
│   │   │   ├── GenerateButton.tsx  # Generate button with loading
│   │   │   ├── ResultPreview.tsx   # Result display with actions
│   │   │   └── PaymentModal.tsx   # Premium upgrade modal
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/
│   │   │   ├── ai/
│   │   │   │   └── promptBuilder.ts # AI prompt generation
│   │   │   ├── api/
│   │   │   │   └── imageGenerator.ts # API client wrapper
│   │   │   ├── payment/
│   │   │   │   └── myFatoorah.ts   # Payment gateway integration
│   │   │   └── store.ts           # Zustand state management
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript definitions
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx               # Main application page
│   └── ...
├── public/                        # Static assets
├── .env.local                     # Environment variables
├── .env.example                   # Environment template
└── README.md
```

## 🔧 Configuration

### AI API Provider

The application is designed to work with any AI image generation API. Update the following in `src/lib/api/imageGenerator.ts`:

- API endpoint in `NEXT_PUBLIC_AI_API_URL`
- Request/response format in `generateImage()` method

Popular providers:
- **Replicate**: Stable Diffusion, DALL-E models
- **OpenAI**: DALL-E 3
- **Stability AI**: Stable Diffusion XL
- **Midjourney**: Via third-party APIs

### Payment Integration

MyFatoorah integration requires:

1. Create account at [myfatoorah.com](https://myfatoorah.com)
2. Get API keys from dashboard
3. Configure webhook URL: `https://yourdomain.com/api/payment/webhook`
4. Update environment variables

### Pricing Tiers

Edit pricing in `src/components/PaymentModal.tsx`:

```typescript
const PRICING_TIERS: PricingTier[] = [
  { id: 'single', name: 'Single Use', price: 5, currency: 'KWD', ... },
  { id: 'daily', name: '24 Hours', price: 15, currency: 'KWD', ... },
  { id: 'monthly', name: '30 Days', price: 30, currency: 'KWD', ... },
];
```

## 🎨 Customization

### Branding

- **Primary Color**: Currently `#423099` (purple)
- **Logo**: Edit header in `src/app/page.tsx`
- **Typography**: Fonts configured in `src/app/layout.tsx`

### AI Prompts

Modify prompt templates in `src/lib/ai/promptBuilder.ts`:

- Style options (cinematic, artistic, minimalist, elegant)
- Cultural elements
- Quality modifiers

### Free Attempts Limit

Change in `src/lib/store.ts`:

```typescript
const MAX_FREE_ATTEMPTS = 2; // Adjust this value
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Add all variables from `.env.local` to Vercel project settings.

### Other Platforms

- **Netlify**: Configure build command `npm run build` and output directory `.next`
- **AWS**: Use AWS Amplify or Elastic Beanstalk
- **Docker**: Dockerfile can be created for containerized deployment

## 🔐 Security Considerations

- API keys are stored in environment variables (never in code)
- Rate limiting implemented on API routes
- Input validation on both client and server
- Secure payment processing via MyFatoorah
- Image size and type validation

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 API Endpoints

### POST /api/generate

Generate Eid greeting image.

**Request:**
```json
{
  "name": "Ahmed",
  "imageData": "base64_encoded_image",
  "language": "ar"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://...",
  "requestId": "..."
}
```

### POST /api/payment/webhook

MyFatoorah payment webhook handler.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- AI image generation providers
- MyFatoorah for payment gateway
- Next.js team for the amazing framework
- Framer Motion for beautiful animations

## 📞 Support

For support, email support@barq.com or visit our documentation.

---

Built with ❤️ for Eid celebrations