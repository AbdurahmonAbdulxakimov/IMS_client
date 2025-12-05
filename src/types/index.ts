// API Types based on Swagger definitions

export interface User {
  user_uuid: string;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: 'superuser' | 'admin' | 'manager' | 'stuff';
  status: boolean;
  last_login?: string;
  created_date: string;
}

export interface Client {
  client_uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registration_date: string;
}

export interface ProductCategory {
  category_uuid: string;
  name: string;
  description: string;
}

export interface Product {
  product_uuid: string;
  name: string;
  description: string;
  prime_cost: string;
  price: string;
  category: ProductCategory;
}

export interface Warehouse {
  warehouse_uuid: string;
  name: string;
  description?: string;
  location: string;
  total_capacity: number;
  available_capacity: number;
}

export interface Stock {
  stock_uuid: string;
  quantity_on_stock: number;
  minimum_stock_level: number;
  maximum_stock_level: number;
  last_updated: string;
  warehouse: Warehouse;
  product: Product;
}

export interface Transaction {
  transaction_uuid: string;
  transaction_type: 'sale' | 'return' | 'exchange' | 'arrival';
  quantity: number;
  unit_price: string;
  total_amount: string;
  status: 'pending' | 'cempleted' | 'cancelled';
  transaction_time: string;
  stock: Stock;
  client: Client;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
