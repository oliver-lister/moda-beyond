import {
  Button,
  Stack,
  Grid,
  GridCol,
  Alert,
  Center,
  Text,
  Title,
  Loader,
} from "@mantine/core";
import { IconShoppingBag, IconTruck } from "@tabler/icons-react";
import styles from "../cart.module.css";
import { Link } from "react-router-dom";
import Delivery from "./components/Delivery/Delivery.tsx";
import CartItemContainer from "./components/CartItemContainer/CartItemContainer.tsx";
import {
  getDateInFuture,
  roundToTwoDec,
  useCartSum,
  useCartTotalQuantity,
} from "../cartUtils.ts";
import { useCartOutletContext } from "../hooks/useCartOutletContext.ts";
import { DeliveryData } from "../Cart.tsx";
import OrderSummary from "./components/OrderSummary/OrderSummary.tsx";

const CartOverview = () => {
  const { cart, delivery, handleDeliveryChange, deliveryData, isLoading } =
    useCartOutletContext();

  // Cart Totalling Functions

  const cartTotalQuantity = useCartTotalQuantity(cart);
  const cartSum = useCartSum(cart);
  const deliveryFee = deliveryData[delivery as keyof DeliveryData].fee;
  const cartSumWithDelivery = cartSum + deliveryFee;

  return (
    <Grid>
      <GridCol span={{ base: 12, lg: 8 }} className={styles.cart}>
        <Stack className={styles.cart}>
          <Title order={2}>Shopping Cart</Title>
          <Stack gap="xs" className={styles.grid}>
            {!isLoading && cart.length === 0 ? (
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
                {isLoading ? (
                  <Center style={{ height: "40vh" }}>
                    <Stack>
                      <Loader />
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
                    <CartItemContainer cart={cart} />
                    <Delivery
                      delivery={delivery}
                      deliveryData={deliveryData}
                      getDateInFuture={getDateInFuture}
                      handleDeliveryChange={handleDeliveryChange}
                    />
                  </>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </GridCol>
      <GridCol span={{ base: 12, lg: 4 }}>
        {cart.length === 0 ? null : (
          <OrderSummary
            cartSum={cartSum}
            cartSumWithDelivery={cartSumWithDelivery}
            cartTotalQuantity={cartTotalQuantity}
            roundToTwoDec={roundToTwoDec}
            deliveryFee={deliveryData[delivery as keyof DeliveryData].fee}
          />
        )}
      </GridCol>
    </Grid>
  );
};

export default CartOverview;
