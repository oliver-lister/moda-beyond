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
import { IconCheck } from "@tabler/icons-react";
import { StripeSessionData } from "./CheckoutReturnTypes.ts";
import { useClearCartMutation } from "../../../../state/cart/cartSlice.ts";

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [clearCart] = useClearCartMutation();

  const [session, setSession] = useState<StripeSessionData | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Retrieve Session object from Stripe
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
        setSession(session);
        setIsLoading(false);
        await clearCart({}).unwrap();
      } catch (err) {
        if (err instanceof Error) {
          console.log("Error: " + err.message);
          setIsLoading(false);
        }
      }
    };

    if (!sessionId) return;
    getSession(sessionId);
  }, [sessionId, clearCart]);

  // Retrieve receipt url from Stripe API
  useEffect(() => {
    const getReceiptUrl = async (payment_intent: string) => {
      try {
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
        const { receiptUrl } = responseData;
        setReceiptUrl(receiptUrl);
      } catch (err) {
        if (err instanceof Error) {
          console.log("Error: " + err.message);
        }
      }
    };

    if (!session) return;
    getReceiptUrl(session.payment_intent);
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

  // If session was cancelled or had a problem, redirect to cart
  if (session.status === "open") {
    return <Navigate to="/cart" />;
  }

  // Creating query string for Google Maps embedded API
  const GoogleMapsAPIQuery = `${session.shipping_details.address.line1
    .split(" ")
    .join("+")}+${
    session.shipping_details.address.line2
      ? session.shipping_details.address.line2.split(" ").join("+")
      : null
  },${session.shipping_details.address.city}+${
    session.shipping_details.address.state
  }+${session.shipping_details.address.postal_code}`;

  if (session.status === "complete") {
    return (
      <section id="success">
        <Stack>
          <Group justify="space-between" align="center">
            <Title order={1}>Checkout</Title>
            <Button component={Link} to="/">
              Continue Shopping
            </Button>
          </Group>
          <Container>
            <Stack align="center" gap="2rem">
              <Stack align="center">
                <Group>
                  <Title order={2} c="violet">
                    Order Success
                  </Title>
                  <IconCheck color="var(--mantine-color-violet-5)" />
                </Group>
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
                <Stack>
                  {session.line_items.data.map((item, index) => {
                    return (
                      <Group
                        justify="space-between"
                        key={index}
                        style={{
                          borderBottom: "1px solid var(--mantine-color-gray-3)",
                          paddingBottom: "0.5rem",
                        }}
                      >
                        <Text fz={{ base: "xs", sm: "sm", md: "md" }}>
                          {item.quantity}x {item.description}{" "}
                        </Text>
                        <Text fz={{ base: "xs", sm: "sm", md: "md" }}>
                          ${item.amount_total / 100}
                        </Text>
                      </Group>
                    );
                  })}
                </Stack>
                <Group justify="space-between">
                  <Text fw={600} c="violet">
                    Total
                  </Text>
                  <Text fw={600} c="violet">
                    AUD${session.amount_total / 100}
                  </Text>
                </Group>
              </Stack>
              <Stack w="100%">
                <Title order={3}>Shipping Details:</Title>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <Stack>
                    <Box>
                      <Text fw={600} c="violet">
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
                      style={{ border: "none", borderRadius: "0.5rem" }}
                      loading="lazy"
                      width="100%"
                      src={`https://www.google.com/maps/embed/v1/place?key=${
                        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                      }&q=${GoogleMapsAPIQuery}`}
                    />
                  </Center>
                </SimpleGrid>
              </Stack>
              {receiptUrl ? (
                <Anchor href={receiptUrl} target="_blank">
                  View your Stripe Payment Receipt
                </Anchor>
              ) : null}
            </Stack>
          </Container>
        </Stack>
      </section>
    );
  }

  return null;
};

export default CheckoutReturn;
