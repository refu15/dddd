import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching seller:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createServerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { company_name, contact_person, phone_number, email, address, bank_account_details } = await request.json();

  // Ensure the email provided matches the authenticated user's email for consistency
  if (user.email !== email) {
    return NextResponse.json({ error: 'Provided email does not match authenticated user email.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('sellers')
    .insert({
      id: user.id, // Link seller profile to authenticated user ID
      company_name,
      contact_person,
      phone_number,
      email,
      address,
      bank_account_details,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating seller:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = createServerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { company_name, contact_person, phone_number, email, address, bank_account_details } = await request.json();

  // Ensure the email provided matches the authenticated user's email for consistency
  if (user.email !== email) {
    return NextResponse.json({ error: 'Provided email does not match authenticated user email.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('sellers')
    .update({
      company_name,
      contact_person,
      phone_number,
      email,
      address,
      bank_account_details,
    })
    .eq('id', user.id) // Update only the authenticated user's seller profile
    .select()
    .single();

  if (error) {
    console.error('Error updating seller:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE() {
  const supabase = createServerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('sellers')
    .delete()
    .eq('id', user.id); // Delete only the authenticated user's seller profile

  if (error) {
    console.error('Error deleting seller:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Seller profile deleted successfully' }, { status: 204 });
}
