import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { Book, BuyLink } from '@/types/supabase'
import { getBookCover, getPlaceholderColor } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data } = await supabase.from('books').select('title,tagline').eq('slug', slug).single()
    if (!data) return {}
    return { title: `${data.title} — السيد الريس`, description: data.tagline ?? '' }
  } catch { return {} }
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!book) notFound()

  const b = book as Book
  const { data: links } = await supabase
    .from('buy_links')
    .select('*')
    .eq('book_id', b.id)
    .order('sort_order')
  const buyLinks = (links as BuyLink[]) ?? []

  const { data: seriesData } = b.series
    ? await supabase.from('books').select('id,slug,title,cover_url,placeholder_color').eq('series', b.series).eq('published', true).neq('slug', b.slug)
    : { data: [] }
  const seriesBooks = (seriesData as Book[]) ?? []

  const cover = getBookCover(b)
  const bg    = getPlaceholderColor(b)

  return (
    <main className="bg-obsidian text-ink min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/books" className="inline-flex items-center gap-2 text-ember hover:text-gold transition-colors mb-8 font-tajawal font-semibold">
          <span>←</span><span>كل الأعمال</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 mb-16">
          {/* Cover */}
          <div className="flex items-start justify-center">
            <div className="relative w-full max-w-xs aspect-[2/3] rounded-lg overflow-hidden">
              {cover ? (
                <Image src={cover} alt={b.title} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6" style={{ background: bg }}>
                  <p className="font-aref text-3xl text-ink/80 text-center">{b.title}</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-obsidian-lighter text-ink text-sm px-3 py-1 rounded font-tajawal">{b.type}</span>
              {b.series  && <span className="bg-ember/20 text-ember text-sm px-3 py-1 rounded font-tajawal">{b.series}</span>}
              {b.edition && <span className="bg-gold/20 text-gold text-sm px-3 py-1 rounded font-tajawal">{b.edition}</span>}
              {b.award   && <span className="bg-gold/10 text-gold text-sm px-3 py-1 rounded font-tajawal border border-gold/30">{b.award}</span>}
            </div>

            <div>
              <h1 className="font-aref text-4xl sm:text-5xl text-ink mb-3">{b.title}</h1>
              {b.tagline && (
                <p className="text-lg text-ink/70 font-tajawal border-r-4 border-ember pr-4">{b.tagline}</p>
              )}
            </div>

            {b.synopsis && (
              <div className="space-y-3">
                {b.synopsis.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-ink/80 font-tajawal leading-relaxed text-sm sm:text-base">{para}</p>
                ))}
              </div>
            )}

            {buyLinks.length > 0 && (
              <div className="space-y-2 pt-4">
                {buyLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank" rel="noopener noreferrer"
                    className="block bg-ember text-obsidian px-6 py-3 rounded font-tajawal font-semibold hover:bg-ember/90 transition-colors text-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* من نفس العالم */}
        {seriesBooks.length > 0 && (
          <div className="border-t border-obsidian-lighter pt-14">
            <h2 className="font-aref text-3xl text-ink mb-8">من نفس العالم</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {seriesBooks.map((sb) => {
                const sc = getBookCover(sb)
                const sbg = getPlaceholderColor(sb)
                return (
                  <Link key={sb.slug} href={`/books/${sb.slug}`}>
                    <div className="group cursor-pointer">
                      <div className="card-lifted relative aspect-[2/3] rounded-lg overflow-hidden mb-3 group-hover:border-gold transition-all duration-300">
                        {sc
                          ? <Image src={sc} alt={sb.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="w-full h-full" style={{ background: sbg }} />
                        }
                      </div>
                      <h3 className="font-aref text-base text-ink group-hover:text-ember transition-colors">{sb.title}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
