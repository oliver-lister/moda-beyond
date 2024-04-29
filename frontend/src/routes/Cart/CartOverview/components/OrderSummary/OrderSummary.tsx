import {
  Stack,
  Group,
  Center,
  Loader,
  Title,
  Text,
  Button,
} from "@mantine/core";
import styles from "./ordersummary.module.css";
import { Link } from "react-router-dom";
import { AuthState } from "../../../../../state/auth/authSlice";

const OrderSummary = ({
  cartSumWithDelivery,
  cartTotalQuantity,
  cartSum,
  deliveryFee,
  isLoading,
  auth,
}: {
  cartSumWithDelivery: number;
  cartTotalQuantity: number;
  cartSum: number;
  deliveryFee: number;
  isLoading: boolean;
  auth: AuthState;
}) => {
  return (
    <Stack className={styles.container}>
      <Text fw={600} ta="center">
        Do you have a coupon, gift card or MØDA-BEYOND reward?
      </Text>
      <Stack className={styles.summary}>
        <Title order={2}>Order Summary</Title>
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <>
            <Group justify="space-between">
              <Text>{`Product Total (${cartTotalQuantity})`}</Text>
              <Text>${cartSum}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Delivery</Text>
              <Text>${deliveryFee}</Text>
            </Group>
            <Group justify="space-between" className={styles.total}>
              <Text>Total</Text>
              <Text>${cartSumWithDelivery}</Text>
            </Group>
            <Button
              component={Link}
              disabled={auth.isLoading}
              to="/cart/checkout"
            >
              Checkout
            </Button>
          </>
        )}
        <Text fz="0.7rem" fw={400}>
          By checking out, you are agreeing to our Terms and Conditions and to
          receive marketing communications from us that you can unsubscribe from
          by the functionality provided for in those communications. To see how
          we manage your personal information and other details, please see our
          Privacy Policy and Collection Statement
        </Text>
      </Stack>
    </Stack>
  );
};

export default OrderSummary;
