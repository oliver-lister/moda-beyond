import { Button, Stack, Group, Center, Loader } from "@mantine/core";
import styles from "./ordersummary.module.css";
import { CartItemProps } from "../../../../types/UserProps";

const OrderSummary = ({
  cart,
  deliveryFee,
  isLoading,
}: {
  cart: CartItemProps[];
  deliveryFee: number;
  isLoading: boolean;
}) => {
  const cartSum = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const cartTotalQuantity = () =>
    cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Stack className={styles.container}>
      <p className={styles.coupon}>
        Do you have a coupon, gift card or THE SHOPPER reward?
      </p>
      <Stack className={styles.summary}>
        <h3>Order Summary</h3>
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <>
            <Group justify="space-between">
              <p>{`Product Total (${cartTotalQuantity()})`}</p>
              <p>${cartSum()}</p>
            </Group>
            <Group justify="space-between">
              <p>Delivery</p>
              <p>${deliveryFee}</p>
            </Group>
            <Group justify="space-between" className={styles.total}>
              <p>Total</p>
              <p>${cartSum() + deliveryFee}</p>
            </Group>
            <Button>Checkout</Button>
          </>
        )}
        <p className={styles.terms}>
          By checking out, you are agreeing to our Terms and Conditions and to
          receive marketing communications from us that you can unsubscribe from
          by the functionality provided for in those communications. To see how
          we manage your personal information and other details, please see our
          Privacy Policy and Collection Statement
        </p>
      </Stack>
    </Stack>
  );
};

export default OrderSummary;
