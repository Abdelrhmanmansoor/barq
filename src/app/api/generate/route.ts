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

    // Build the image data URL so it can be referenced in the prompt template
    const uploadedImageUrl = `data:image/jpeg;base64,${imageData}`;

    // Get the selected preset and inject all variables
    const { prompt, negativePrompt } = getEidPromptPreset(Number(presetId), {
      uploadedImageUrl,
      recipientName:  name,
      greetingLine1,
      greetingLine2,
    });

    // Send to fal.ai — uploaded image is both the identity reference
    // AND the image_url parameter passed to FLUX Kontext
    const result = await imageGenerator.generateImage({
      prompt,
      negative_prompt: negativePrompt,
      imageUrl: uploadedImageUrl,
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
    console.error('[/api/generate]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
