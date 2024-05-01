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

interface StripeSessionData {
  line_items: {
    amount_total: number;
    quantity: number;
    description: string;
  }[];
  id: string;
  customer_email: string;
  customer_name: string;
  status: "complete" | "open";
  shipping_name: string;
  shipping_address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
  };
  billing_name: string;
  billing_address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
  };
  receipt_url: string;
}

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<StripeSessionData | null>(null);
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
        console.log(session);
        setIsLoading(false);
        setSession(session);
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

  if (isLoading || !session) {
    return (
      <Center mih="50vh">
        <Stack align="center">
          <Text c="violet">Processing Checkout...</Text>
          <Loader />
        </Stack>
      </Center>
    );
  }

  if (session.status === "open") {
    return <Navigate to="/cart/checkout" />;
  }

  if (session.status === "complete") {
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
              Thanks for your order {session.customer_name.split("")[0]}! A
              confirmation email will be sent to{" "}
              <Anchor type="email" href={`mailto: ${session.customer_email}`}>
                {session.customer_email}
              </Anchor>
              .
            </Text>
            <Grid></Grid>
            <Anchor href={session.receipt_url} target="_blank">
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
