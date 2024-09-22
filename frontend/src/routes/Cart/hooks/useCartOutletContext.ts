import { useOutletContext } from "react-router-dom";
import { AuthState } from "../../../state/auth/authSlice";
import { DeliveryData } from "../Cart";
import { CartItem, User } from "../../../types/UserProps";

type ContextType = {
  cart: CartItem[];
  auth: AuthState;
  delivery: string;
  handleDeliveryChange: (value: string) => void;
  deliveryData: DeliveryData;
  user: User;
  isLoading: boolean;
};

export function useCartOutletContext() {
  return useOutletContext<ContextType>();
}
