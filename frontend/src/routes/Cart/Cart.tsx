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
import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { useEffect, useState } from "react";
import ProductProps from "../../types/ProductProps.ts";
import CartItemContainer from "./CartItemContainer/CartItemContainer.tsx";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItemProps[] | null>(null);
  const [delivery, setDelivery] = useState<string>("standard");

  const handleDeliveryChange = (value: string) => {
    setDelivery(value);
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

  if (isLoading || auth.isLoading) {
    return (
      <Center style={{ height: "80vh" }}>
        <Loader />
      </Center>
    );
  }

  if (!isLoading && !auth.user) {
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

  if (!isLoading && auth.user && auth.user.cart.length === 0) {
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
  if (cart) {
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
                    title={
                      "Estimated delivery: " +
                      deliveryData[delivery as keyof DeliveryData].due
                    }
                    icon={<IconTruck />}
                    className={styles.alert}
                  />
                  <CartItemContainer cart={cart} />
                  <Delivery
                    delivery={delivery}
                    deliveryData={deliveryData}
                    handleDeliveryChange={handleDeliveryChange}
                  />
                </Stack>
              </Stack>
            </GridCol>
            <GridCol span={{ base: 12, lg: 4 }}>
              <OrderSummary
                cart={cart}
                deliveryFee={deliveryData[delivery as keyof DeliveryData].fee}
              />
            </GridCol>
          </Grid>
        </Container>
      </section>
    );
  }
};

export default Cart;
