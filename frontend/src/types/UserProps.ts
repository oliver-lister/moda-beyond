import ProductProps from "./ProductProps";

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export default interface UserProps {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthday?: string;
  shoppingPreference: string;
  age?: number;
  address?: Address;
  cart: ProductProps[];
}
