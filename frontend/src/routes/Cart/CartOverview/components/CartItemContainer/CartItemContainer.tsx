import { CartItemProps } from "../../../../../types/UserProps.ts";
import CartItem from "./CartItem/CartItem.tsx";

const CartItemContainer = ({ cart }: { cart: CartItemProps[] | null }) => {
  return (
    <ul>
      {cart &&
        cart.map((item) => (
          <li key={item.cartItemId}>
            <CartItem {...item} />
          </li>
        ))}
    </ul>
  );
};

export default CartItemContainer;
