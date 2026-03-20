import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.FAL_KEY;
  return NextResponse.json({
    hasKey: !!key,
    keyPrefix: key ? key.slice(0, 8) + '...' : null,
    nodeEnv: process.env.NODE_ENV,
  });
}
