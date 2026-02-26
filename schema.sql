-- Profiles Table (Links to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  user_type text check (user_type in ('Farmer', 'Buyer', 'Agent', 'Admin')),
  location text,
  farm_size text,
  farm_location text,
  crops_farming text,
  crops_planting text,
  referral_code text unique,
  referred_by text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listings Table (Products)
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  farmer_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  unit text not null,
  stock integer default 0,
  category text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.profiles(id) on delete set null,
  farmer_id uuid references public.profiles(id) on delete set null,
  product_id uuid references public.listings(id) on delete set null,
  quantity integer not null,
  total_amount numeric not null,
  status text check (status in ('pending', 'delivered', 'cancelled')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Commissions Table
create table public.commissions (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references public.profiles(id) on delete cascade,
  farmer_id uuid references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  commission_percentage numeric default 5,
  commission_amount numeric not null,
  status text check (status in ('pending', 'approved', 'paid')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.commissions enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Listings Policies
create policy "Listings are viewable by everyone" on listings for select using (true);
create policy "Farmers can manage their own listings" on listings for all using (auth.uid() = farmer_id);

-- Orders Policies
create policy "Users can see their own orders" on orders for select using (auth.uid() = buyer_id or auth.uid() = farmer_id);
create policy "Buyers can create orders" on orders for insert with check (auth.uid() = buyer_id);
create policy "Farmers can update their orders status" on orders for update using (auth.uid() = farmer_id);

-- Commissions Policies
create policy "Agents can see their own commissions" on commissions for select using (auth.uid() = agent_id);

-- Profile Trigger (Automatically create profile on signup)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    email, 
    user_type, 
    referral_code, 
    referred_by, 
    farm_size, 
    farm_location, 
    crops_farming
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'referral_code',
    new.raw_user_meta_data->>'referred_by',
    new.raw_user_meta_data->>'farm_size',
    new.raw_user_meta_data->>'farm_location',
    new.raw_user_meta_data->>'crops_farming'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE SETUP --
-- Run these to initialize the app-files bucket if it doesn't exist
-- SQL to create bucket if running in SQL editor:
-- insert into storage.buckets (id, name, public) values ('app-files', 'app-files', true);

-- Storage Policies
create policy "Images are publicly viewable"
on storage.objects for select
using ( bucket_id = 'app-files' );

create policy "Users can upload to own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'app-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'app-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'app-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);
