export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'gluten-free';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  tags: string[];
  dietary: DietaryType;
  isChefSpecial?: boolean;
  available?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  instructions?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  orderType: 'delivery' | 'takeaway';
  deliveryAddress?: string;
  notes?: string;
  paymentMethod: 'cash_on_delivery' | 'upi_on_delivery' | 'pay_at_restaurant';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  taxesAndService: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
  smsSentLog?: string[];
}

export type ReservationStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Approved'
  | 'Rejected'
  | 'Cancelled'
  | 'Completed';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seating: 'Main Dining Room' | 'Private Dining Suite' | 'Outdoor Terrace' | "Chef's Counter";
  occasion?: string;
  specialRequests?: string;
  offerName?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt?: string;
  smsSentLog?: string[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  ordersCount: number;
  reservationsCount: number;
  totalSpent: number;
  lastActive: string;
}

export type NotificationType =
  | 'new_order'
  | 'new_reservation'
  | 'failed_payment'
  | 'cancelled_order'
  | 'new_customer';

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  referenceId?: string;
}

export interface AdminSettings {
  adminPhone: string;
  autoSmsCustomer: boolean;
  autoSmsAdmin: boolean;
  mongodbConfigured: boolean;
  twilioConfigured: boolean;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  text: string;
  rating: number;
  date: string;
  verifiedGuest?: boolean;
}

export interface SpecialOffer {
  id: string;
  title: string;
  badge: string;
  description: string;
  image: string;
  badgeColor: 'secondary' | 'primary';
  buttonText: string;
}

