import EmbeddedCheckoutForm from "./components/EmbeddedCheckoutForm";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";

const Checkout = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const auth = useSelector((state: RootState) => state.auth);

  if (auth.isLoading || cart.isLoading) return null;

  return (
    <>
      <EmbeddedCheckoutForm items={cart.items} />
    </>
  );
};

export default Checkout;