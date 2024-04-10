import {
  Button,
  Stack,
  Container,
  Grid,
  GridCol,
  Alert,
  Center,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { IconTruck } from "@tabler/icons-react";
import styles from "./cart.module.css";
import { Link } from "react-router-dom";
import Delivery from "./components/Delivery/Delivery.tsx";
import OrderSummary from "./components/OrderSummary/OrderSummary.tsx";
import CartItemContainer from "./components/CartItemContainer/CartItemContainer.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { useState } from "react";

export type DeliveryData = {
  standard: { fee: number; due: string };
  express: { fee: number; due: string };
  pickup: { fee: number; due: string };
};

const deliveryData: DeliveryData = {
  standard: { fee: 16, due: "16th May 2024" },
  express: { fee: 22, due: "16th May 2024" },
  pickup: { fee: 6, due: "16th May 2024" },
};

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const auth = useSelector((state: RootState) => state.auth);
  const [delivery, setDelivery] = useState<string>("standard");

  const handleDeliveryChange = (value: string) => {
    setDelivery(value);
  };

  return (
    <section className={styles.container}>
      <Container size="xl">
        <Grid>
          <GridCol span={{ base: 12, lg: 8 }} className={styles.cart}>
            <Stack className={styles.cart}>
              <Title order={2}>Shopping Cart</Title>
              <Stack gap="xs" className={styles.grid}>
                {auth.isLoading ? (
                  <Center style={{ height: "40vh" }}>
                    <Loader />
                  </Center>
                ) : cart.totalItems === 0 ? (
                  <Center style={{ height: "40vh" }}>
                    <Stack>
                      <Text>You have no items in your shopping cart.</Text>
                      <Button component={Link} to="/">
                        Start Shopping
                      </Button>
                    </Stack>
                  </Center>
                ) : (
                  <>
                    <p className={styles.sub_heading}>
                      Parcel from MØDA-BEYOND
                    </p>
                    <Alert
                      title={
                        "Estimated delivery: " +
                        deliveryData[delivery as keyof DeliveryData].due
                      }
                      icon={<IconTruck />}
                      className={styles.alert}
                    />
                    <CartItemContainer cart={cart.items} />
                    <Delivery
                      delivery={delivery}
                      deliveryData={deliveryData}
                      handleDeliveryChange={handleDeliveryChange}
                    />
                  </>
                )}
              </Stack>
            </Stack>
          </GridCol>
          <GridCol span={{ base: 12, lg: 4 }}>
            {cart.totalItems === 0 ? null : (
              <OrderSummary
                cart={cart.items}
                isLoading={auth.isLoading}
                deliveryFee={deliveryData[delivery as keyof DeliveryData].fee}
              />
            )}
          </GridCol>
        </Grid>
      </Container>
    </section>
  );
};

export default Cart;
