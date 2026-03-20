import { NextRequest, NextResponse } from 'next/server';
import { imageGenerator } from '@/lib/api/imageGenerator';
import { generatePromptParams } from '@/lib/ai/promptBuilder';
import { emailService } from '@/lib/email/resend';

/**
 * API Route for AI Image Generation
 * POST /api/generate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, imageData, language = 'ar', email, sendEmail = false } = body;

    // Validate input
    if (!name || !imageData) {
      return NextResponse.json(
        { success: false, error: 'Name and image are required' },
        { status: 400 }
      );
    }

    // Generate prompt parameters
    const promptParams = generatePromptParams({
      name,
      language,
      style: 'cinematic',
      includePatterns: true,
    });

    // Call AI image generation API
    const result = await imageGenerator.generateImage({
      ...promptParams,
      image: imageData, // Base64 encoded image
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Image generation failed' },
        { status: 500 }
      );
    }

    // Send email notification if requested and email is provided
    if (sendEmail && email && result.imageUrl) {
      try {
        await emailService.sendImageGeneratedEmail(email, name, result.imageUrl);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      requestId: result.requestId,
    });

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}