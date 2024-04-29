export interface Address {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface CartItemProps {
  _id?: string;
  cartItemId: string;
  productId: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

export default interface UserProps {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: Date | number | undefined;
  address?: Address;
  shoppingPreference: string;
  newsletter: boolean;
  cart: CartItemProps[];
}
