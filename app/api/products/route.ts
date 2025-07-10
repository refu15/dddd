import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createServerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch products belonging to the authenticated seller
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id);

  if (error) {
    console.error('Error fetching products:', error.message);
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

  const { name, description, price, stock, image_url } = await request.json();

  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: user.id, // Link product to authenticated seller ID
      name,
      description,
      price,
      stock,
      image_url,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error.message);
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

  const { id, name, description, price, stock, image_url } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required for update.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      name,
      description,
      price,
      stock,
      image_url,
    })
    .eq('id', id)
    .eq('seller_id', user.id) // Ensure only the owner can update their product
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = createServerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required for delete.' }, { status: 400 });
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('seller_id', user.id); // Ensure only the owner can delete their product

  if (error) {
    console.error('Error deleting product:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Product deleted successfully' }, { status: 204 });
}
