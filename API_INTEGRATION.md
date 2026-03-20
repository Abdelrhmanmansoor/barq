# API Integration Guide

This guide explains how to integrate different AI image generation providers with Barq.

## 🔌 Supported AI Providers

The application is designed to work with any AI image generation API. Below are examples for popular providers.

### 1. Replicate (Stable Diffusion)

**Setup:**

1. Create account at [replicate.com](https://replicate.com)
2. Get your API token
3. Update environment variables:

```env
NEXT_PUBLIC_AI_API_URL=https://api.replicate.com/v1
AI_API_KEY=r8_xxxxxxxxxxxxxxxxxxxxxxxx
```

**Implementation:**

```typescript
// src/lib/api/imageGenerator.ts
async generateImage(params: GenerateImageParams) {
  const response = await this.client.post('/predictions', {
    version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea5355253b877d3be1c4ffbb8',
    input: {
      prompt: params.prompt,
      negative_prompt: params.negative_prompt,
      image: params.image,
      width: params.width,
      height: params.height,
      num_inference_steps: params.steps,
      guidance_scale: params.guidance_scale,
    }
  });

  const predictionId = response.data.id;
  
  // Poll for result
  while (true) {
    const status = await this.client.get(`/predictions/${predictionId}`);
    if (status.data.status === 'succeeded') {
      return {
        success: true,
        imageUrl: status.data.output[0],
        requestId: predictionId,
      };
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

### 2. OpenAI DALL-E 3

**Setup:**

```env
NEXT_PUBLIC_AI_API_URL=https://api.openai.com/v1
AI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxx
```

**Implementation:**

```typescript
async generateImage(params: GenerateImageParams) {
  const response = await this.client.post('/images/generations', {
    model: 'dall-e-3',
    prompt: params.prompt,
    size: `${params.width}x${params.height}`,
    quality: 'hd',
    n: 1,
  });

  return {
    success: true,
    imageUrl: response.data.data[0].url,
    requestId: response.data.created,
  };
}
```

### 3. Stability AI

**Setup:**

```env
NEXT_PUBLIC_AI_API_URL=https://api.stability.ai/v1
AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxx
```

**Implementation:**

```typescript
async generateImage(params: GenerateImageParams) {
  const response = await this.client.post('/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    text_prompts: [
      {
        text: params.prompt,
        weight: 1,
      },
      {
        text: params.negative_prompt,
        weight: -1,
      },
    ],
    cfg_scale: params.guidance_scale,
    height: params.height,
    width: params.width,
    steps: params.steps,
    samples: 1,
    init_image: params.image, // Optional
  });

  return {
    success: true,
    imageUrl: `data:image/png;base64,${response.data.artifacts[0].base64}`,
    requestId: response.data.request_id,
  };
}
```

### 4. Midjourney (via Third-Party API)

**Setup:**

Use services like [GoAPI](https://goapi.ai) or [ImagineAPI](https://imagineapi.dev).

```env
NEXT_PUBLIC_AI_API_URL=https://api.goapi.xyz
AI_API_KEY=your_api_key
```

**Implementation:**

```typescript
async generateImage(params: GenerateImageParams) {
  const response = await this.client.post('/mj/v2/imagine', {
    prompt: params.prompt,
    base64_array: [params.image],
  });

  return {
    success: true,
    imageUrl: response.data.task_result,
    requestId: response.data.task_id,
  };
}
```

## 🎛️ Configuration Options

### Image Size

Edit in `src/lib/ai/promptBuilder.ts`:

```typescript
export function generatePromptParams(config: PromptConfig) {
  return {
    prompt: buildEidPrompt(config),
    negative_prompt: buildNegativePrompt(),
    width: 1024,    // Adjust width
    height: 1024,   // Adjust height
    steps: 30,        // Quality vs speed
    guidance_scale: 7.5, // Adherence to prompt
    seed: -1,
  };
}
```

### Quality Settings

**Steps (Quality):**
- 20-30: Fast, lower quality
- 30-40: Balanced (recommended)
- 40-50: Slow, highest quality

**Guidance Scale:**
- 5-7: More creative, less adherence
- 7-9: Balanced (recommended)
- 9-15: Strict adherence, less creative

## 🔧 Custom Integration

To integrate a custom AI provider:

1. **Update API Client:**

```typescript
// src/lib/api/imageGenerator.ts
class ImageGeneratorClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AI_API_URL,
      timeout: 60000,
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        // Add provider-specific headers
      },
    });
  }

  async generateImage(params: GenerateImageParams) {
    // Implement provider-specific logic
    const response = await this.client.post('/your-endpoint', {
      // Provider-specific request format
    });

    return {
      success: true,
      imageUrl: response.data.output_url,
      requestId: response.data.id,
    };
  }
}
```

2. **Update Environment Variables:**

```env
NEXT_PUBLIC_AI_API_URL=https://your-provider.com/v1
AI_API_KEY=your_api_key
```

3. **Test the Integration:**

```bash
npm run dev
# Try generating an image
# Check browser console for errors
```

## 📊 Provider Comparison

| Provider | Quality | Speed | Cost | Ease of Integration |
|-----------|----------|--------|-------|-------------------|
| Stable Diffusion (Replicate) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Easy |
| DALL-E 3 | ⭐⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Very Easy |
| Stability AI | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Medium |
| Midjourney | ⭐⭐⭐⭐⭐⭐ | ⭐⭐ | Medium (via API) |

## 💡 Best Practices

### 1. Error Handling

Always handle different error scenarios:

```typescript
try {
  const response = await this.client.post('/endpoint', data);
  return { success: true, imageUrl: response.data.url };
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      throw new Error('Invalid API key');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded');
    } else if (error.response?.status === 500) {
      throw new Error('Provider error, please try again');
    }
  }
  throw new Error('Unknown error occurred');
}
```

### 2. Timeout Handling

Set appropriate timeouts for image generation:

```typescript
this.client = axios.create({
  timeout: 120000, // 2 minutes for slow providers
});
```

### 3. Retry Logic

Implement exponential backoff:

```typescript
async generateWithRetry(params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.generateImage(params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### 4. Caching

Cache results to reduce API costs:

```typescript
const cache = new Map<string, string>();

async generateImage(params: GenerateImageParams) {
  const cacheKey = JSON.stringify(params);
  
  if (cache.has(cacheKey)) {
    return { success: true, imageUrl: cache.get(cacheKey) };
  }

  const result = await this.generateNewImage(params);
  cache.set(cacheKey, result.imageUrl);
  return result;
}
```

## 🔒 Security

### 1. API Key Management

- Never commit API keys to git
- Use environment variables
- Rotate keys regularly
- Monitor usage in provider dashboard

### 2. Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
const rateLimiter = {
  requests: 0,
  resetTime: Date.now() + 60000, // 1 minute
};

async generateImage(params: GenerateImageParams) {
  if (Date.now() > rateLimiter.resetTime) {
    rateLimiter.requests = 0;
    rateLimiter.resetTime = Date.now() + 60000;
  }

  if (rateLimiter.requests >= 10) {
    throw new Error('Rate limit exceeded, please wait');
  }

  rateLimiter.requests++;
  // Proceed with generation
}
```

### 3. Input Validation

Validate all inputs before sending to API:

```typescript
function validateParams(params: GenerateImageParams) {
  if (!params.prompt || params.prompt.length > 1000) {
    throw new Error('Invalid prompt');
  }
  if (params.width < 256 || params.width > 2048) {
    throw new Error('Invalid width');
  }
  if (params.steps < 10 || params.steps > 100) {
    throw new Error('Invalid steps');
  }
}
```

## 🧪 Testing

### Local Testing

```typescript
// Test without real API
const mockImageGenerator = {
  generateImage: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      imageUrl: 'https://example.com/test-image.png',
      requestId: 'test-123',
    };
  }
};
```

### API Testing

```bash
# Test API directly
curl -X POST https://api.provider.com/v1/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Eid greeting card"}'
```

## 📚 Resources

- [Replicate API Docs](https://replicate.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Stability AI Docs](https://platform.stability.ai/docs)
- [Midjourney API Guide](https://docs.midjourney.com/)

## 🆘 Troubleshooting

### Common Issues

**401 Unauthorized**
- Check API key is correct
- Ensure key has required permissions
- Verify environment variables are set

**429 Rate Limit**
- Reduce request frequency
- Upgrade API plan if needed
- Implement caching

**500 Server Error**
- Check provider status page
- Wait and retry
- Contact provider support

**Slow Generation**
- Reduce steps parameter
- Use lower resolution
- Switch to faster provider

### Debug Mode

Enable debug logging:

```typescript
console.log('API Request:', {
  url: this.apiUrl,
  params: { ...params, image: '[BASE64]' },
});
```

---

Need help? Check provider documentation or create an issue.