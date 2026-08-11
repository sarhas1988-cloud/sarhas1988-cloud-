import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 })

  const supabase = await createClient()

  // Find order by token
  const { data: order } = await supabase
    .from('orders')
    .select('id, book_id, status, downloaded')
    .eq('download_token', token)
    .single()

  if (!order) return NextResponse.json({ error: 'رابط غير صالح' }, { status: 404 })
  if (order.status !== 'completed') return NextResponse.json({ error: 'الدفع لم يكتمل' }, { status: 403 })

  // Get book file
  const { data: book } = await supabase
    .from('books')
    .select('title, ebook_file_url')
    .eq('id', order.book_id)
    .single()

  if (!book?.ebook_file_url) return NextResponse.json({ error: 'الملف غير متوفر' }, { status: 404 })

  // Mark as downloaded
  await supabase.from('orders').update({ downloaded: true }).eq('id', order.id)

  // Redirect to file
  return NextResponse.redirect(book.ebook_file_url)
}
