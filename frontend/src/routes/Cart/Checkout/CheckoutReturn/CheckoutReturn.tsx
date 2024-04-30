import {
  Loader,
  Title,
  Text,
  Center,
  Stack,
  Group,
  Button,
  Anchor,
  Grid,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../state/store.ts";
import { clearCart } from "../../../../state/cart/cartSlice";
import { IconCheck } from "@tabler/icons-react";
import { Stripe } from "@stripe/stripe-js";

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [stripeSession, setStripeSession] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getSession = async (sessionId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_HOST
          }/checkout/get-session/${sessionId}`,
          {
            method: "GET",
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }
        const { session } = responseData;
        setIsLoading(false);
        setStripeSession(session);
      } catch (err) {
        if (err instanceof Error) {
          console.log("Error: " + err.message);
          setIsLoading(false);
        }
      }
    };
    const fetchData = async () => {
      if (!sessionId) return;
      await getSession(sessionId);
    };

    fetchData();
  }, [sessionId]);

  if (isLoading || !stripeSession) {
    return (
      <Center mih="50vh">
        <Loader />
      </Center>
    );
  }

  if (stripeSession.status === "open") {
    return <Navigate to="/cart/checkout" />;
  }

  if (stripeSession.status === "complete") {
    dispatch(clearCart());
    return (
      <section id="success">
        <Stack>
          <Group justify="space-between" align="center">
            <Title order={1}>Checkout</Title>
            <Button component={Link} to="/">
              Continue Shopping
            </Button>
          </Group>
          <Stack align="center">
            <Group>
              <Title order={2} c="violet">
                Order Success
              </Title>
              <IconCheck color="var(--mantine-color-violet-5)" />
            </Group>
            <Text>
              Thanks for your order! A confirmation email will be sent to{" "}
              <Anchor type="email" href={`mailto: ${customerEmail}`}>
                {stripeSession.customerEmail}
              </Anchor>
              .
            </Text>
            <Grid></Grid>
            <Anchor href="https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUDljZXNIOUJpRnJ0NjFjKM7VwrEGMgZRyOp72u46LBbMC3RusXSl0zP6dwv-ZwCKhpdM6erPLipi9ZlQdcw_YaLSzuAwTkwItCfk">
              Click here to view your Stripe payment receipt.
            </Anchor>
          </Stack>
        </Stack>
      </section>
    );
  }

  return null;
};

export default CheckoutReturn;
