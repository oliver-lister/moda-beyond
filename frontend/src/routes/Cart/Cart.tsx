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
import { Button, Select } from "@mantine/core";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <section>
      {cart.map((item) => (
        <div key={item.cartId}>
          <Select
            withAsterisk
            value={`${item.quantity}`}
            onChange={(newQuantity) => {
              dispatch(
                updateQuantity({
                  cartId: item.cartId,
                  quantity: Number(newQuantity),
                })
              );
            }}
            data={["1", "2", "3", "4", "5"]} // Add more options as needed
          />
          <Select
            withAsterisk
            value={item.size}
            onChange={(newSize) =>
              dispatch(updateSize({ cartId: item.cartId, size: newSize }))
            }
            data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
          />
          <p>{item.product.name}</p>
          <p>{item.size}</p>
          <p>{item.selectedColor}</p>
          <Button onClick={() => dispatch(removeItem(item.cartId))}>
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={() => dispatch(clearCart())}>Clear cart</Button>
    </section>
  );
};

export default Cart;
