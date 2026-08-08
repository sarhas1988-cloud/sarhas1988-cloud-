export interface Book {
  id: string
  slug: string
  title: string
  series?: string | null
  type: string
  edition?: string | null
  award?: string | null
  tagline?: string | null
  synopsis?: string | null
  cover_url?: string | null
  placeholder_color?: string | null
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface BuyLink {
  id: string
  book_id: string
  label: string
  url: string
  sort_order: number
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  cover_url?: string | null
  body?: string | null
  published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: string
  email: string
  created_at: string
}

export interface Review {
  id: string
  book_id: string
  reviewer_name: string
  rating: number
  comment?: string | null
  approved: boolean
  created_at: string
}

export const LOCAL_COVERS: Record<string, string> = {
  toqoos:    '/images/covers/toqoos.jpg',
  zoroaster: '/images/covers/zoroaster.jpg',
  kohna:     '/images/covers/kohna.jpg',
  daera:     '/images/covers/daera.jpg',
  abriaa:    '/images/covers/abriaa.jpg',
}

export const PLACEHOLDER_COLORS: Record<string, string> = {
  toqoos:    '#150804',
  zoroaster: '#0a0402',
  kohna:     '#030b0d',
  daera:     '#1a0704',
  tilka:     '#16294d',
  kawabis:   '#2a2622',
  abriaa:    '#2c2450',
}

export function getBookCover(book: Pick<Book, 'slug' | 'cover_url'>): string | null {
  if (book.cover_url) return book.cover_url
  return LOCAL_COVERS[book.slug] ?? null
}

export function getPlaceholderColor(book: Pick<Book, 'slug' | 'placeholder_color'>): string {
  return book.placeholder_color ?? PLACEHOLDER_COLORS[book.slug] ?? '#28231e'
}
