-- StaticFruit Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Market pools table
create table if not exists market_pools(
  market_id bigint primary key,
  pool_yes numeric not null default 0,
  pool_no numeric not null default 0,
  pool_total numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leaderboard table
create table if not exists leaderboard(
  address text primary key,
  total_staked numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function to increment staked amount
create or replace function increment_staked_amount(user_address text, stake_amount numeric)
returns void
language plpgsql
security definer
as $$
begin
  insert into leaderboard (address, total_staked, updated_at)
  values (user_address, stake_amount, now())
  on conflict (address)
  do update set
    total_staked = leaderboard.total_staked + stake_amount,
    updated_at = now();
end;
$$;

-- Function to update market pool
create or replace function update_market_pool(
  market_id_param bigint,
  yes_amount numeric,
  no_amount numeric
)
returns void
language plpgsql
security definer
as $$
begin
  insert into market_pools (market_id, pool_yes, pool_no, pool_total, updated_at)
  values (market_id_param, yes_amount, no_amount, yes_amount + no_amount, now())
  on conflict (market_id)
  do update set
    pool_yes = market_pools.pool_yes + yes_amount,
    pool_no = market_pools.pool_no + no_amount,
    pool_total = market_pools.pool_yes + market_pools.pool_no + yes_amount + no_amount,
    updated_at = now();
end;
$$;

-- Enable Row Level Security (RLS)
alter table market_pools enable row level security;
alter table leaderboard enable row level security;

-- Create policies for public read access
create policy "Public read access for market_pools" on market_pools
  for select using (true);

create policy "Public read access for leaderboard" on leaderboard
  for select using (true);

-- Insert some sample data
insert into market_pools (market_id, pool_yes, pool_no, pool_total) values
  (1, 1000, 500, 1500),
  (2, 750, 1250, 2000),
  (3, 2000, 800, 2800)
on conflict (market_id) do nothing;

insert into leaderboard (address, total_staked) values
  ('0x1234567890123456789012345678901234567890', 5000),
  ('0x0987654321098765432109876543210987654321', 3200),
  ('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 2800)
on conflict (address) do nothing;
