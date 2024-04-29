import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { CartItemProps } from "../../../../types/UserProps";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  `pk_test_51P9cesH9BiFrt61cpSPsP4N7SgM6iRQl5TQyLjgHMJG5afyvSj1N6ERbtxApQO2ENdQ72EwMksArhXASm4kSPxPA00covoS7Bt`
);

const EmbeddedCheckoutForm = ({ items }: { items: CartItemProps[] }) => {
  const navigate = useNavigate();

  const fetchClientSecret = async () => {
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
        navigate("/cart");
      }
    }
  };

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};

export default EmbeddedCheckoutForm;
