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
import {
  Button,
  Select,
  Stack,
  Group,
  Image,
  Container,
  Grid,
  GridCol,
  Center,
  Flex,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import styles from "./cart.module.css";
import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  if (cart.length > 0) {
    return (
      <section className={styles.cart}>
        <Container size="xl">
          <Grid>
            <GridCol span={8}>
              <Stack gap="lg">
                <h2 className={styles.heading}>Shopping Cart</h2>
                <Stack className={styles.grid}>
                  {cart.map((item) => (
                    <div key={item.cartId}>
                      <Grid align="center" className={styles.grid_row}>
                        <GridCol span={7}>
                          <Link
                            to={`/product/${item.product.id}`}
                            className={styles.link}
                          >
                            <Group wrap="nowrap">
                              <Image
                                src={item.product.image[0]}
                                height={100}
                                className={styles.image}
                              />
                              <Stack gap="sm">
                                <p className={styles.title}>
                                  {item.product.brand} {item.product.name}
                                </p>
                                <p className={styles.color}>
                                  Colour: {item.selectedColor}
                                </p>
                              </Stack>
                            </Group>
                          </Link>
                        </GridCol>
                        <GridCol span={4}>
                          <Group>
                            <Select
                              className={styles.select}
                              label="Size"
                              value={item.size}
                              onChange={(newSize) =>
                                dispatch(
                                  updateSize({
                                    cartId: item.cartId,
                                    size: newSize,
                                  })
                                )
                              }
                              data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
                            />
                            <Select
                              className={styles.select}
                              label="Quantity"
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
                          </Group>
                        </GridCol>
                        <GridCol span={1}>
                          <Stack align="flex-end">
                            <p>${item.product.price * item.quantity}</p>
                            <button
                              className={styles.remove}
                              onClick={() => dispatch(removeItem(item.cartId))}
                            >
                              <IconTrash />
                            </button>
                          </Stack>
                        </GridCol>
                      </Grid>
                    </div>
                  ))}
                </Stack>
                <Button onClick={() => dispatch(clearCart())}>
                  Clear cart
                </Button>
              </Stack>
            </GridCol>
            <GridCol span={4}>
              <div>Hello!</div>
            </GridCol>
          </Grid>
        </Container>
      </section>
    );
  } else {
    return (
      <section className={styles.cart}>
        <Container size="xl" className={styles.no_items}>
          <div className={styles.no_items_content}>
            <Stack gap="xl">
              <div className={styles.no_items_text}>
                <h2 className={styles.heading}>Shopping Cart</h2>
                <p>You have no items in your shopping cart.</p>
              </div>
              <Button component={Link} to="/">
                Start Shopping
              </Button>
            </Stack>
          </div>
        </Container>
      </section>
    );
  }
};

export default Cart;
