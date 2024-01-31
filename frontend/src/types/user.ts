import Product from "./product";

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export default interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number;
  address?: Address;
  cart: Product[];
}
