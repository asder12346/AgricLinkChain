-- AgricLinkChain Database Schema
-- ================================

-- 1. Create ENUM types
CREATE TYPE public.app_role AS ENUM ('farmer', 'buyer', 'admin');
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.listing_status AS ENUM ('pending', 'approved', 'sold_out', 'rejected');
CREATE TYPE public.order_status AS ENUM ('pending', 'accepted', 'rejected', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- 2. User Roles Table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- 3. Profiles Table (basic user info)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Farmers Table
CREATE TABLE public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  farm_name TEXT NOT NULL,
  farm_description TEXT,
  location TEXT NOT NULL,
  address TEXT,
  crops TEXT[],
  verification_status verification_status DEFAULT 'pending' NOT NULL,
  verification_documents TEXT[],
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Buyers Table
CREATE TABLE public.buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  business_type TEXT,
  location TEXT NOT NULL,
  address TEXT,
  contact_person TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spend DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Listings Table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  unit TEXT DEFAULT 'kg' NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity >= 0),
  available_quantity DECIMAL(10, 2) NOT NULL CHECK (available_quantity >= 0),
  images TEXT[],
  status listing_status DEFAULT 'pending' NOT NULL,
  harvest_date DATE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. Orders Table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.buyers(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  delivery_address TEXT,
  notes TEXT,
  accepted_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. Transactions Table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.buyers(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  farmer_earnings DECIMAL(12, 2) NOT NULL,
  status transaction_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT,
  transaction_reference TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 9. Reviews Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reviewed_farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
  reviewed_buyer_id UUID REFERENCES public.buyers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT review_target CHECK (
    (reviewed_farmer_id IS NOT NULL AND reviewed_buyer_id IS NULL) OR
    (reviewed_farmer_id IS NULL AND reviewed_buyer_id IS NOT NULL)
  )
);

-- 10. Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 11. Audit Logs Table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 12. Create Indexes
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_farmers_user_id ON public.farmers(user_id);
CREATE INDEX idx_farmers_verification ON public.farmers(verification_status);
CREATE INDEX idx_buyers_user_id ON public.buyers(user_id);
CREATE INDEX idx_listings_farmer_id ON public.listings(farmer_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_farmer_id ON public.orders(farmer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_transactions_order_id ON public.transactions(order_id);
CREATE INDEX idx_reviews_farmer_id ON public.reviews(reviewed_farmer_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- 13. Helper Functions (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.is_farmer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'farmer')
$$;

CREATE OR REPLACE FUNCTION public.is_buyer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'buyer')
$$;

CREATE OR REPLACE FUNCTION public.get_farmer_id_for_user(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.farmers WHERE user_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.get_buyer_id_for_user(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.buyers WHERE user_id = _user_id
$$;

-- 14. Updated at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 15. Apply updated_at triggers
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_farmers_updated_at BEFORE UPDATE ON public.farmers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_buyers_updated_at BEFORE UPDATE ON public.buyers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 16. Create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 18. RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Only system can insert roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- 19. RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "System creates profiles" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- 20. RLS Policies for farmers
CREATE POLICY "Farmers can view own record" ON public.farmers FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Approved farmers visible to buyers" ON public.farmers FOR SELECT USING (verification_status = 'approved' AND public.is_buyer());
CREATE POLICY "Users can create farmer profile" ON public.farmers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Farmers can update own record" ON public.farmers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage farmers" ON public.farmers FOR ALL USING (public.is_admin());

-- 21. RLS Policies for buyers
CREATE POLICY "Buyers can view own record" ON public.buyers FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Buyers visible to farmers for orders" ON public.buyers FOR SELECT USING (
  public.is_farmer() AND id IN (
    SELECT buyer_id FROM public.orders WHERE farmer_id = public.get_farmer_id_for_user(auth.uid())
  )
);
CREATE POLICY "Users can create buyer profile" ON public.buyers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Buyers can update own record" ON public.buyers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage buyers" ON public.buyers FOR ALL USING (public.is_admin());

-- 22. RLS Policies for listings
CREATE POLICY "Approved listings visible to all authenticated" ON public.listings FOR SELECT USING (status = 'approved' OR farmer_id = public.get_farmer_id_for_user(auth.uid()) OR public.is_admin());
CREATE POLICY "Farmers can create listings" ON public.listings FOR INSERT WITH CHECK (farmer_id = public.get_farmer_id_for_user(auth.uid()));
CREATE POLICY "Farmers can update own listings" ON public.listings FOR UPDATE USING (farmer_id = public.get_farmer_id_for_user(auth.uid()));
CREATE POLICY "Farmers can delete own listings" ON public.listings FOR DELETE USING (farmer_id = public.get_farmer_id_for_user(auth.uid()));
CREATE POLICY "Admins can manage listings" ON public.listings FOR ALL USING (public.is_admin());

-- 23. RLS Policies for orders
CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (buyer_id = public.get_buyer_id_for_user(auth.uid()));
CREATE POLICY "Farmers can view orders for their listings" ON public.orders FOR SELECT USING (farmer_id = public.get_farmer_id_for_user(auth.uid()));
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (buyer_id = public.get_buyer_id_for_user(auth.uid()));
CREATE POLICY "Buyers can update own orders" ON public.orders FOR UPDATE USING (buyer_id = public.get_buyer_id_for_user(auth.uid()));
CREATE POLICY "Farmers can update orders for their listings" ON public.orders FOR UPDATE USING (farmer_id = public.get_farmer_id_for_user(auth.uid()));
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (public.is_admin());

-- 24. RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (
  buyer_id = public.get_buyer_id_for_user(auth.uid()) OR 
  farmer_id = public.get_farmer_id_for_user(auth.uid()) OR 
  public.is_admin()
);
CREATE POLICY "Admins can manage transactions" ON public.transactions FOR ALL USING (public.is_admin());

-- 25. RLS Policies for reviews
CREATE POLICY "Reviews are publicly readable" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their orders" ON public.reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (reviewer_id = auth.uid());
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- 26. RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL USING (public.is_admin());

-- 27. RLS Policies for audit_logs
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "System can create audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage audit logs" ON public.audit_logs FOR ALL USING (public.is_admin());