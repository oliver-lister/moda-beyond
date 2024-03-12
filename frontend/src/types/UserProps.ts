import ProductProps from "./ProductProps";

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export interface CartItemProps {
  _id?: string;
  productId: string;
  product?: ProductProps;
  color: string | null;
  size: string | null;
  quantity: number;
}

export default interface UserProps {
  _id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: string;
  address?: Address;
  shoppingPreference: string;
  newsletter: boolean;
  cart: CartItemProps[];
}
