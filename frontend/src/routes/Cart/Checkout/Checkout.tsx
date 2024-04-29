import EmbeddedCheckoutForm from "./components/EmbeddedCheckoutForm";
import { useCartOutletContext } from "../hooks/useCartOutletContext.ts";
import { DeliveryData } from "../Cart.tsx";

const Checkout = () => {
  const { cart, delivery, deliveryData } = useCartOutletContext();

  return (
    <>
      <EmbeddedCheckoutForm
        items={cart.items}
        deliveryFee={deliveryData[delivery as keyof DeliveryData].fee}
      />
    </>
  );
};

export default Checkout;
