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
import { Button, Select, Stack, Group, Image, Container } from "@mantine/core";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <section>
      <Container size="xl">
        <Stack gap="lg">
          <Stack>
            {cart.map((item) => (
              <div key={item.cartId}>
                <Group>
                  <p>Quantity:</p>
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
                  <Image src={item.product.image[0]} height={100} />
                  <p>
                    {item.product.brand} {item.product.name}
                  </p>
                  <p>${item.product.price * item.quantity}</p>
                  <p>Colour: {item.selectedColor}</p>
                  <p>Size:</p>
                  <Select
                    withAsterisk
                    value={item.size}
                    onChange={(newSize) =>
                      dispatch(
                        updateSize({ cartId: item.cartId, size: newSize })
                      )
                    }
                    data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
                  />
                  <Button onClick={() => dispatch(removeItem(item.cartId))}>
                    Remove
                  </Button>
                </Group>
              </div>
            ))}
          </Stack>
          <Button onClick={() => dispatch(clearCart())}>Clear cart</Button>
        </Stack>
      </Container>
    </section>
  );
};

export default Cart;
