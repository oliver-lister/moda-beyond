import EmbeddedCheckoutForm from "./components/EmbeddedCheckoutForm";
import { useCartOutletContext } from "../hooks/useCartOutletContext.ts";
import { Button, Group, Stack, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { DeliveryData } from "../Cart.tsx";
import { getDateInFuture } from "../cartUtils.ts";

const Checkout = () => {
  const { cart, user, delivery, deliveryData } = useCartOutletContext();

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Checkout</Title>
        <Button component={Link} to="/cart" bg="black">
          Back to Cart
        </Button>
      </Group>
      <EmbeddedCheckoutForm
        items={cart}
        selectedDelivery={{
          fee: deliveryData[delivery as keyof DeliveryData].fee,
          label: deliveryData[delivery as keyof DeliveryData].label,
          est: getDateInFuture(
            deliveryData[delivery as keyof DeliveryData].estDays
          ),
        }}
        user={user}
      />
    </Stack>
  );
};

export default Checkout;
