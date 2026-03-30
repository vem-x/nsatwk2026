import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('id, name, organization, role')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
