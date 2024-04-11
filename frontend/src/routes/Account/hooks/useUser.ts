import { useOutletContext } from "react-router-dom";
import UserProps from "../../../types/UserProps";

type ContextType = { user: UserProps | null };

export function useUser() {
  return useOutletContext<ContextType>();
}
