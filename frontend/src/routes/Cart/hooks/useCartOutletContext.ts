import { useOutletContext } from "react-router-dom";
import { CartState } from "../../../state/cart/cartSlice";
import { AuthState } from "../../../state/auth/authSlice";
import { DeliveryData } from "../Cart";
import { UserState } from "../../../state/user/userSlice";

type ContextType = {
  cart: CartState;
  auth: AuthState;
  delivery: string;
  handleDeliveryChange: (value: string) => void;
  deliveryData: DeliveryData;
  user: UserState;
};

export function useCartOutletContext() {
  return useOutletContext<ContextType>();
}
