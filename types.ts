
export enum StoreType {
  CoffeeShop = 'coffee_shop',
  Restaurant = 'restaurant',
  MilkTea = 'milk_tea',
  Other = 'other',
}

export enum UserRole {
  Owner = 'owner',
  Manager = 'manager',
  Staff = 'staff',
}

export enum OrderType {
  Pickup = 'pickup',
  DineIn = 'dine_in',
}

export enum OrderStatus {
  Pending = 'pending',
  Preparing = 'preparing',
  Ready = 'ready',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum PaymentStatus {
  Unpaid = 'unpaid',
  Paid = 'paid',
  Refunded = 'refunded',
}

export enum DiscountType {
  Percent = 'percent',
  Fixed = 'fixed',
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: StoreType;
  logo_url: string;
  primary_color: string;
  contact_email: string;
  contact_phone: string;
  address: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  profile: Profile;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  tenant_id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  discount_price?: number;
  is_available: boolean;
}

export interface Customer {
    id: string;
    tenant_id: string;
    name: string;
    phone: string;
    email?: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer: Customer;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  pickup_reservation_at: string;
  guests?: number;
  total: number;
  payment_status: PaymentStatus;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
    id: string;
    menu_item: MenuItem;
    quantity: number;
    line_total: number;
}

export interface Promotion {
    id: string;
    tenant_id: string;
    code: string;
    description: string;
    discount_type: DiscountType;
    discount_value: number;
    min_spend?: number;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
}

export interface Announcement {
    id: string;
    tenant_id: string;
    title: string;
    message: string;
    is_visible: boolean;
}

export interface StoreHour {
    weekday: number; // 0 = Sunday
    open_time?: string;
    close_time?: string;
    is_closed: boolean;
}
