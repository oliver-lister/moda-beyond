import { useOutletContext } from "react-router-dom";
import { AuthState } from "../../../state/auth/authSlice";
import { DeliveryData } from "../Cart";
import { UserState } from "../../../state/user/userSlice";
import { CartItem } from "../../../types/UserProps";

type ContextType = {
  cart: CartItem[];
  auth: AuthState;
  delivery: string;
  handleDeliveryChange: (value: string) => void;
  deliveryData: DeliveryData;
  user: UserState;
};

export function useCartOutletContext() {
  return useOutletContext<ContextType>();
}
