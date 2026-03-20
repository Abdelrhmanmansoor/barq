import axios, { AxiosInstance } from 'axios';

/**
 * MyFatoorah Payment Gateway Integration
 * Handles payment processing for premium features
 */

export interface PaymentInitRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  userId: string;
  language?: 'en' | 'ar';
}

export interface PaymentInitResponse {
  success: boolean;
  paymentUrl?: string;
  invoiceId?: string;
  error?: string;
}

export interface PaymentVerifyRequest {
  paymentId: string;
  invoiceId: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Cancelled';
  error?: string;
}

class MyFatoorahClient {
  private client: AxiosInstance;
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.MYFATOORAH_API_KEY || '';
    this.apiUrl = process.env.NEXT_PUBLIC_MYFATOORAH_MODE === 'test'
      ? 'https://apitest.myfatoorah.com/v2'
      : 'https://api.myfatoorah.com/v2';

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
  }

  /**
   * Initialize a payment session
   */
  async initiatePayment(request: PaymentInitRequest): Promise<PaymentInitResponse> {
    try {
      console.log('Initiating payment for user:', request.userId);

      // MyFatoorah payment initiation
      const response = await this.client.post('/SendPayment', {
        InvoiceValue: request.amount,
        CurrencyIso: request.currency,
        DisplayCurrencyIso: request.currency,
        CustomerEmail: request.customerEmail,
        CustomerName: request.customerName,
        CustomerReference: request.userId,
        Language: request.language || 'en',
        CallBackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
        ErrorUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
        NotificationOption: 'Lnk', // Send link via email
      });

      if (response.data && response.data.IsSuccess) {
        return {
          success: true,
          paymentUrl: response.data.Data.InvoiceURL,
          invoiceId: response.data.Data.InvoiceId,
        };
      }

      return {
        success: false,
        error: response.data?.ErrorMessage || 'Failed to initiate payment',
      };

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      return {
        success: false,
        error: error.response?.data?.ErrorMessage || 'Payment initiation failed',
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(request: PaymentVerifyRequest): Promise<PaymentVerifyResponse> {
    try {
      console.log('Verifying payment:', request.invoiceId);

      const response = await this.client.post('/GetPaymentStatus', {
        Key: request.invoiceId,
        KeyType: 'InvoiceId',
      });

      if (response.data && response.data.IsSuccess) {
        const invoiceStatus = response.data.Data.InvoiceStatus;
        
        return {
          success: true,
          paymentStatus: invoiceStatus,
        };
      }

      return {
        success: false,
        paymentStatus: 'Failed',
        error: response.data?.ErrorMessage || 'Failed to verify payment',
      };

    } catch (error: any) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        paymentStatus: 'Failed',
        error: error.response?.data?.ErrorMessage || 'Payment verification failed',
      };
    }
  }

  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<any[]> {
    try {
      const response = await this.client.post('/InitiateSession', {
        CustomerIdentifier: process.env.MYFATOORAH_CUSTOMER_IDENTIFIER || '',
      });

      if (response.data && response.data.IsSuccess) {
        return response.data.Data.PaymentMethods || [];
      }

      return [];

    } catch (error) {
      console.error('Failed to get payment methods:', error);
      return [];
    }
  }
}

// Export singleton instance
export const myFatoorah = new MyFatoorahClient();