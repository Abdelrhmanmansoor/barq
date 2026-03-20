import { fal } from '@fal-ai/client';

// ─── Model ID ────────────────────────────────────────────────────────────────
// fal.ai model for face-identity-preserving portrait generation.
// FLUX Kontext: takes an input image + text prompt, preserves the person's
// identity while transforming the scene/style — ideal for Eid greeting cards.
const FAL_MODEL = 'fal-ai/flux-pro/v1/kontext';

fal.config({ credentials: process.env.FAL_KEY });

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GenerateImageParams {
  prompt: string;
  negative_prompt?: string;
  image?: string;        // base64 string (no data: prefix) — the uploaded face photo
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
      // Build the image reference: prefer imageUrl, fall back to base64
      const imageDataUrl = params.imageUrl
        ? params.imageUrl
        : params.image
          ? `data:image/jpeg;base64,${params.image}`
          : null;

      if (!imageDataUrl) {
        return { success: false, error: 'No image provided — an uploaded photo is required.' };
      }

      // FLUX Kontext input shape
      const input = {
        prompt:               params.prompt,
        image_url:            imageDataUrl,   // the uploaded face photo (identity reference)
        guidance_scale:       3.5,
        num_inference_steps:  28,
        num_images:           1,
        output_format:        'jpeg',
        // image_size can be set here if needed e.g. { width: 768, height: 1024 }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await fal.subscribe(FAL_MODEL as any, { input: input as any }) as {
        data?: { images?: { url: string }[] };
        requestId?: string;
      };

      const imageUrl = result?.data?.images?.[0]?.url;
      if (!imageUrl) throw new Error('No image returned from fal.ai');

      return { success: true, imageUrl, requestId: result.requestId };

    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[fal.ai]', msg);
      return { success: false, error: msg };
    }
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
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
