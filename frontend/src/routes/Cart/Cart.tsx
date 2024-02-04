import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { Button, Stack, Container, Grid, GridCol, Alert } from "@mantine/core";
import { IconTruck } from "@tabler/icons-react";
import styles from "./cart.module.css";
import { Link } from "react-router-dom";
import CartItem from "./CartItem/CartItem.tsx";
import Delivery from "./Delivery/Delivery.tsx";
import OrderSummary from "./OrderSummary/OrderSummary.tsx";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);

  if (cart.totalQuantity > 0) {
    return (
      <section className={styles.container}>
        <Container size="xl">
          <Grid>
            <GridCol span={{ base: 12, lg: 8 }} className={styles.cart}>
              <Stack className={styles.cart}>
                <h2 className={styles.heading}>Shopping Cart</h2>
                <Stack gap="xs" className={styles.grid}>
                  <p className={styles.sub_heading}>Parcel from The Shopper</p>
                  <Alert
                    title="Estimated delivery: March 2 - 6"
                    icon={<IconTruck />}
                    className={styles.alert}
                  />
                  <ul>
                    {cart.items.map((item) => (
                      <CartItem
                        cartId={item.cartId}
                        image={item.product.image[0]}
                        productId={item.product.id}
                        brand={item.product.brand}
                        name={item.product.name}
                        selectedColor={item.selectedColor}
                        size={item.size}
                        quantity={item.quantity}
                        price={item.product.price}
                      />
                    ))}
                  </ul>
                  <Delivery />
                </Stack>
              </Stack>
            </GridCol>
            <GridCol span={{ base: 12, lg: 4 }}>
              <OrderSummary />
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
