/**
 * 7 Hidden Dynamic Eid Greeting Prompt Presets
 * Uses uploaded image as the only identity reference for fal.ai
 */

const NEGATIVE_PROMPT =
  'full body, wide shot, distant subject, small face, extra people, duplicate person, ' +
  'distorted face, bad hands, unreadable Arabic text, broken letters, right-aligned text, ' +
  'left-aligned text, corner text, cluttered typography, watermark, logo, low quality, ' +
  'blurry face, plastic skin, overbeautified face, identity drift';

export interface EidPreset {
  id: number;
  arabicTitle: string;
  englishKey: string;
  promptTemplate: string;
  negativePrompt: string;
}

export const eidPromptPresets: EidPreset[] = [
  {
    id: 1,
    arabicTitle: 'سينمائي فاخر',
    englishKey: 'cinematic-luxury',
    promptTemplate: `Create a premium ultra-realistic 3:4 portrait Eid greeting image using the uploaded image {{uploaded_image}} as the only identity reference. Use uploaded photo input as the source face. Preserve the face from the uploaded image exactly — do not replace or change the person. Based on the uploaded photo, place the person in a luxurious Saudi Eid setting with warm golden festive lighting, elegant Arabic architecture with blurred arches in the foreground, shallow depth of field telephoto compression, premium bokeh lanterns behind the subject, realistic skin texture, high-end commercial photography quality, authentic Saudi/Gulf Eid atmosphere, one person only, face and upper shoulders close to the camera. No full body.

Arabic typography layout — top center only:
Line 1 (centered top): "{{greeting_line_1}}"
Line 2 (centered top): "{{greeting_line_2}}"
Name (centered bottom, separated): "{{recipient_name}}"
Clean premium Arabic calligraphy. No side text. No corners. No garbled letters.`,
    negativePrompt: NEGATIVE_PROMPT,
  },
  {
    id: 2,
    arabicTitle: 'أنثوي ناعم',
    englishKey: 'soft-feminine-eid',
    promptTemplate: `Create a premium ultra-realistic 3:4 portrait Eid greeting image using the uploaded image {{uploaded_image}} as the only identity reference. Use uploaded photo input as the source face. Preserve the face from the uploaded image exactly. Based on the uploaded photo, style the result with a refined soft festive Saudi/Gulf mood, elegant modest styling, soft lantern bokeh background, warm natural smile, graceful feminine-friendly luxury atmosphere, heavy foreground blur with mashrabiya framing, telephoto compressed portrait, shallow depth of field, realistic premium photography, face and upper shoulders close to the camera, one person only. Naturally preserve identity and adapt styling into a classy Eid portrait.

Arabic typography layout — top center only:
Line 1 (centered top): "{{greeting_line_1}}"
Line 2 (centered top): "{{greeting_line_2}}"
Name (centered bottom, separated): "{{recipient_name}}"
Clean premium Arabic calligraphy. No side text. No corners. No garbled letters.`,
    negativePrompt: NEGATIVE_PROMPT,
  },
  {
    id: 3,
    arabicTitle: 'عصري راقٍ',
    englishKey: 'modern-premium',
    promptTemplate: `Create a premium ultra-realistic 3:4 portrait Eid greeting image using the uploaded image {{uploaded_image}} as the only identity reference. Use uploaded photo input as the source face. Preserve the face from the uploaded image exactly. Based on the uploaded photo, create a modern polished premium Saudi-friendly Eid portrait with soft backlight, subtle festive decor in the blurred background, creamy bokeh depth, high-end editorial photography quality, telephoto compressed framing, layered foreground blur, face close to the camera with upper shoulders only visible, one person only. Keep the uploaded identity intact while presenting a modern Eid greeting poster.

Arabic typography layout — top center only:
Line 1 (centered top): "{{greeting_line_1}}"
Line 2 (centered top): "{{greeting_line_2}}"
Name (centered bottom, separated): "{{recipient_name}}"
Clean premium Arabic calligraphy. No side text. No corners. No garbled letters.`,
    negativePrompt: NEGATIVE_PROMPT,
  },
  {
    id: 4,
    arabicTitle: 'صباح العيد',
    englishKey: 'eid-morning',
    promptTemplate: `Create a premium ultra-realistic 3:4 portrait Eid greeting image using the uploaded image {{uploaded_image}} as the only identity reference. Use uploaded photo input as the source face. Preserve the face from the uploaded image exactly. Based on the uploaded photo, place the person in an upscale Eid morning atmosphere with soft natural golden morning light, warm lantern glow in the blurred background, festive Arabic architecture, emotional intimate mood, telephoto shallow depth of field, heavy foreground blur through architectural elements, face and upper shoulders close to the camera, premium realistic photography, one person only. Make the uploaded identity the hero of an elegant morning Eid card.

Arabic typography layout — top center only:
Line 1 (centered top): "{{greeting_line_1}}"
Line 2 (centered top): "{{greeting_line_2}}"
Name (centered bottom, separated): "{{recipient_name}}"
Clean premium Arabic calligraphy. No side text. No corners. No garbled letters.`,
    negativePrompt: NEGATIVE_PROMPT,
  },
  {
    id: 5,
    arabicTitle: 'فناء العيد',
    englishKey: 'eid-courtyard',
    promptTemplate: `Create a premium ultra-realistic 3:4 portrait Eid greeting image using the uploaded image {{uploaded_image}} as the only identity reference. Use uploaded photo input as the source face. Preserve the face from the uploaded image exactly. Based on the uploaded photo, place the person in a luxury Eid courtyard with warm sunrise light, rich golden bokeh, premium documentary-fashion realism, authentic Saudi festive courtyard atmosphere with blurred mashrabiya and lanterns in the foreground, telephoto compressed portrait, shallow depth of field, face and upper shoulders filling the frame, one person only, high-end editorial quality. Integrate the uploaded identity naturally without altering facial structure.

Arabic typography layout — top center only:
Line 1 (centered top): "{{greeting_line_1}}"
Line 2 (centered top): "{{greeting_line_2}}"
Name (centered bottom, separated): "{{recipient_name}}"
Clean premium Arabic calligraphy. No side text. No corners. No garbled letters.`,
    negativePrompt: NEGATIVE_PROMPT,
  },
  {
    id: 6,
    arabicTitle: 'مجلس دافئ',
    englishKey: 'warm-majlis',
    promptTemplate: `Create a premium ultra-realistic 3:4 portrait Eid greeting image using the uploaded image {{uploaded_image}} as the only identity reference. Use uploaded photo input as the source face. Preserve the face from the uploaded image exactly. Based on the uploaded photo, style the person inside a luxury warm indoor Saudi majlis atmosphere with beautiful blurred lantern bokeh lights behind, realistic skin texture, premium Eid visual tone, elegant Gulf interior mood with soft foreground blur through decorative elements, telephoto compressed portrait, face close to the camera with upper shoulders only, one person only. Preserve the uploaded identity while giving the portrait a classy festive finish.

Arabic typography layout — top center only:
Line 1 (centered top): "{{greeting_line_1}}"
Line 2 (centered top): "{{greeting_line_2}}"
Name (centered bottom, separated): "{{recipient_name}}"
Clean premium Arabic calligraphy. No side text. No corners. No garbled letters.`,
    negativePrompt: NEGATIVE_PROMPT,
  },
  {
    id: 7,
    arabicTitle: 'هيبة العيد',
    englishKey: 'prestige-eid',
    promptTemplate: `Create a premium ultra-realistic 3:4 portrait Eid greeting image using the uploaded image {{uploaded_image}} as the only identity reference. Use uploaded photo input as the source face. Preserve the face from the uploaded image exactly. Based on the uploaded photo, create an elegant dark-toned premium festive scene with subtle golden lighting, luxurious blurred background with glowing bokeh lanterns, calm confident expression, authentic Saudi/Gulf Eid presence, telephoto shallow depth of field, layered foreground blur through arches, face and upper shoulders close to the camera, one person only, high-end editorial portrait quality. Keep the result refined, prestigious, and entirely faithful to the uploaded identity.

Arabic typography layout — top center only:
Line 1 (centered top): "{{greeting_line_1}}"
Line 2 (centered top): "{{greeting_line_2}}"
Name (centered bottom, separated): "{{recipient_name}}"
Clean premium Arabic calligraphy. No side text. No corners. No garbled letters.`,
    negativePrompt: NEGATIVE_PROMPT,
  },
];

export interface PresetData {
  uploadedImageUrl: string; // fal.ai will use this as the reference image input
  recipientName?: string;
  greetingLine1?: string;
  greetingLine2?: string;
}

/**
 * Find preset by id, inject all variables, return final prompt string.
 */
export function getEidPromptPreset(
  id: number,
  data: PresetData
): { prompt: string; negativePrompt: string; preset: EidPreset } {
  const preset = eidPromptPresets.find(p => p.id === id) ?? eidPromptPresets[0];

  const recipientName  = data.recipientName  || 'ضيف العيد';
  const greetingLine1  = data.greetingLine1  || 'تقبل الله طاعتكم';
  const greetingLine2  = data.greetingLine2  || 'كل عام وأنتم بخير';
  const uploadedImage  = data.uploadedImageUrl || '[uploaded image]';

  const prompt = preset.promptTemplate
    .replace(/\{\{uploaded_image\}\}/g,   uploadedImage)
    .replace(/\{\{recipient_name\}\}/g,   recipientName)
    .replace(/\{\{greeting_line_1\}\}/g,  greetingLine1)
    .replace(/\{\{greeting_line_2\}\}/g,  greetingLine2);

  return { prompt, negativePrompt: preset.negativePrompt, preset };
}
