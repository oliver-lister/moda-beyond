import EmbeddedCheckoutForm from "./components/EmbeddedCheckoutForm";
import { useCartOutletContext } from "../hooks/useCartOutletContext.ts";

const Checkout = () => {
  const { cart, user, delivery, deliveryData } = useCartOutletContext();

  return (
    <>
      <EmbeddedCheckoutForm
        items={cart.items}
        delivery={delivery}
        deliveryData={deliveryData}
        user={user}
      />
    </>
  );
};

export default Checkout;
