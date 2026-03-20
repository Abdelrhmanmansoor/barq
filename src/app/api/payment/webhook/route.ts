import { NextRequest, NextResponse } from 'next/server';
import { myFatoorah } from '@/lib/payment/myFatoorah';
import { useAppStore } from '@/lib/store';

/**
 * MyFatoorah Payment Webhook Handler
 * POST /api/payment/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // MyFatoorah sends different payloads based on success/failure
    // Key fields: PaymentId, InvoiceId, InvoiceStatus, etc.
    const { PaymentId, InvoiceId, InvoiceStatus, Error } = body;

    console.log('Payment webhook received:', { PaymentId, InvoiceId, InvoiceStatus });

    if (!PaymentId || !InvoiceId) {
      return NextResponse.json(
        { success: false, error: 'Missing payment information' },
        { status: 400 }
      );
    }

    // Verify payment status with MyFatoorah
    const verification = await myFatoorah.verifyPayment({
      paymentId: PaymentId,
      invoiceId: InvoiceId,
    });

    if (!verification.success) {
      console.error('Payment verification failed:', verification.error);
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 500 }
      );
    }

    // Check if payment was successful
    if (verification.paymentStatus === 'Paid') {
      // Here you would typically:
      // 1. Update user's premium status in your database
      // 2. Store transaction details
      // 3. Send confirmation email
      
      console.log('Payment successful for invoice:', InvoiceId);
      
      // For now, we'll return success and let the frontend handle the unlock
      return NextResponse.json({
        success: true,
        paymentStatus: 'Paid',
        message: 'Payment processed successfully',
      });
    }

    // Payment failed or pending
    return NextResponse.json({
      success: true,
      paymentStatus: verification.paymentStatus,
      message: 'Payment not completed',
    });

  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}