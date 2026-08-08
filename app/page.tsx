import { createClient } from '@/utils/supabase/server'
import { Hero } from '@/components/hero'
import { Manifesto } from '@/components/manifesto'
import { UniverseSection } from '@/components/universe-section'
import { WorksGrid } from '@/components/works-grid'
import { AboutSection } from '@/components/about-section'
import { NewsletterSection } from '@/components/newsletter-section'
import { UpcomingEvents } from '@/components/upcoming-events'
import type { Book } from '@/types/supabase'

export const revalidate = 60

async function getBooks(): Promise<Book[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('books')
      .select('*')
      .eq('published', true)
      .order('sort_order')
    return (data as Book[]) ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const books = await getBooks()
  const seriesBooks = books.filter((b) => b.series === 'قلادة الشمس')

  return (
    <main className="bg-obsidian text-ink relative">
      <Hero />
      <Manifesto />
      <UniverseSection books={seriesBooks} />
      <WorksGrid books={books} />
      <AboutSection />
      <UpcomingEvents />
      <NewsletterSection />
    </main>
  )
}
