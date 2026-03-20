# Resend Email Integration Guide

This guide explains how to set up and use the Resend email service in Barq.

## 📧 What is Resend?

Resend is a modern email API that makes it easy to send transactional emails from your application. It's perfect for sending:
- Welcome emails
- Image generation notifications
- Payment confirmations
- Admin notifications

## 🔧 Setup Instructions

### 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Create an account
3. Navigate to API Keys
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@barq-studio.com
ADMIN_EMAIL=admin@barq-studio.com
```

### 3. Verify Your Domain

1. In Resend dashboard, go to Domains
2. Add your domain (e.g., barq-studio.com)
3. Add the DNS records provided by Resend
4. Wait for DNS verification (usually takes a few minutes to hours)

## 📧 Available Email Functions

### 1. Welcome Email

Send a welcome email when a user signs up:

```typescript
import { emailService } from '@/lib/email/resend';

await emailService.sendWelcomeEmail('user@example.com', 'John Doe');
```

**Features:**
- Branded header with gradient
- Welcome message
- Free trial information (2 free generations)
- Call-to-action button

### 2. Image Generated Email

Send email when a greeting is generated:

```typescript
await emailService.sendImageGeneratedEmail(
  'user@example.com',
  'John Doe',
  'https://example.com/greeting.jpg'
);
```

**Features:**
- Success notification
- Image preview
- Download and sharing options
- Call-to-action to create more

### 3. Payment Confirmation Email

Send email after successful payment:

```typescript
await emailService.sendPaymentConfirmationEmail(
  'user@example.com',
  'John Doe',
  '24 Hours',
  15 // Amount in KWD
);
```

**Features:**
- Payment success notification
- Plan details
- Thank you message
- Amount confirmation

### 4. Admin Payment Notification

Send notification to admin when payment is received:

```typescript
await emailService.sendAdminPaymentNotification(
  'user@example.com',
  'John Doe',
  '24 Hours',
  15 // Amount in KWD
);
```

**Features:**
- Customer information
- Payment details
- Timestamp
- Amount in KWD

## 🔌 Integration Points

### 1. Image Generation API

The generate API now supports email notifications:

```typescript
// In your frontend, include email in the request:
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    imageData: 'base64...',
    email: 'user@example.com',
    sendEmail: true // Set to true to send email
  })
});
```

### 2. Payment Webhook

Update your payment webhook to send emails:

```typescript
// src/app/api/payment/webhook/route.ts
import { emailService } from '@/lib/email/resend';

export async function POST(request: NextRequest) {
  // Process payment
  
  // Send confirmation to user
  await emailService.sendPaymentConfirmationEmail(
    email,
    name,
    plan,
    amount
  );
  
  // Send notification to admin
  await emailService.sendAdminPaymentNotification(
    email,
    name,
    plan,
    amount
  );
  
  return NextResponse.json({ success: true });
}
```

### 3. User Registration

Send welcome email after signup:

```typescript
// src/app/api/auth/signup/route.ts
await emailService.sendWelcomeEmail(email, name);
```

## 🎨 Customizing Email Templates

All email templates are in `src/lib/email/resend.ts`. You can customize:

### Colors

Currently using:
- Primary: `#423099` (Purple)
- Gradient: `linear-gradient(135deg, #423099 0%, #6B46C1 100%)`

To change, update the `style` tags in the HTML templates.

### Logo

Add your logo by modifying the header section:

```html
<div class="header">
  <h1>✨ Welcome to Barq!</h1>
</div>
```

Replace with:

```html
<div class="header">
  <img src="https://barq-studio.com/logo.png" alt="Barq Logo" class="logo" />
</div>
```

And add CSS:

```css
.logo {
  max-width: 200px;
  height: auto;
  margin-bottom: 20px;
}
```

### Content

Simply update the text in the HTML templates. All strings are plain HTML.

## 📊 Email Analytics

Resend provides detailed analytics:

1. Go to Resend Dashboard
2. Navigate to Emails
3. View:
   - Delivery rate
   - Open rate
   - Click rate
   - Bounce rate
   - Spam reports

## 🔒 Security Best Practices

1. **Never commit API keys** to git
2. **Use environment variables** for all sensitive data
3. **Validate email addresses** before sending
4. **Rate limit** email sends to prevent abuse
5. **Handle errors gracefully** - don't fail the entire request if email fails

## 🧪 Testing Emails

### Test Mode

You can test without sending real emails:

```typescript
// In development, log email content instead of sending
if (process.env.NODE_ENV === 'development') {
  console.log('Email would be sent:', { to, subject, html });
} else {
  await resend.emails.send({ ... });
}
```

### Test Email

Send a test email from Resend dashboard:
1. Go to API Keys
2. Click "Send Test Email"
3. Enter your email address
4. Check your inbox

## 📈 Scaling

Resend handles high volume well:

- **Free Tier**: 3,000 emails/month
- **Pro Tier**: 50,000 emails/month ($20)
- **Enterprise**: Unlimited

Monitor your usage in the dashboard.

## 🆘 Troubleshooting

### Email not sending

1. Check API key is correct
2. Verify domain is authenticated
3. Check rate limits
4. Review error logs

### Emails going to spam

1. Verify DNS records (SPF, DKIM, DMARC)
2. Check email content quality
3. Ensure you're not sending too quickly
4. Verify your domain reputation

### Images not showing

1. Use absolute URLs (not relative)
2. Ensure images are publicly accessible
3. Check image file sizes (keep under 5MB)
4. Use proper image formats (JPG, PNG)

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Best Practices](https://resend.com/docs/guides/best-practices)
- [Domain Setup Guide](https://resend.com/docs/guides/setup-your-domain)

## 💡 Tips

1. **Keep emails short** - Users scan quickly
2. **Use clear CTAs** - What should they do next?
3. **Mobile-friendly** - Test on mobile devices
4. **Personalize** - Use recipient's name when possible
5. **Test thoroughly** - Before sending to production

## 🎯 Next Steps

1. ✅ Set up Resend account
2. ✅ Configure environment variables
3. ✅ Verify your domain
4. ✅ Test email sending
5. ✅ Customize templates
6. ✅ Monitor analytics
7. ✅ Optimize based on data

---

Need help? Check the [Resend Documentation](https://resend.com/docs) or create an issue.