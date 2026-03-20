# Deployment Guide for Barq

This guide will help you deploy your Barq Eid Greeting Generator application to production.

## 🚀 Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Next.js applications.

#### Steps:

1. **Prepare for Deployment**

```bash
# Ensure all dependencies are installed
npm install

# Test build locally
npm run build
```

2. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/barq.git
git push -u origin main
```

3. **Deploy to Vercel**

- Go to [vercel.com](https://vercel.com) and sign up/login
- Click "Add New Project"
- Import your GitHub repository
- Configure environment variables (see below)
- Click "Deploy"

Vercel will automatically detect it's a Next.js app and configure everything.

#### Environment Variables in Vercel:

Go to Project Settings → Environment Variables and add:

```
NEXT_PUBLIC_AI_API_URL=https://your-ai-provider.com/v1
AI_API_KEY=your_actual_api_key
MYFATOORAH_API_KEY=your_mf_api_key
MYFATOORAH_SECRET_KEY=your_mf_secret_key
NEXT_PUBLIC_MYFATOORAH_MODE=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Option 2: Netlify

1. **Build Settings**

```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. **Environment Variables**

Add the same variables as Vercel in Netlify dashboard.

3. **Deploy**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: Docker

1. **Create Dockerfile**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

2. **Build and Run**

```bash
docker build -t barq .
docker run -p 3000:3000 barq
```

### Option 4: AWS Amplify

1. **Install Amplify CLI**

```bash
npm install -g @aws-amplify/cli
```

2. **Initialize and Deploy**

```bash
amplify init
amplify add hosting
amplify publish
```

## 🔧 Pre-Deployment Checklist

### 1. AI API Configuration

- [ ] AI API key obtained and configured
- [ ] API endpoint URL verified
- [ ] Tested image generation locally
- [ ] Request/response format validated

### 2. Payment Gateway Setup

- [ ] MyFatoorah account created
- [ ] API keys obtained
- [ ] Test mode configured
- [ ] Webhook URL configured: `https://yourdomain.com/api/payment/webhook`
- [ ] Payment flow tested

### 3. Security

- [ ] Environment variables set correctly
- [ ] `.env.local` not committed to git
- [ ] API keys are valid and active
- [ ] Rate limiting configured
- [ ] HTTPS enabled (production)

### 4. Performance

- [ ] Images optimized
- [ ] Caching configured
- [ ] CDN enabled (if using Vercel, automatic)
- [ ] Analytics set up

## 🌐 Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate

### Other Platforms

Follow platform-specific documentation for custom domain setup.

## 🔍 Post-Deployment Testing

### 1. Basic Functionality

- [ ] Homepage loads correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Navigation is smooth

### 2. Core Features

- [ ] Name input accepts text
- [ ] Image upload works (drag & drop + click)
- [ ] Generation button triggers API call
- [ ] Loading states display correctly
- [ ] Results appear after generation
- [ ] Download functionality works
- [ ] Share functionality works

### 3. Payment Integration

- [ ] Payment modal appears after 2 attempts
- [ ] Pricing tiers display correctly
- [ ] Payment initiation works
- [ ] MyFatoorah redirects properly
- [ ] Webhook receives callbacks
- [ ] Premium unlocks after payment

### 4. Error Handling

- [ ] Validation errors show correctly
- [ ] API errors are handled gracefully
- [ ] Network errors display user-friendly messages
- [ ] Payment errors are handled

### 5. Performance

- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Smooth animations

## 📊 Monitoring and Analytics

### Recommended Tools

- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: Add to `app/layout.tsx`
- **Sentry**: Error tracking
- **LogRocket**: User session recording

### Add Google Analytics

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
        </Script>
      </body>
    </html>
  )
}
```

## 🔒 Security Best Practices

### 1. API Key Protection

- Never commit `.env.local`
- Use different keys for development and production
- Rotate keys regularly
- Monitor API usage

### 2. Rate Limiting

Consider adding rate limiting:

```typescript
// middleware.ts or API route
import { NextResponse } from 'next/server'

const rateLimit = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip || 'anonymous'
  const now = Date.now()
  const windowStart = now - 60000 // 1 minute window
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, [])
  }
  
  const requests = rateLimit.get(ip)!.filter(t => t > windowStart)
  
  if (requests.length > 10) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  
  requests.push(now)
  return NextResponse.next()
}
```

### 3. Content Security Policy

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
          },
        ],
      },
    ]
  },
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📱 Mobile Optimization

### PWA Support

Add PWA capabilities for better mobile experience:

```bash
npm install next-pwa
```

Update `next.config.ts`:

```typescript
import withPWA from 'next-pwa'

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true
})
```

## 🎯 Production Optimization

### 1. Image Optimization

Next.js automatically optimizes images. Ensure you're using:

```tsx
<Image src={imageUrl} alt="..." width={1024} height={1024} />
```

### 2. Bundle Analysis

```bash
npm install @next/bundle-analyzer
```

Add to `next.config.ts`:

```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
```

### 3. Performance Monitoring

Set up:
- Vercel Speed Insights
- Web Vitals tracking
- Real User Monitoring (RUM)

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure they start with `NEXT_PUBLIC_` for client-side access
- Restart development server after adding new variables
- Check platform's environment variable settings

### Payment Webhook Not Receiving

- Verify webhook URL is publicly accessible
- Check MyFatoorah dashboard for error logs
- Ensure SSL is enabled
- Test with webhook testing tools

## 📞 Support

For deployment issues:
- Check platform documentation
- Review build logs
- Test locally first
- Contact platform support if needed

---

**Ready to deploy!** 🚀