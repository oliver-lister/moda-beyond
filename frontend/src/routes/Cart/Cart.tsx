import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import {
  removeItem,
  updateQuantity,
  updateSize,
  changeDelivery,
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
  Alert,
  Radio,
} from "@mantine/core";
import { IconTrash, IconTruck } from "@tabler/icons-react";
import styles from "./cart.module.css";
import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  if (cart.totalQuantity > 0) {
    return (
      <section className={styles.shopping_cart}>
        <Container size="xl">
          <Grid>
            <GridCol span={{ base: 12, lg: 8 }} className={styles.cart}>
              <Stack className={styles.cart_inner}>
                <h2 className={styles.heading}>Shopping Cart</h2>
                <Stack gap="xs" className={styles.grid}>
                  <p className={styles.sub_heading}>Parcel from The Shopper</p>
                  <Alert
                    title="Estimated delivery: March 2 - 6"
                    icon={<IconTruck />}
                    className={styles.alert}
                  />
                  {cart.items.map((item) => (
                    <div key={item.cartId}>
                      <Grid align="center" className={styles.grid_row}>
                        <GridCol span={{ base: 11, md: 7 }} order={{ base: 1 }}>
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
                        <GridCol
                          span={{ base: 12, md: 4 }}
                          order={{ base: 3, md: 2 }}
                        >
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
                        <GridCol
                          span={{ base: 1, md: 1 }}
                          order={{ base: 2, md: 3 }}
                        >
                          <Stack align="flex-end">
                            <p className={styles.price}>
                              ${item.product.price * item.quantity}
                            </p>
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
                  <Stack className={styles.delivery} gap={0}>
                    <p>Delivery Type</p>
                    <Radio.Group
                      value={cart.deliveryType}
                      onChange={(value: string) =>
                        dispatch(
                          changeDelivery(
                            value as "standard" | "express" | "pickup"
                          )
                        )
                      }
                    >
                      <Group
                        justify="space-between"
                        align="center"
                        className={styles.radio_item}
                      >
                        <Group>
                          <Radio value="standard" id="standard_delivery" />
                          <Stack gap={0}>
                            <label htmlFor="standard_delivery">
                              Standard Delivery
                            </label>
                            <p className={styles.delivery_estimate}>
                              Estimated: Feb 06-22
                            </p>
                          </Stack>
                        </Group>
                        <p>$16</p>
                      </Group>
                      <Group
                        justify="space-between"
                        align="center"
                        className={styles.radio_item}
                      >
                        <Group>
                          <Radio value="express" id="express_delivery" />
                          <Stack gap={0}>
                            <label htmlFor="express_delivery">
                              Express Delivery
                            </label>
                            <p className={styles.delivery_estimate}>
                              Estimated: Feb 06-15
                            </p>
                          </Stack>
                        </Group>
                        <p>$22</p>
                      </Group>
                      <Group
                        justify="space-between"
                        align="center"
                        className={styles.radio_item}
                      >
                        <Group>
                          <Radio value="pickup" id="pickup" />
                          <Stack gap={0}>
                            <label htmlFor="pickup">Pick Up In-store</label>
                            <p className={styles.delivery_estimate}>
                              Collect from THE SHOPPER
                            </p>
                          </Stack>
                        </Group>
                        <p>$6</p>
                      </Group>
                    </Radio.Group>
                  </Stack>
                </Stack>
              </Stack>
            </GridCol>
            <GridCol span={{ base: 12, lg: 4 }} className={styles.checkout}>
              <Stack className={styles.checkout_inner}>
                <p className={styles.coupon}>
                  Hey, you're saving $358.20 on this purchase. Do you have a
                  coupon,gift card orOnePass reward?
                </p>
                <Stack className={styles.summary}>
                  <h3>Order Summary</h3>
                  <Group justify="space-between">
                    <p>{`Product Total (${cart.totalQuantity})`}</p>
                    <p>${cart.productTotal}</p>
                  </Group>
                  <Group justify="space-between">
                    <p>Delivery</p>
                    <p>${cart.deliveryFee}</p>
                  </Group>
                  <Group justify="space-between" className={styles.total}>
                    <p>Total</p>
                    <p>${cart.productTotal + cart.deliveryFee}</p>
                  </Group>
                  <Button>Checkout</Button>
                  <p className={styles.terms}>
                    By checking out, you are agreeing to our Terms and
                    Conditions and to receive marketing communications from us
                    that you can unsubscribe from by the functionality provided
                    for in those communications. To see how we manage your
                    personal information and other details, please see our
                    Privacy Policy and Collection Statement
                  </p>
                </Stack>
              </Stack>
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
