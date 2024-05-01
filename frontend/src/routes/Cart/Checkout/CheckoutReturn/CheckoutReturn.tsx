import {
  Loader,
  Title,
  Text,
  Center,
  Stack,
  Group,
  Button,
  Anchor,
  SimpleGrid,
  Container,
  Box,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../state/store.ts";
import { clearCart } from "../../../../state/cart/cartSlice";
import { IconCheck } from "@tabler/icons-react";

interface LineItem {
  amount_total: number;
  quantity: number;
  description: string;
}

interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

interface StripeSessionData {
  line_items: { data: LineItem[] };
  id: string;
  customer_details: { email: string; name: string };
  status: "complete" | "open";
  shipping_details: { address: Address; name: string };
  amount_total: number;
  payment_intent: string;
}

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<StripeSessionData | null>(null);
  const [charge, setCharge] = useState<Object | null>(null);
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
        setSession(session);
      } catch (err) {
        if (err instanceof Error) {
          console.log("Error: " + err.message);
          setIsLoading(false);
        }
      }
    };

    if (!sessionId) return;
    getSession(sessionId);
  }, [sessionId]);

  useEffect(() => {
    const getCharge = async (payment_intent: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_HOST
          }/checkout/get-charge/${payment_intent}`,
          {
            method: "GET",
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }
        const { charge } = responseData;
        setIsLoading(false);
        setCharge(charge);
      } catch (err) {
        if (err instanceof Error) {
          console.log("Error: " + err.message);
          setIsLoading(false);
        }
      }
    };

    if (!session) return;
    getCharge(session.payment_intent);
  }, [session]);

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

  const GoogleMapsAPIQuery = `${session.shipping_details.address.line1
    .split(" ")
    .join("+")}+${session.shipping_details.address.line2
    .split(" ")
    .join("+")},${session.shipping_details.address.city}+${
    session.shipping_details.address.state
  }+${session.shipping_details.address.postal_code}`;

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
          <Container size="xl">
            <Stack align="center" gap="2rem">
              <Stack align="center">
                <Group>
                  <Title order={2} c="violet">
                    Order Success
                  </Title>
                  <IconCheck color="var(--mantine-color-violet-5)" />
                </Group>
                <Text size="sm" c="gray">
                  PAYMENT ID: {session.id}
                </Text>
                <Text>
                  Thanks for your order{" "}
                  {session.customer_details.name.split(" ")[0]}! A confirmation
                  email will be sent to{" "}
                  <Anchor
                    type="email"
                    href={`mailto: ${session.customer_details.email}`}
                  >
                    {session.customer_details.email}
                  </Anchor>
                  .
                </Text>
              </Stack>
              <Stack w="100%">
                <Title order={3}>Order Summary:</Title>
                <Box>
                  {session.line_items.data.map((item) => {
                    return (
                      <Group justify="space-between">
                        <Text>
                          {item.quantity}x {item.description}{" "}
                        </Text>
                        <Text>${item.amount_total / 100}</Text>
                      </Group>
                    );
                  })}
                </Box>
                <Group justify="space-between">
                  <Text fw={600}>Total</Text>
                  <Text fw={600}>AUD${session.amount_total / 100}</Text>
                </Group>
              </Stack>
              <Stack w="100%">
                <Title order={3}>Shipping Details:</Title>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <Stack>
                    <Box>
                      <Text style={{ textDecoration: "underline" }}>
                        Deliver to:
                      </Text>
                      <Text>{session.shipping_details.name}</Text>
                      <Text>{session.shipping_details.address.line1}</Text>
                      {session.shipping_details.address.line2 ? (
                        <Text>{session.shipping_details.address.line2}</Text>
                      ) : null}
                      <Text>
                        {`${session.shipping_details.address.city}, ${session.shipping_details.address.state} ${session.shipping_details.address.postal_code}`}
                      </Text>
                    </Box>
                  </Stack>
                  <Center>
                    <iframe
                      style={{ border: "none" }}
                      loading="lazy"
                      width="100%"
                      src={`https://www.google.com/maps/embed/v1/place?key=${
                        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                      }&q=${GoogleMapsAPIQuery}`}
                    />
                  </Center>
                </SimpleGrid>
              </Stack>
              <Anchor href={charge.receipt_url} target="_blank">
                Click here to view your Stripe payment receipt.
              </Anchor>
            </Stack>
          </Container>
        </Stack>
      </section>
    );
  }

  return null;
};

export default CheckoutReturn;
