import { Button, Stack, Group } from "@mantine/core";
import styles from "./ordersummary.module.css";

const OrderSummary = () => {
  return (
    <Stack className={styles.container}>
      <p className={styles.coupon}>
        Do you have a coupon, gift card or THE SHOPPER reward?
      </p>
      <Stack className={styles.summary}>
        <h3>Order Summary</h3>
        <Group justify="space-between">
          <p>{`Product Total (2)`}</p>
          <p>$12</p>
        </Group>
        <Group justify="space-between">
          <p>Delivery</p>
          <p>$25</p>
        </Group>
        <Group justify="space-between" className={styles.total}>
          <p>Total</p>
          <p>$23</p>
        </Group>
        <Button>Checkout</Button>
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
