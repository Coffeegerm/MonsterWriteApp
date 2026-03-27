# supabase-migration

Generate a Supabase SQL migration + matching TypeScript types for MonsterWrite.

## Usage

```
/supabase-migration <table-name> [--fields "field:type, field:type, ..."]
```

Examples:
- `/supabase-migration monsters` → generates full monsters table
- `/supabase-migration writing_sessions --fields "word_count:integer, content:text, daily_goal_met:boolean"`
- `/supabase-migration badges --fields "user_id:uuid, badge_type:text, earned_at:timestamptz"`

## What I do

Output two things:
1. SQL migration to run in Supabase SQL Editor (or `supabase/migrations/`)
2. TypeScript Row type to add to `types/supabase.ts`

---

### SQL Migration Template

```sql
-- ─── Create table ─────────────────────────────────────────────────────────────

create table if not exists public.<table_name> (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,

  -- custom fields go here --

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists <table_name>_user_id_idx
  on public.<table_name>(user_id);

-- ─── Updated_at trigger ───────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger <table_name>_updated_at
  before update on public.<table_name>
  for each row execute procedure public.handle_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.<table_name> enable row level security;

-- Users can only see their own rows
create policy "<table_name>_select_own"
  on public.<table_name> for select
  using (auth.uid() = user_id);

-- Users can only insert their own rows
create policy "<table_name>_insert_own"
  on public.<table_name> for insert
  with check (auth.uid() = user_id);

-- Users can only update their own rows
create policy "<table_name>_update_own"
  on public.<table_name> for update
  using (auth.uid() = user_id);

-- Users can only delete their own rows
create policy "<table_name>_delete_own"
  on public.<table_name> for delete
  using (auth.uid() = user_id);
```

---

### TypeScript Row Type Template

Add to `types/supabase.ts`:

```ts
export interface <TableName>Row {
  id: string;
  user_id: string;
  // custom fields here
  created_at: string;
  updated_at: string;
}

// Insert type (omit auto-generated fields)
export type Insert<TableName> = Omit<<TableName>Row, 'id' | 'created_at' | 'updated_at'>;

// Update type (all fields optional except id)
export type Update<TableName> = Partial<Omit<<TableName>Row, 'id' | 'created_at' | 'updated_at'>>;
```

---

### The 4 core MonsterWrite tables (Phase 1)

#### `users` (extends Supabase Auth)
```sql
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  daily_goal_words integer not null default 500,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
```

#### `monsters`
```sql
create table public.monsters (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  type           text not null check (type in ('blobbsworth','grimble','wisper','myco','cindra')),
  evolution_stage text not null default 'hatchling' check (evolution_stage in ('hatchling','companion','elder')),
  mood_state     text not null default 'neutral' check (mood_state in ('ecstatic','happy','neutral','sad','distressed')),
  hunger         integer not null default 100 check (hunger between 0 and 100),
  last_fed_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
```

#### `writing_sessions`
```sql
create table public.writing_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  word_count      integer not null default 0,
  content         text,  -- nullable; only saved if user opts in
  daily_goal_met  boolean not null default false,
  session_date    date not null default current_date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
```

#### `streaks`
```sql
create table public.streaks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade unique,
  current_streak  integer not null default 0,
  longest_streak  integer not null default 0,
  last_active_date date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
```

---

## Conventions checklist

- [ ] `gen_random_uuid()` for all primary keys
- [ ] `user_id uuid references auth.users(id) on delete cascade` on every table
- [ ] RLS enabled with all 4 CRUD policies (`auth.uid() = user_id`)
- [ ] Index on `user_id`
- [ ] `updated_at` trigger using `handle_updated_at()` function
- [ ] Check constraints for enum-like text fields
- [ ] TypeScript Row type added to `types/supabase.ts`
- [ ] `Insert<Name>` and `Update<Name>` helper types exported
