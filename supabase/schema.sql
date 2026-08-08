-- السيد الريس — Supabase Schema
-- نفّذ كل ده في SQL Editor مرة واحدة

create extension if not exists "uuid-ossp";

-- BOOKS
create table if not exists public.books (
  id                uuid primary key default uuid_generate_v4(),
  slug              text unique not null,
  title             text not null,
  series            text,
  type              text not null default 'رواية',
  edition           text,
  award             text,
  tagline           text,
  synopsis          text,
  cover_url         text,
  placeholder_color text default '#0B0806',
  sort_order        int default 0,
  published         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- BUY LINKS
create table if not exists public.buy_links (
  id         uuid primary key default uuid_generate_v4(),
  book_id    uuid not null references public.books(id) on delete cascade,
  label      text not null,
  url        text not null,
  sort_order int default 0
);

-- POSTS
create table if not exists public.posts (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  cover_url    text,
  body         text,
  published    boolean not null default false,
  published_at timestamptz default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- SUBSCRIBERS
create table if not exists public.subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

-- INDEXES
create index if not exists idx_books_slug      on public.books(slug);
create index if not exists idx_books_published on public.books(published);
create index if not exists idx_books_sort      on public.books(sort_order);
create index if not exists idx_buy_links_book  on public.buy_links(book_id);
create index if not exists idx_posts_slug      on public.posts(slug);
create index if not exists idx_posts_published on public.posts(published);

-- RLS
alter table public.books       enable row level security;
alter table public.buy_links   enable row level security;
alter table public.posts       enable row level security;
alter table public.subscribers enable row level security;

-- BOOKS policies
create policy "public read published books"  on public.books for select using (published = true);
create policy "admin read all books"         on public.books for select to authenticated using (true);
create policy "admin insert books"           on public.books for insert to authenticated with check (true);
create policy "admin update books"           on public.books for update to authenticated using (true) with check (true);
create policy "admin delete books"           on public.books for delete to authenticated using (true);

-- BUY LINKS policies
create policy "public read buy_links"   on public.buy_links for select using (true);
create policy "admin manage buy_links"  on public.buy_links for all to authenticated using (true) with check (true);

-- POSTS policies
create policy "public read published posts" on public.posts for select using (published = true);
create policy "admin read all posts"        on public.posts for select to authenticated using (true);
create policy "admin insert posts"          on public.posts for insert to authenticated with check (true);
create policy "admin update posts"          on public.posts for update to authenticated using (true) with check (true);
create policy "admin delete posts"          on public.posts for delete to authenticated using (true);

-- SUBSCRIBERS policies
create policy "public insert subscribers" on public.subscribers for insert with check (true);
create policy "admin read subscribers"    on public.subscribers for select to authenticated using (true);
create policy "admin delete subscribers"  on public.subscribers for delete to authenticated using (true);

-- STORAGE BUCKET
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict (id) do nothing;
create policy "public read covers"   on storage.objects for select using (bucket_id = 'covers');
create policy "admin upload covers"  on storage.objects for insert to authenticated with check (bucket_id = 'covers');
create policy "admin update covers"  on storage.objects for update to authenticated using (bucket_id = 'covers');
create policy "admin delete covers"  on storage.objects for delete to authenticated using (bucket_id = 'covers');

-- SEED DATA (الـ 7 كتب)
insert into public.books (slug, title, series, type, edition, award, tagline, synopsis, placeholder_color, sort_order, published) values
('toqoos',    'طقوس الموت',     'قلادة الشمس', 'رواية',           'الطبعة الثالثة',  null,                              'في كل العصور وُجدوا بيننا، وفي كل الحضارات مارسوا طقوسهم.', 'إنهم مَن يستترون خلف الظلام. من الموت يستمدّون حياتهم. في كل العصور وُجدوا بيننا، وفي كل الحضارات مارسوا طقوسهم. طقوس الموت.', '#150804', 1, true),
('zoroaster', 'زورستر',         'قلادة الشمس', 'رواية',           'الطبعة الرابعة',  'القائمة القصيرة — مسابقة جرير ٢٠٢٢', 'عبر العصور عُرف بأسماء عديدة. فهل عاد الساحر الأسود من جديد؟', 'عبر العصور غَرف بأسماء عديدة. يُستدعى من الظلام لهدف واحد لا غير: السيطرة على العقول، وسفك الدماء، ونشر الشرور.', '#0a0402', 2, true),
('kohna',     'كهنة الشمس',     'قلادة الشمس', 'رواية',           null,              null,                              'المواجهة الأخيرة. يحاولون إعادة كتابة التاريخ ليسود الظلام.', 'يحاول كهنة الشمس إعادة كتابة التاريخ المعروف من جديد، ليسود الظلام ويبدأ عصر الشر. وفي الموعد المنشود يتصدى لهم ياسين السمري.', '#030b0d', 3, true),
('daera',     'دائرة الخطايا',  null,           'رواية',           null,              null,                              'مستمدة من أحداث واقعية.', 'عندما تنقلب حياتك بلحظة واحدة من النقيض للنقيض، ليظهر ماضيك للحياة مجدداً. فهل ستنجو من دائرة الخطايا أم ستكون نهايتك بداخلها؟', '#1a0704', 4, true),
('tilka',     'تلك الليلة',     null,           'رواية',           null,              null,                              null, null, '#16294d', 5, true),
('kawabis',   'كوابيس الظلام',  null,           'مجموعة قصصية',   null,              null,                              null, null, '#2a2622', 6, true),
('abriaa',    'أبرياء وقتلة',   null,           'مجموعة قصصية',   null,              null,                              'يقال أحياناً إن الإنسان حيوانٌ كاسر — إلا أن في هذا القول إهانةً للحيوانات.', 'مجموعة قصصية تستكشف الحدود الرفيعة بين البراءة والجريمة، بين الضحية والجلاد.', '#2c2450', 7, true)
on conflict (slug) do nothing;

-- ============================================================
-- CONTACTS (نموذج التواصل)
-- ============================================================
create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "public insert contacts" on public.contacts
  for insert with check (true);

create policy "admin read contacts" on public.contacts
  for select to authenticated using (true);

create policy "admin update contacts" on public.contacts
  for update to authenticated using (true) with check (true);

create policy "admin delete contacts" on public.contacts
  for delete to authenticated using (true);
