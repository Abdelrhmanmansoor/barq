import { fal } from '@fal-ai/client';

export interface GenerateImageParams {
  prompt: string;
  negative_prompt: string;
  image?: string; // Base64 encoded image (without data: prefix)
  width?: number;
  height?: number;
  style?: string;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  requestId?: string;
}

fal.config({ credentials: process.env.FAL_KEY });

class ImageGeneratorClient {

  async generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
    try {
      const imageDataUrl = params.image
        ? `data:image/jpeg;base64,${params.image}`
        : undefined;

      // Use image-to-image if a reference photo is provided, else text-to-image
      const modelId = imageDataUrl
        ? 'fal-ai/flux/dev/image-to-image'
        : 'fal-ai/flux/dev';

      const input: Record<string, unknown> = {
        prompt: params.prompt,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: 'jpeg',
      };

      if (imageDataUrl) {
        input.image_url = imageDataUrl;
        input.strength = 0.82; // how much to change the original face
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await fal.subscribe(modelId as any, { input: input as any }) as {
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

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
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
