import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request, { params }) {
  const { id } = await params;

  const formData = await request.formData();
  const image = formData.get('image');
  if (!image) return NextResponse.json({ error: 'No image' }, { status: 400 });

  const buffer = Buffer.from(await image.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from('pass-images')
    .upload(`${id}.png`, buffer, { contentType: 'image/png', upsert: true });

  if (error) {
    console.error('Pass capture upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
