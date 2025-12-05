// Application constants

export const APP_NAME = 'IMS';
export const APP_FULL_NAME = 'Inventory Management System';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PROFILE: '/profile',
  CLIENTS: '/clients',
  WAREHOUSES: '/warehouses',
  PRODUCTS: '/products',
  STOCKS: '/stocks',
  TRANSACTIONS: '/transactions',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const TRANSACTION_TYPES = {
  SALE: 'sale',
  RETURN: 'return',
  EXCHANGE: 'exchange',
  ARRIVAL: 'arrival',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'cempleted', // Note: API has typo
  CANCELLED: 'cancelled',
} as const;

export const USER_ROLES = {
  SUPERUSER: 'superuser',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'stuff', // Note: API has typo
} as const;
