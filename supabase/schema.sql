-- ===========================================
-- 红楼梦人物维基 · Supabase Schema (v1)
-- ===========================================
-- 全文搜索增强 + 用户交互
-- 在 Supabase SQL Editor 中执行此脚本

-- 启用扩展
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";  -- 用于模糊匹配
-- （注：标准 pg 已含全文搜索，无需 tsvector 扩展）

-- ===========================================
-- 1. 角色主表
-- ===========================================
create table if not exists characters (
  id text primary key,                          -- "jia-family/jia-baoyu"
  family text not null,                         -- "jia-family"
  slug text not null,                           -- "jia-baoyu"
  name_zh text not null,                        -- "贾宝玉"
  name_en text not null,                        -- "Jia Baoyu"
  aliases text[] default '{}',                  -- ["怡红公子", "绛洞花主", ...]
  tier text not null check (tier in ('A', 'B', 'C')),
  has_full_content boolean default false,
  excerpt_zh text,
  excerpt_en text,
  search_vector_zh tsvector,
  search_vector_en tsvector,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_characters_family on characters(family);
create index if not exists idx_characters_tier on characters(tier);
create index if not exists idx_characters_search_zh on characters using gin(search_vector_zh);
create index if not exists idx_characters_search_en on characters using gin(search_vector_en);
create index if not exists idx_characters_name_zh_trgm on characters using gin(name_zh gin_trgm_ops);
create index if not exists idx_characters_name_en_trgm on characters using gin(name_en gin_trgm_ops);

-- ===========================================
-- 2. 角色内容（profile / story / quotes / relationships）
-- ===========================================
create table if not exists character_content (
  id uuid primary key default uuid_generate_v4(),
  character_id text references characters(id) on delete cascade,
  content_type text not null check (content_type in ('profile', 'story', 'quotes', 'relationships')),
  content_zh text not null,
  content_en text,
  search_vector_zh tsvector,
  search_vector_en tsvector,
  created_at timestamptz default now()
);

create index if not exists idx_content_character on character_content(character_id);
create index if not exists idx_content_type on character_content(content_type);
create index if not exists idx_content_search_zh on character_content using gin(search_vector_zh);
create index if not exists idx_content_search_en on character_content using gin(search_vector_en);

-- ===========================================
-- 3. 判词 / 红楼梦曲
-- ===========================================
create table if not exists judgements (
  id uuid primary key default uuid_generate_v4(),
  character_id text references characters(id) on delete cascade,
  category text not null,                       -- "正册" | "副册" | "又副册"
  page_no int,                                  -- 1, 2, 3 ...
  poem_zh text not null,                        -- 判词原文
  poem_en text,                                 -- Hawkes 译文
  melody_zh text,                               -- 红楼梦曲
  melody_en text,
  search_vector_zh tsvector,
  search_vector_en tsvector
);

create index if not exists idx_judgements_character on judgements(character_id);
create index if not exists idx_judgements_search_zh on judgements using gin(search_vector_zh);

-- ===========================================
-- 4. 术语表（glossary）
-- ===========================================
create table if not exists glossary_terms (
  id uuid primary key default uuid_generate_v4(),
  term_zh text not null unique,
  term_en text not null,
  pinyin text,
  category text not null,                       -- "人物" | "地名" | "官职" | "典故" | ...
  definition_zh text not null,
  definition_en text,
  search_vector_zh tsvector,
  search_vector_en tsvector
);

create index if not exists idx_glossary_zh_trgm on glossary_terms using gin(term_zh gin_trgm_ops);
create index if not exists idx_glossary_search_zh on glossary_terms using gin(search_vector_zh);

-- ===========================================
-- 5. 浏览统计（anon，无需 user accounts）
-- ===========================================
create table if not exists page_views (
  id bigserial primary key,
  character_id text references characters(id) on delete cascade,
  path text not null,
  user_agent text,
  country text,
  viewed_at timestamptz default now()
);

create index if not exists idx_views_character on page_views(character_id);
create index if not exists idx_views_path on page_views(path);
create index if not exists idx_views_time on page_views(viewed_at);

-- ===========================================
-- 6. 全文搜索触发器（自动更新 tsvector）
-- ===========================================

-- 角色表 zh 全文搜索
create or replace function update_character_search_zh() returns trigger as $$
begin
  new.search_vector_zh :=
    setweight(to_tsvector('simple', coalesce(new.name_zh, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(new.aliases, ' '), '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.excerpt_zh, '')), 'B');
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_character_search_zh on characters;
create trigger trg_character_search_zh
  before insert or update on characters
  for each row execute function update_character_search_zh();

-- 角色表 en 全文搜索
create or replace function update_character_search_en() returns trigger as $$
begin
  new.search_vector_en :=
    setweight(to_tsvector('english', coalesce(new.name_en, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.aliases, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.excerpt_en, '')), 'B');
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_character_search_en on characters;
create trigger trg_character_search_en
  before insert or update on characters
  for each row execute function update_character_search_en();

-- 内容表 zh
create or replace function update_content_search_zh() returns trigger as $$
begin
  new.search_vector_zh := to_tsvector('simple', coalesce(new.content_zh, ''));
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_content_search_zh on character_content;
create trigger trg_content_search_zh
  before insert or update on character_content
  for each row execute function update_content_search_zh();

-- 内容表 en
create or replace function update_content_search_en() returns trigger as $$
begin
  new.search_vector_en := to_tsvector('english', coalesce(new.content_en, ''));
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_content_search_en on character_content;
create trigger trg_content_search_en
  before insert or update on character_content
  for each row execute function update_content_search_en();

-- 判词表 zh
create or replace function update_judgements_search_zh() returns trigger as $$
begin
  new.search_vector_zh :=
    to_tsvector('simple', coalesce(new.poem_zh, '') || ' ' || coalesce(new.melody_zh, ''));
  new.search_vector_en :=
    to_tsvector('english', coalesce(new.poem_en, '') || ' ' || coalesce(new.melody_en, ''));
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_judgements_search on judgements;
create trigger trg_judgements_search
  before insert or update on judgements
  for each row execute function update_judgements_search_zh();

-- 术语表
create or replace function update_glossary_search() returns trigger as $$
begin
  new.search_vector_zh := to_tsvector('simple', coalesce(new.definition_zh, ''));
  new.search_vector_en := to_tsvector('english', coalesce(new.definition_en, ''));
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_glossary_search on glossary_terms;
create trigger trg_glossary_search
  before insert or update on glossary_terms
  for each row execute function update_glossary_search();

-- ===========================================
-- 7. 搜索 RPC
-- ===========================================

-- 全文搜索：跨所有内容（角色 + 内容 + 判词 + 术语）
create or replace function search_all(query_text text, lang_pref text default 'zh', max_results int default 30)
returns table (
  type text,                     -- 'character' | 'content' | 'judgement' | 'glossary'
  id text,
  title text,
  snippet text,
  rank real
) language plpgsql as $$
begin
  -- 角色
  return query
    select
      'character'::text,
      c.id,
      c.name_zh,
      coalesce(c.excerpt_zh, ''),
      ts_rank_cd(c.search_vector_zh, plainto_tsquery('simple', query_text)) as rank
    from characters c
    where c.search_vector_zh @@ plainto_tsquery('simple', query_text)
    order by rank desc
    limit max_results / 4;
end;
$$;

-- 简化版：单函数搜索所有表
create or replace function search_all_v2(q text, lim int default 30)
returns table (
  result_type text,
  result_id text,
  result_title text,
  result_snippet text,
  result_rank real
) language sql as $$
  with q as (select plainto_tsquery('simple', q) as query)
  select 'character'::text, c.id::text, c.name_zh, coalesce(c.excerpt_zh, ''),
    ts_rank_cd(c.search_vector_zh, (select query from q))
  from characters c, q
  where c.search_vector_zh @@ (select query from q)
  union all
  select 'content'::text, cc.character_id || '/' || cc.content_type,
    cc.character_id, left(cc.content_zh, 200),
    ts_rank_cd(cc.search_vector_zh, (select query from q))
  from character_content cc, q
  where cc.search_vector_zh @@ (select query from q)
  union all
  select 'judgement'::text, j.character_id, j.character_id, left(j.poem_zh, 200),
    ts_rank_cd(j.search_vector_zh, (select query from q))
  from judgements j, q
  where j.search_vector_zh @@ (select query from q)
  order by 5 desc
  limit lim;
$$;

-- ===========================================
-- 8. 浏览统计 RPC
-- ===========================================

-- 增加浏览量（anon，无需认证）
create or replace function increment_view(p_path text, p_character text default null)
returns void language sql as $$
  insert into page_views (character_id, path) values (p_character, p_path);
$$;

-- 角色浏览 Top 10
create or replace function top_characters(since_days int default 30)
returns table (character_id text, view_count bigint)
language sql as $$
  select character_id, count(*) as view_count
  from page_views
  where character_id is not null
    and viewed_at > now() - (since_days || ' days')::interval
  group by character_id
  order by view_count desc
  limit 10;
$$;

-- ===========================================
-- 9. RLS (Row Level Security)
-- ===========================================

-- 浏览统计：anon 可插入
alter table page_views enable row level security;
drop policy if exists "anon insert views" on page_views;
create policy "anon insert views" on page_views for insert to anon with check (true);
drop policy if exists "anon select views" on page_views;
create policy "anon select views" on page_views for select to anon using (true);

-- 角色/内容/判词/术语：anon 可读
alter table characters enable row level security;
drop policy if exists "anon read characters" on characters;
create policy "anon read characters" on characters for select to anon using (true);

alter table character_content enable row level security;
drop policy if exists "anon read content" on character_content;
create policy "anon read content" on character_content for select to anon using (true);

alter table judgements enable row level security;
drop policy if exists "anon read judgements" on judgements;
create policy "anon read judgements" on judgements for select to anon using (true);

alter table glossary_terms enable row level security;
drop policy if exists "anon read glossary" on glossary_terms;
create policy "anon read glossary" on glossary_terms for select to anon using (true);

-- ===========================================
-- 10. 角色初始数据（demo）
-- ===========================================

-- 一旦应用运行，可通过 Supabase Dashboard / SQL 导入全量数据
-- 或运行 scripts/import-to-supabase.mjs 自动化导入

-- 示例：
-- insert into characters (id, family, slug, name_zh, name_en, aliases, tier, has_full_content, excerpt_zh, excerpt_en)
-- values ('jia-family/jia-baoyu', 'jia-family', 'jia-baoyu', '贾宝玉', 'Jia Baoyu',
--   ARRAY['怡红公子','绛洞花主','神瑛侍者'], 'A', true,
--   '第一主角，通灵宝玉之主，...', 'Main protagonist...');
