/**
 * AI Prompt Builder for Eid Greeting Generation
 * Creates structured prompts optimized for high-quality AI image generation
 */

export interface PromptConfig {
  name: string;
  language: 'ar' | 'en';
  style?: 'cinematic' | 'artistic' | 'minimalist' | 'elegant';
  includePatterns?: boolean;
}

/**
 * Builds a comprehensive prompt for AI image generation
 */
export function buildEidPrompt(config: PromptConfig): string {
  const { name, language, style = 'cinematic', includePatterns = true } = config;

  // Base elements for Eid theme
  const baseElements = `
    Eid celebration greeting card,
    festive atmosphere,
    ${language === 'ar' ? 'Arabic calligraphy' : 'elegant typography'},
  `;

  // Cultural elements
  const culturalElements = `
    golden crescent moon,
    traditional Islamic lanterns (fanous),
    ornate Arabic geometric patterns,
    ${includePatterns ? 'luxury gold and deep purple ornamental borders' : ''},
  `;

  // Style-specific modifiers
  const styleModifiers = {
    cinematic: `
      cinematic lighting,
      soft ambient glow,
      professional photography quality,
      high dynamic range,
      warm golden hour light,
      premium SaaS design aesthetic,
      ultra HD,
      8K resolution,
    `,
    artistic: `
      watercolor painting style,
      soft brushstrokes,
      artistic interpretation,
      pastel colors,
      dreamy atmosphere,
    `,
    minimalist: `
      clean modern design,
      negative space,
      simple elegance,
      minimal color palette,
      contemporary aesthetic,
    `,
    elegant: `
      luxury design,
      sophisticated color scheme,
      premium gold accents,
      refined typography,
      high-end greeting card,
      royal purple and gold theme,
    `,
  };

  // User name integration
  const nameIntegration = language === 'ar'
    ? `elegant Arabic calligraphy spelling "${name}" prominently displayed,`
    : `elegant English typography displaying "${name}" in the center,`;

  // Face and lighting preservation
  const facePreservation = `
    realistic skin tone preservation,
    natural facial features,
    professional portrait lighting,
    soft studio lighting,
    natural looking composition,
  `;

  // Quality modifiers
  const qualityModifiers = `
    masterpiece,
    best quality,
    highly detailed,
    sharp focus,
    professional color grading,
    award-winning photography,
  `;

  // Combine all elements
  const prompt = `
    ${baseElements.trim()}
    ${culturalElements.trim()}
    ${nameIntegration.trim()}
    ${styleModifiers[style].trim()}
    ${facePreservation.trim()}
    ${qualityModifiers.trim()}
  `.replace(/\s+/g, ' ').trim();

  return prompt;
}

/**
 * Generates negative prompt to avoid unwanted elements
 */
export function buildNegativePrompt(): string {
  return `
    blurry,
    low quality,
    distorted,
    deformed,
    ugly,
    bad anatomy,
    disfigured,
    poorly drawn face,
    mutation,
    mutated,
    extra limb,
    ugly,
    poorly drawn hands,
    missing limb,
    floating limbs,
    disconnected limbs,
    malformed hands,
    blur,
    out of focus,
    long neck,
    long body,
    mutation,
    mutated,
    disgusting,
    childish,
    cartoon,
    3d,
    anime,
  `.replace(/\s+/g, ' ').trim();
}

/**
 * Generates prompt parameters for different AI providers
 */
export function generatePromptParams(config: PromptConfig) {
  return {
    prompt: buildEidPrompt(config),
    negative_prompt: buildNegativePrompt(),
    // Common parameters across providers
    width: 1024,
    height: 1024,
    steps: 30,
    guidance_scale: 7.5,
    seed: -1, // Random seed
  };
}