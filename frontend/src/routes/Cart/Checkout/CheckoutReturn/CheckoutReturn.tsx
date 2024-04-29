import { Loader, Title, Text, Center } from "@mantine/core";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../state/store.ts";
import { clearCart } from "../../../../state/cart/cartSlice";

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
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
        const { status, customer_email } = responseData;
        setIsLoading(false);
        setStatus(status);
        setCustomerEmail(customer_email);
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

  if (isLoading) {
    return (
      <Center mih="50vh">
        <Loader />
      </Center>
    );
  }

  if (status === "open") {
    return <Navigate to="/cart/checkout" />;
  }

  if (status === "complete") {
    dispatch(clearCart());
    return (
      <section id="success">
        <Title order={1}>Order Success</Title>
        <Text>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}.
        </Text>
      </section>
    );
  }

  return null;
};

export default CheckoutReturn;
