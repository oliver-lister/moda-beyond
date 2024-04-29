import EmbeddedCheckoutForm from "./components/EmbeddedCheckoutForm";
import { useCartOutletContext } from "../hooks/useCartOutletContext.ts";

const Checkout = () => {
  const { cart, delivery, deliveryData } = useCartOutletContext();

  return (
    <>
      <EmbeddedCheckoutForm
        items={cart.items}
        delivery={delivery}
        deliveryData={deliveryData}
      />
    </>
  );
};

export default Checkout;
