import { fal } from '@fal-ai/client';

// fal-ai/nano-banana-2/edit — Gemini 3.1 Flash image editing, $0.08/image
const FAL_MODEL = 'fal-ai/nano-banana-2/edit';

// Only configure credentials if the key is actually available at runtime
// DO NOT call fal.config({ credentials: undefined }) — it clears auto-detection
if (process.env.FAL_KEY) {
  fal.config({ credentials: process.env.FAL_KEY });
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GenerateImageParams {
  prompt: string;
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
    const key = process.env.FAL_KEY;
    if (!key) {
      console.error('[fal.ai] FAL_KEY is not set in runtime environment');
      return { success: false, error: 'FAL_KEY not configured on server' };
    }

    if (!params.image && !params.imageUrl) {
      return { success: false, error: 'No image provided.' };
    }

    // ── Step 1: upload image to fal.ai storage → real https:// URL ──
    let hostedUrl: string;
    try {
      if (params.imageUrl && params.imageUrl.startsWith('http')) {
        hostedUrl = params.imageUrl;
      } else {
        const buffer = Buffer.from(params.image!, 'base64');
        const blob = new Blob([buffer], { type: params.imageType ?? 'image/jpeg' });
        hostedUrl = await fal.storage.upload(blob);
        console.log('[fal.ai] uploaded image:', hostedUrl);
      }
    } catch (uploadErr) {
      const msg = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
      console.error('[fal.ai] storage upload failed:', msg);
      // Fallback: try REST API directly with base64 data URL
      return this.generateViaRest(params, key);
    }

    // ── Step 2: call model via SDK ──
    try {
      const result = await fal.subscribe(FAL_MODEL, {
        input: {
          prompt:        params.prompt,
          image_urls:    [hostedUrl],
          aspect_ratio:  '3:4' as const,
          num_images:    1,
          output_format: 'jpeg' as const,
          resolution:    '1K' as const,
        } as never,
      }) as { data?: { images?: { url: string }[] }; requestId?: string };

      const imageUrl = result?.data?.images?.[0]?.url;
      if (!imageUrl) throw new Error('No image returned from fal.ai');

      return { success: true, imageUrl, requestId: result.requestId };

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = (err as any).body ?? (err as any).response ?? (err as any).cause;
      if (body) console.error('[fal.ai] SDK error body:', JSON.stringify(body));
      console.error('[fal.ai] SDK error:', msg);

      // Fallback: try REST API directly
      return this.generateViaRest(params, key);
    }
  }

  // ── Direct REST fallback (bypasses SDK entirely) ──
  private async generateViaRest(
    params: GenerateImageParams,
    key: string,
  ): Promise<GenerateImageResponse> {
    console.log('[fal.ai] trying direct REST fallback...');
    try {
      // Build image_urls: try data URL directly if we have base64
      const imageUrls: string[] = [];
      if (params.imageUrl && params.imageUrl.startsWith('http')) {
        imageUrls.push(params.imageUrl);
      } else if (params.image) {
        const mime = params.imageType ?? 'image/jpeg';
        imageUrls.push(`data:${mime};base64,${params.image}`);
      }

      const res = await fetch(`https://fal.run/${FAL_MODEL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt:        params.prompt,
          image_urls:    imageUrls,
          aspect_ratio:  '3:4',
          num_images:    1,
          output_format: 'jpeg',
          resolution:    '1K',
        }),
      });

      const json = await res.json() as { images?: { url: string }[]; request_id?: string; detail?: string };

      if (!res.ok) {
        const detail = json.detail ?? `HTTP ${res.status}`;
        console.error('[fal.ai] REST error:', detail);
        return { success: false, error: detail };
      }

      const imageUrl = json.images?.[0]?.url;
      if (!imageUrl) throw new Error('No image in REST response');

      console.log('[fal.ai] REST success:', imageUrl);
      return { success: true, imageUrl, requestId: json.request_id };

    } catch (restErr) {
      const msg = restErr instanceof Error ? restErr.message : String(restErr);
      console.error('[fal.ai] REST fallback failed:', msg);
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
