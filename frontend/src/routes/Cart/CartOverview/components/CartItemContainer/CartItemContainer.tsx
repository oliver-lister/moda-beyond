import { CartItem } from "../../../../../types/UserProps.ts";
import CartItemRow from "./CartItemRow/CartItemRow.tsx";

const CartItemContainer = ({ cart }: { cart: CartItem[] | null }) => {
  return (
    <ul>
      {cart &&
        cart.map((item) => (
          <li key={item._id}>
            <CartItemRow {...item} />
          </li>
        ))}
    </ul>
  );
};

export default CartItemContainer;
