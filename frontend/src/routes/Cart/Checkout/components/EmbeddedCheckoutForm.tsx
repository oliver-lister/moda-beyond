import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { CartItemProps } from "../../../../types/UserProps";
import { useNavigate } from "react-router-dom";
import { DeliveryData } from "../../Cart";
import { getDateInFuture } from "../../cartUtils.ts";
import { UserState } from "../../../../state/user/userSlice.ts";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EmbeddedCheckoutForm = ({
  items,
  delivery,
  deliveryData,
  user,
}: {
  items: CartItemProps[];
  delivery: string;
  deliveryData: DeliveryData;
  user: UserState;
}) => {
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
            delivery: {
              fee: deliveryData[delivery as keyof DeliveryData].fee,
              label: deliveryData[delivery as keyof DeliveryData].label,
              est: getDateInFuture(
                deliveryData[delivery as keyof DeliveryData].estDays
              ),
              customer_email: user.data?.email,
            },
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