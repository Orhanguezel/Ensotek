import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, all } = body;

    if (all) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ revalidated: true, scope: 'all' }, { headers: CORS_HEADERS });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path }, { headers: CORS_HEADERS });
    }

    return NextResponse.json({ error: 'path veya all gerekli' }, { status: 400, headers: CORS_HEADERS });
  } catch {
    return NextResponse.json({ error: 'Gecersiz istek' }, { status: 400, headers: CORS_HEADERS });
  }
}
