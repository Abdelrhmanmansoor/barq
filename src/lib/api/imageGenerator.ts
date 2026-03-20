import { fal } from '@fal-ai/client';
import type { NanoBananaProEditInput } from '@fal-ai/client';

// fal-ai/nano-banana-pro/edit — Gemini Flash image editing, supports resolution param
const FAL_MODEL = 'fal-ai/nano-banana-pro/edit';

fal.config({ credentials: process.env.FAL_KEY });

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GenerateImageParams {
  prompt: string;
  negative_prompt?: string;
  image?: string;        // base64 string (no data: prefix) — the uploaded face photo
  imageType?: string;    // MIME type of the uploaded image (e.g. 'image/jpeg')
  imageUrl?: string;     // OR a hosted URL if already available
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  requestId?: string;
}

// ─── Client ──────────────────────────────────────────────────────────────────

class ImageGeneratorClient {

  async generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
    try {
      if (!params.image && !params.imageUrl) {
        return { success: false, error: 'No image provided.' };
      }

      // Step 1: upload image to fal.ai storage → get a real https:// URL
      let hostedUrl: string;
      if (params.imageUrl && params.imageUrl.startsWith('http')) {
        hostedUrl = params.imageUrl;
      } else {
        const buffer = Buffer.from(params.image!, 'base64');
        const blob = new Blob([buffer], { type: params.imageType ?? 'image/jpeg' });
        hostedUrl = await fal.storage.upload(blob);
      }
      // Step 2: call the model with correct typed input
      const falInput: NanoBananaProEditInput = {
        prompt:        params.prompt,
        image_urls:    [hostedUrl],
        aspect_ratio:  '3:4',
        num_images:    1,
        output_format: 'jpeg',
        resolution:    '1K',
      };

      const result = await fal.subscribe(FAL_MODEL, { input: falInput }) as {
        data?: { images?: { url: string }[] }; requestId?: string;
      };

      const imageUrl = result?.data?.images?.[0]?.url;
      if (!imageUrl) throw new Error('No image returned from fal.ai');

      return { success: true, imageUrl, requestId: result.requestId };

    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[fal.ai error]', msg);
      return { success: false, error: msg };
    }
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl.split(',')[1]);
      };
      img.onerror = reject;
      img.src = objectUrl;
    });
  }

  validateImageFile(file: File): { valid: boolean; error?: string } {
    if (file.size > 10 * 1024 * 1024)
      return { valid: false, error: 'الصورة يجب أن تكون أقل من 10MB' };
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type))
      return { valid: false, error: 'JPEG أو PNG أو WEBP فقط' };
    return { valid: true };
  }
}

export const imageGenerator = new ImageGeneratorClient();
