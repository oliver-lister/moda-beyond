export interface Address {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface CartItem {
  _id?: string;
  cartItemId: string;
  productId: string;
  color: string;
  size: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: Date | number | undefined;
  address?: Address;
  shoppingPreference: string;
  newsletter: boolean;
  cart: CartItem[];
  createdAt: string;
  updatedAt: string;
}
