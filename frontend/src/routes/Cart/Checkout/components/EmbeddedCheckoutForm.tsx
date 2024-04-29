import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { CartItemProps } from "../../../../types/UserProps";

const EmbeddedCheckoutForm = ({ items }: { items: CartItemProps[] }) => {
  const stripePromise = loadStripe(
    `pk_test_51P9cesH9BiFrt61cpSPsP4N7SgM6iRQl5TQyLjgHMJG5afyvSj1N6ERbtxApQO2ENdQ72EwMksArhXASm4kSPxPA00covoS7Bt`
  );

  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/checkout/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items,
          }),
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }
      const { client_secret } = responseData;
      return client_secret;
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error: " + err.message);
      }
    }
  }, []);

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};

export default EmbeddedCheckoutForm;
