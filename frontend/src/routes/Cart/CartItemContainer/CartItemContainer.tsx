import { CartItemProps } from "../../../types/UserProps.ts";
import CartItem from "./CartItem/CartItem.tsx";

const CartItemContainer = ({ cart }: { cart: CartItemProps[] }) => {
  return (
    <ul>
      {cart.map((item) => (
        <CartItem key={item._id} {...item} />
      ))}
    </ul>
  );
};

export default CartItemContainer;
