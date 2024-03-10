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

const Cart = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [cart, setCart] = useState<CartItemProps[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    if (!user || !cart) {
      setIsLoading(false);
    } else {
      getCartData(user.cart);
    }
  }, [user, cart]);

  if (isLoading) {
    return (
      <Center style={{ height: "80vh" }}>
        <Loader />
      </Center>
    );
  }

  if (!isLoading && !user) {
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

  if (!isLoading && user && user.cart.length === 0) {
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

  if (!isLoading && user && !cart) {
    return <div>whoops... uncaught error here..</div>;
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
                <Alert
                  title="Estimated delivery: March 2 - 6"
                  icon={<IconTruck />}
                  className={styles.alert}
                />
                <CartItemContainer cart={cart} isLoading={isLoading} />
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
};

export default Cart;
