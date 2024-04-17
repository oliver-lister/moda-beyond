import { useOutletContext } from "react-router-dom";
import UserProps from "../types/UserProps";

type ContextType = { data: UserProps | null; isLoading: boolean };

export function useUser() {
  return useOutletContext<ContextType>();
}
