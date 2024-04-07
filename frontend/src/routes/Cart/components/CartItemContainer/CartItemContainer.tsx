import { CartItemProps } from "../../../../types/UserProps.ts";
import CartItem from "./CartItem/CartItem.tsx";

const CartItemContainer = ({
  cart,
  handleRemoveFromCart,
  handleUpdateSize,
  handleUpdateQuantity,
}: {
  cart: CartItemProps[] | null;
  handleRemoveFromCart: (cartItemId: string) => void;
  handleUpdateSize: (cartItemId: string, newSize: string) => void;
  handleUpdateQuantity: (cartItemId: string, newQuantity: string) => void;
}) => {
  return (
    <ul>
      {cart &&
        cart.map((item) => (
          <CartItem
            key={item._id}
            {...item}
            handleRemoveFromCart={handleRemoveFromCart}
            handleUpdateSize={handleUpdateSize}
            handleUpdateQuantity={handleUpdateQuantity}
          />
        ))}
    </ul>
  );
};

export default CartItemContainer;
