import { CartItemProps } from "../../../types/UserProps.ts";
import CartItem from "../CartItem/CartItem.tsx";

const CartItemContainer = ({
  cart,
  isLoading,
}: {
  cart: CartItemProps[] | null;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <div>isLoading...</div>;
  }

  return (
    <ul>
      {cart &&
        cart.map(({ _id, product, color, size, quantity }) => (
          <CartItem
            key={_id}
            product={product}
            color={color}
            size={size}
            quantity={quantity}
          />
        ))}
    </ul>
  );
};

export default CartItemContainer;
