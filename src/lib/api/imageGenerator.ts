// Direct REST integration with fal.ai — no SDK complexity
// Endpoint: https://fal.run/fal-ai/nano-banana-2/edit
// Auth: Authorization: Key <FAL_KEY>

const FAL_ENDPOINT = 'https://fal.run/fal-ai/nano-banana-2/edit';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GenerateImageParams {
  prompt: string;
  image?: string;        // base64 string (no data: prefix)
  imageType?: string;    // MIME type (e.g. 'image/jpeg')
  imageUrl?: string;     // OR an already-hosted https:// URL
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

// ─── Client ──────────────────────────────────────────────────────────────────

class ImageGeneratorClient {

  async generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
    const key = process.env.FAL_KEY;
    if (!key) {
      console.error('[fal.ai] FAL_KEY is not set in runtime environment');
      return { success: false, error: 'Server configuration error: FAL_KEY missing' };
    }

    // Build the image URL — prefer hosted URL, fall back to base64 data URL
    let imageUrl: string;
    if (params.imageUrl && params.imageUrl.startsWith('http')) {
      imageUrl = params.imageUrl;
    } else if (params.image) {
      const mime = params.imageType ?? 'image/jpeg';
      imageUrl = `data:${mime};base64,${params.image}`;
    } else {
      return { success: false, error: 'No image provided' };
    }

    console.log('[fal.ai] calling', FAL_ENDPOINT);
    console.log('[fal.ai] image type:', params.imageUrl ? 'hosted URL' : 'base64 data URL');

    try {
      const response = await fetch(FAL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt:        params.prompt,
          image_urls:    [imageUrl],
          aspect_ratio:  '3:4',
          num_images:    1,
          output_format: 'jpeg',
          resolution:    '1K',
        }),
      });

      const text = await response.text();
      console.log('[fal.ai] status:', response.status);

      if (!response.ok) {
        console.error('[fal.ai] error response:', text.slice(0, 500));
        return { success: false, error: `fal.ai error ${response.status}: ${text.slice(0, 200)}` };
      }

      const json = JSON.parse(text) as { images?: { url: string }[] };
      const outputUrl = json.images?.[0]?.url;

      if (!outputUrl) {
        console.error('[fal.ai] no image in response:', text.slice(0, 500));
        return { success: false, error: 'No image returned from fal.ai' };
      }

      console.log('[fal.ai] success:', outputUrl);
      return { success: true, imageUrl: outputUrl };

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[fal.ai] fetch failed:', msg);
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
