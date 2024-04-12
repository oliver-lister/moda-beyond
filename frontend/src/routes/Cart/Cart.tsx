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
import { IconShoppingBag, IconTruck } from "@tabler/icons-react";
import styles from "./cart.module.css";
import { Link } from "react-router-dom";
import Delivery from "./components/Delivery/Delivery.tsx";
import OrderSummary from "./components/OrderSummary/OrderSummary.tsx";
import CartItemContainer from "./components/CartItemContainer/CartItemContainer.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { useState } from "react";
import { format, addDays } from "date-fns";

export type DeliveryData = {
  standard: {
    label: string;
    isDelivery: boolean;
    fee: number;
    estDays: number;
  };
  express: { label: string; isDelivery: boolean; fee: number; estDays: number };
  pickup: { label: string; isDelivery: boolean; fee: number; estDays: number };
};

const deliveryData: DeliveryData = {
  standard: {
    label: "Standard Delivery",
    isDelivery: true,
    fee: 16,
    estDays: 7,
  },
  express: { label: "Express Delivery", isDelivery: true, fee: 22, estDays: 4 },
  pickup: { label: "Pick Up In-store", isDelivery: false, fee: 0, estDays: 0 },
};

const getDateInFuture = (estDays: number) => {
  const currentDate = new Date();
  const futureDate = addDays(currentDate, estDays);
  const formattedDate = format(futureDate, "EEEE do MMMM yyyy");
  return formattedDate;
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
                        delivery !== "pickup"
                          ? "Estimated delivery: " +
                            getDateInFuture(
                              deliveryData[delivery as keyof DeliveryData]
                                .estDays
                            )
                          : "Pickup instore"
                      }
                      icon={
                        delivery !== "pickup" ? (
                          <IconTruck />
                        ) : (
                          <IconShoppingBag />
                        )
                      }
                      className={styles.alert}
                    />
                    <CartItemContainer cart={cart.items} />
                    <Delivery
                      delivery={delivery}
                      deliveryData={deliveryData}
                      getDateInFuture={getDateInFuture}
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
