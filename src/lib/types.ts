// AgricLinkChain Type Definitions

export type AppRole = 'farmer' | 'buyer' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type ListingStatus = 'pending' | 'approved' | 'sold_out' | 'rejected';
export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'shipped' | 'delivered' | 'cancelled';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  kyc_bvn: string | null;
  kyc_nin: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Farmer {
  id: string;
  user_id: string;
  farm_name: string;
  farm_description: string | null;
  location: string;
  address: string | null;
  crops: string[] | null;
  verification_status: VerificationStatus;
  verification_documents: string[] | null;
  average_rating: number;
  total_sales: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface Buyer {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string | null;
  location: string;
  address: string | null;
  contact_person: string | null;
  total_orders: number;
  total_spend: number;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  farmer_id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number;
  unit: string;
  quantity: number;
  available_quantity: number;
  images: string[] | null;
  status: ListingStatus;
  harvest_date: string | null;
  created_at: string;
  updated_at: string;
  farmer?: Farmer;
}

export interface Order {
  id: string;
  buyer_id: string;
  listing_id: string;
  farmer_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: OrderStatus;
  delivery_address: string | null;
  notes: string | null;
  accepted_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  listing?: Listing;
  buyer?: Buyer;
  farmer?: Farmer;
}

export interface Transaction {
  id: string;
  order_id: string;
  farmer_id: string;
  buyer_id: string;
  amount: number;
  platform_fee: number;
  farmer_earnings: number;
  status: TransactionStatus;
  payment_method: string | null;
  transaction_reference: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewed_farmer_id: string | null;
  reviewed_buyer_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// Dashboard stats types
export interface FarmerStats {
  totalListings: number;
  activeOrders: number;
  completedSales: number;
  totalEarnings: number;
}

export interface BuyerStats {
  activeOrders: number;
  completedOrders: number;
  totalSpend: number;
}

export interface AdminStats {
  totalFarmers: number;
  totalBuyers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  pendingListings: number;
}
