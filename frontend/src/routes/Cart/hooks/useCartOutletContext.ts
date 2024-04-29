import { useOutletContext } from "react-router-dom";
import { CartState } from "../../../state/cart/cartSlice";
import { AuthState } from "../../../state/auth/authSlice";
import { DeliveryData } from "../Cart";

type ContextType = {
  cart: CartState;
  auth: AuthState;
  delivery: string;
  handleDeliveryChange: (value: string) => void;
  deliveryData: DeliveryData;
  submitCheckout: () => void;
};

export function useCartOutletContext() {
  return useOutletContext<ContextType>();
}
