import { NextRequest, NextResponse } from 'next/server';
import { imageGenerator } from '@/lib/api/imageGenerator';
import { getEidPromptPreset } from '@/lib/ai/eidPromptPresets';

/**
 * POST /api/generate
 * Body: { name, imageData, presetId?, greetingLine1?, greetingLine2?, email? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      imageData,           // base64 string of the uploaded face photo
      imageType = 'image/jpeg', // MIME type of the uploaded image
      presetId = 1,        // which of the 7 presets to use (1–7)
      greetingLine1,
      greetingLine2,
    } = body;

    if (!name || !imageData) {
      return NextResponse.json(
        { success: false, error: 'Name and image are required' },
        { status: 400 }
      );
    }

    // Get the selected preset and inject all variables
    // Note: uploadedImageUrl is a placeholder — the actual image is passed via image param
    const { prompt, negativePrompt } = getEidPromptPreset(Number(presetId), {
      uploadedImageUrl: '[uploaded face photo]',
      recipientName:  name,
      greetingLine1,
      greetingLine2,
    });

    // Send to fal.ai — pass the raw base64 so imageGenerator uploads it to fal.ai storage
    const result = await imageGenerator.generateImage({
      prompt,
      negative_prompt: negativePrompt,
      image: imageData,
      imageType,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Image generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success:   true,
      imageUrl:  result.imageUrl,
      requestId: result.requestId,
    });

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[/api/generate] caught:', msg);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
