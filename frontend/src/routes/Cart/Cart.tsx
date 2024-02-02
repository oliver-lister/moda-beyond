import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import {
  removeItem,
  updateQuantity,
  updateSize,
  clearCart,
} from "../../state/cart/cartSlice";
import { Button } from "@mantine/core";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <section>
      {cart.map((item) => (
        <div key={item.cartId}>
          <p>{item.product.name}</p>
          <Button onClick={() => dispatch(removeItem(item.cartId))}>
            Remove
          </Button>
        </div>
      ))}
    </section>
  );
};

export default Cart;
