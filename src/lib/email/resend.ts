import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  /**
   * Send welcome email after registration
   */
  async sendWelcomeEmail(email: string, name: string) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #423099 0%, #6B46C1 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #423099; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Welcome to Barq!</h1>
              </div>
              <div class="content">
                <p>Hello ${name},</p>
                <p>Welcome to Barq - Premium Eid Greeting Generator!</p>
                <p>Get ready to create beautiful, personalized Eid greeting cards with our AI-powered platform.</p>
                <p>You have <strong>2 free generations</strong> to try our service.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Create Your First Greeting</a>
                <p style="margin-top: 30px;">If you need any help, feel free to contact us.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Barq. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@barq-studio.com',
        to: email,
        subject: 'Welcome to Barq! ✨',
        html,
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error: 'Failed to send email' };
    }
  },

  /**
   * Send image generation success email
   */
  async sendImageGeneratedEmail(email: string, name: string, imageUrl: string) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #423099 0%, #6B46C1 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .image-preview { max-width: 100%; border-radius: 10px; margin: 20px 0; }
              .button { display: inline-block; background: #423099; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Your Eid Greeting is Ready!</h1>
              </div>
              <div class="content">
                <p>Hello ${name},</p>
                <p>Your beautiful Eid greeting card has been generated successfully!</p>
                <img src="${imageUrl}" alt="Eid Greeting" class="image-preview" />
                <p>You can now:</p>
                <ul>
                  <li>📥 Download the image</li>
                  <li>📤 Share it on social media</li>
                  <li>🖨️ Print it as a card</li>
                </ul>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Create More Greetings</a>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Barq. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@barq-studio.com',
        to: email,
        subject: 'Your Eid Greeting is Ready! 🎉',
        html,
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to send image email:', error);
      return { success: false, error: 'Failed to send email' };
    }
  },

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmationEmail(email: string, name: string, plan: string, amount: number) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #423099 0%, #6B46C1 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
              .button { display: inline-block; background: #423099; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💳 Payment Successful!</h1>
              </div>
              <div class="content">
                <div class="success">
                  <p>✅ Your ${plan} plan has been activated!</p>
                </div>
                <p>Hello ${name},</p>
                <p>Thank you for your payment of <strong>${amount} KWD</strong></p>
                <p>You now have access to unlimited Eid greeting generations!</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Start Creating Greetings</a>
                <p style="margin-top: 30px;">Your payment details have been recorded. You'll receive a receipt shortly.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Barq. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@barq-studio.com',
        to: email,
        subject: 'Payment Confirmation - Barq Premium 💳',
        html,
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to send payment email:', error);
      return { success: false, error: 'Failed to send email' };
    }
  },

  /**
   * Send admin notification for new payment
   */
  async sendAdminPaymentNotification(email: string, name: string, plan: string, amount: number) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #423099 0%, #6B46C1 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .info { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💰 New Payment Received</h1>
              </div>
              <div class="content">
                <p>A new payment has been processed on Barq!</p>
                <div class="info">
                  <p><strong>Customer:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Plan:</strong> ${plan}</p>
                  <p><strong>Amount:</strong> ${amount} KWD</p>
                  <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@barq-studio.com',
        to: process.env.ADMIN_EMAIL || 'admin@barq-studio.com',
        subject: `New Payment: ${plan} - ${amount} KWD`,
        html,
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      return { success: false, error: 'Failed to send email' };
    }
  },
};