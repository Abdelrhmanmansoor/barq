// Core type definitions for the Eid Greeting Generator

export interface User {
  id: string;
  attemptsUsed: number;
  isPremium: boolean;
  email?: string;
}

export interface GenerationRequest {
  name: string;
  image: File | string;
  language?: 'ar' | 'en';
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  requestId?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  userId: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  paymentId?: string;
  error?: string;
}

export interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
}

export interface GenerationStats {
  totalAttempts: number;
  remainingFreeAttempts: number;
  premiumUnlocked: boolean;
}