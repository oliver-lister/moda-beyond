interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export interface CartItemProps {
  _id?: string;
  cartItemId: string;
  productId: string;
  price: number;
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
  dob?: Date;
  address?: Address;
  shoppingPreference: string;
  newsletter: boolean;
  cart: CartItemProps[];
}
