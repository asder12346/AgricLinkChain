-- Profiles Table (Links to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  user_type text check (user_type in ('Farmer', 'Buyer', 'Agent', 'Admin', 'Financier', 'Logistics', 'Researcher')),
  location text,
  farm_size text,
  farm_location text,
  crops_farming text,
  crops_planting text,
  referral_code text unique,
  referred_by text,
  avatar_url text,
  phone text,
  nin text,
  business_registration_number text,
  date_of_birth date,
  gender text,
  bio text,
  website text,
  secondary_email text,
  preferred_products text,
  company_name text,
  company_role text,
  onboarding_complete boolean default false,
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

-- Loan Requests Table (farmer side)
create table public.loan_requests (
  id uuid default gen_random_uuid() primary key,
  farmer_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric not null,
  purpose text not null,
  crop_type text,
  farm_size text,
  status text check (status in ('pending', 'approved', 'rejected', 'more_info')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Loans Table (financier-issued loans)
create table public.loans (
  id uuid default gen_random_uuid() primary key,
  farmer_id uuid references public.profiles(id) on delete cascade not null,
  financier_id uuid references public.profiles(id) on delete cascade not null,
  loan_request_id uuid references public.loan_requests(id) on delete set null,
  amount numeric not null,
  interest_rate numeric default 0,
  repayment_period integer, -- months
  due_date date,
  status text check (status in ('active', 'completed', 'defaulted')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Loan Repayments Table
create table public.loan_repayments (
  id uuid default gen_random_uuid() primary key,
  loan_id uuid references public.loans(id) on delete cascade not null,
  amount_paid numeric not null,
  payment_date date default current_date,
  status text check (status in ('confirmed', 'pending')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.commissions enable row level security;
alter table public.loan_requests enable row level security;
alter table public.loans enable row level security;
alter table public.loan_repayments enable row level security;

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

-- Loan Requests Policies
create policy "Farmers can manage own loan requests" on loan_requests for all using (auth.uid() = farmer_id);
create policy "Financiers can view all loan requests" on loan_requests for select using (
  exists (select 1 from public.profiles where id = auth.uid() and user_type = 'Financier')
);
create policy "Financiers can update loan request status" on loan_requests for update using (
  exists (select 1 from public.profiles where id = auth.uid() and user_type = 'Financier')
);

-- Loans Policies
create policy "Farmers can see their own loans" on loans for select using (auth.uid() = farmer_id);
create policy "Financiers can manage their own issued loans" on loans for all using (auth.uid() = financier_id);

-- Loan Repayments Policies
create policy "Farmers can see repayments for their loans" on loan_repayments for select using (
  exists (select 1 from public.loans where id = loan_id and farmer_id = auth.uid())
);
create policy "Financiers can manage repayments for their loans" on loan_repayments for all using (
  exists (select 1 from public.loans where id = loan_id and financier_id = auth.uid())
);

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
