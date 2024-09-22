import { useOutletContext } from "react-router-dom";
import { User } from "../types/UserProps";

type ContextType = { data: User | null; isLoading: boolean };

export function useUser() {
  return useOutletContext<ContextType>();
}
