import {
  Button,
  Stack,
  Container,
  Grid,
  GridCol,
  Alert,
  Center,
  Loader,
} from "@mantine/core";
import { IconTruck } from "@tabler/icons-react";
import styles from "./cart.module.css";
import { Link } from "react-router-dom";
import Delivery from "./Delivery/Delivery.tsx";
import OrderSummary from "./OrderSummary/OrderSummary.tsx";
import { CartItemProps } from "../../types/UserProps.ts";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../state/store.ts";
import { useEffect, useState } from "react";
import ProductProps from "../../types/ProductProps.ts";
import CartItemContainer from "./CartItemContainer/CartItemContainer.tsx";
import { updateCartAsync } from "../../state/auth/authSlice.ts";

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
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItemProps[] | null>(null);
  const [delivery, setDelivery] = useState<string>("standard");

  const handleDeliveryChange = (value: string) => {
    setDelivery(value);
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      if (!cart) throw new Error("No cart exists to remove an item on.");
      const newCart = cart.filter((item) => {
        if (!item._id) throw new Error("Item has no _id field.");
        return item._id.toString() !== cartItemId;
      });
      if (!newCart) throw new Error("newCart is undefined.");
      await dispatch(updateCartAsync(newCart)).unwrap();

      if (!auth.user) throw new Error("No user logged in.");
      setCart(auth.user.cart);
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  const handleUpdateSize = async (cartItemId: string, newSize: string) => {
    try {
      if (!cart) throw new Error("No cart exists to update an item on.");
      const newCart = [...cart];
      const itemIndex = newCart.findIndex((item) => {
        if (!item._id) throw new Error("Item has no _id field.");
        return item._id.toString() === cartItemId;
      });

      if (itemIndex === -1) throw new Error("Item does not exist in the cart.");

      newCart[itemIndex].size = newSize;

      await dispatch(updateCartAsync(newCart)).unwrap();

      if (!auth.user) throw new Error("No user logged in.");
      setCart(auth.user.cart);
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: string
  ) => {
    try {
      if (!cart) throw new Error("No cart exists to update an item on.");
      const newCart = [...cart];
      const itemIndex = newCart.findIndex((item) => {
        if (!item._id) throw new Error("Item has no _id field.");
        return item._id.toString() === cartItemId;
      });

      if (itemIndex === -1) throw new Error("Item does not exist in the cart.");

      newCart[itemIndex].quantity = Number(newQuantity);

      await dispatch(updateCartAsync(newCart)).unwrap();

      if (!auth.user) throw new Error("No user logged in.");
      setCart(auth.user.cart);
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  useEffect(() => {
    const getProductData = async (productId: CartItemProps["productId"]) => {
      try {
        const response = await fetch(
          `http://localhost:3000/products/fetchproductbyid/${productId}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch product data: ${response.statusText}`
          );
        }
        const productData = await response.json();
        return productData as ProductProps;
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    };
    const getCartData = async (cart: CartItemProps[]) => {
      try {
        setIsLoading(true);
        const newCart = await Promise.all(
          cart.map(async (item) => {
            const productData = await getProductData(item.productId);
            if (productData === undefined)
              throw new Error(
                "Could not find product data for " + item.productId
              );
            return { ...item, product: productData };
          })
        );
        setCart(newCart);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
        setIsLoading(false);
      }
    };

    if (!auth.user) {
      return;
    }

    getCartData(auth.user.cart);
  }, [auth]);

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
              <h2 className={styles.heading}>Shopping Cart</h2>
              <Stack gap="xs" className={styles.grid}>
                <p className={styles.sub_heading}>Parcel from The Shopper</p>
                {isLoading || auth.isLoading ? (
                  <Center style={{ height: "40vh" }}>
                    <Loader />
                  </Center>
                ) : cart && cart.length === 0 ? (
                  <Button component={Link} to="/">
                    Start Shopping
                  </Button>
                ) : (
                  <>
                    <Alert
                      title={
                        "Estimated delivery: " +
                        deliveryData[delivery as keyof DeliveryData].due
                      }
                      icon={<IconTruck />}
                      className={styles.alert}
                    />
                    <CartItemContainer
                      cart={cart}
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
            {cart ? (
              <OrderSummary
                cart={cart}
                deliveryFee={deliveryData[delivery as keyof DeliveryData].fee}
              />
            ) : null}
          </GridCol>
        </Grid>
      </Container>
    </section>
  );
};

export default Cart;
