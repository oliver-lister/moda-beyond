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
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../state/store.ts";
import { useState } from "react";
import { updateCartAsync } from "../../state/auth/authSlice.ts";
import { CartItemProps } from "../../types/UserProps.ts";

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
  const auth = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [delivery, setDelivery] = useState<string>("standard");

  const handleDeliveryChange = (value: string) => {
    setDelivery(value);
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      if (!user || !user.cart)
        throw new Error("No cart exists to remove an item on.");
      const newCart = user.cart.filter((item: CartItemProps) => {
        if (!item._id) throw new Error("Item has no _id field.");
        return item._id.toString() !== cartItemId;
      });
      if (!newCart) throw new Error("newCart is undefined.");
      await dispatch(updateCartAsync(newCart)).unwrap();
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  const handleUpdateSize = async (cartItemId: string, newSize: string) => {
    try {
      if (!user) throw new Error("Please log in.");
      const cart = user.cart;
      if (!cart) throw new Error("No cart exists to update an item on.");

      const itemToUpdate = cart.find((item) => {
        if (!item._id) throw new Error("Item has no _id field.");
        return item._id.toString() === cartItemId;
      });

      if (!itemToUpdate) throw new Error("Cannot find item to update.");

      const sameItemIndex = cart.findIndex((item) => {
        return (
          item.productId === itemToUpdate.productId &&
          item.size === newSize &&
          item.color === itemToUpdate.color
        );
      });

      let newCart: CartItemProps[] = [];

      // If same item with same size doesn't exist, amend current item to new Size
      if (sameItemIndex === -1) {
        newCart = cart.map((item) => {
          if (!item._id) throw new Error("Item has no _id field.");
          if (item._id.toString() === cartItemId) {
            return { ...item, size: newSize };
          }
          return item;
        });

        await dispatch(updateCartAsync(newCart)).unwrap();
        return;
      }

      // If same item with same size does exist, add to its quantity
      cart.forEach((item, index) => {
        if (!item._id) throw new Error("Item has no _id field.");
        if (index === sameItemIndex) {
          const updatedQuantity =
            Number(item.quantity) + Number(itemToUpdate.quantity);
          newCart.push({
            ...item,
            quantity: updatedQuantity,
          });
        } else if (item._id.toString() !== cartItemId) {
          newCart.push(item);
        }
      });

      await dispatch(updateCartAsync(newCart)).unwrap();
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: string
  ) => {
    try {
      if (!user) throw new Error("Please log in.");
      const cart = user.cart;
      if (!cart) throw new Error("No cart exists to update an item on.");
      const newCart = cart.map((item) => {
        if (!item._id) throw new Error("Item has no _id field.");
        if (item._id.toString() === cartItemId) {
          return { ...item, quantity: Number(newQuantity) };
        }
        return item;
      });

      await dispatch(updateCartAsync(newCart)).unwrap();
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  if (!auth.user && !auth.isLoading) {
    return (
      <section className={styles.cart}>
        <Container size="xl" className={styles.no_items}>
          <div className={styles.no_items_content}>
            <Stack gap="xl">
              <div className={styles.no_items_text}>
                <h2 className={styles.heading}>Shopping Cart</h2>
                <p>You're currently not signed in.</p>
              </div>
              <Button component={Link} to="/login">
                Login
              </Button>
            </Stack>
          </div>
        </Container>
      </section>
    );
  }
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
                ) : user && user.cart && user.cart.length === 0 ? (
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
                      Parcel from The Shopper
                    </p>
                    <Alert
                      title={
                        "Estimated delivery: " +
                        deliveryData[delivery as keyof DeliveryData].due
                      }
                      icon={<IconTruck />}
                      className={styles.alert}
                    />
                    <CartItemContainer
                      cart={auth.user && auth.user.cart}
                      handleRemoveFromCart={handleRemoveFromCart}
                      handleUpdateSize={handleUpdateSize}
                      handleUpdateQuantity={handleUpdateQuantity}
                    />
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
            {!user ? null : user.cart.length === 0 ? null : (
              <OrderSummary
                cart={user.cart}
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
