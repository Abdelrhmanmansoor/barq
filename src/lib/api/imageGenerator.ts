import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Image Generation API Client
 * Handles communication with AI image generation services
 */

export interface GenerateImageParams {
  prompt: string;
  negative_prompt: string;
  image?: string; // Base64 encoded image
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
  seed?: number;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  requestId?: string;
}

class ImageGeneratorClient {
  private client: AxiosInstance;
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.provider.com/v1';

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 60000, // 60 seconds timeout for image generation
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('Image generation API error:', error);
        
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data as any;
          
          if (status === 401) {
            throw new Error('Invalid API key');
          } else if (status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else if (status === 500) {
            throw new Error('Server error. Please try again.');
          }
          
          throw new Error(data?.error || 'Image generation failed');
        } else if (error.request) {
          // Request made but no response
          throw new Error('Network error. Please check your connection.');
        }
        
        throw new Error('An unexpected error occurred');
      }
    );
  }

  /**
   * Generate an image using the AI API
   */
  async generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
    try {
      console.log('Generating image with params:', { ...params, image: params.image ? '[BASE64]' : undefined });

      // Example API call structure (adjust based on your actual AI provider)
      const response = await this.client.post('/generate', {
        prompt: params.prompt,
        negative_prompt: params.negative_prompt,
        image: params.image, // Include uploaded image if provided
        width: params.width || 1024,
        height: params.height || 1024,
        steps: params.steps || 30,
        guidance_scale: params.guidance_scale || 7.5,
        seed: params.seed || -1,
      });

      // Adjust response handling based on your AI provider's response format
      if (response.data && response.data.image_url) {
        return {
          success: true,
          imageUrl: response.data.image_url,
          requestId: response.data.request_id,
        };
      }

      throw new Error('Invalid response from AI API');

    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      }
      
      return {
        success: false,
        error: 'Unknown error occurred during image generation',
      };
    }
  }

  /**
   * Convert file to base64 string
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix if present
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Validate image file
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image size must be less than 5MB',
      };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, and WEBP images are allowed',
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const imageGenerator = new ImageGeneratorClient();