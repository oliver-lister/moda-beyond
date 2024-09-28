import { useOutletContext } from "react-router-dom";
import { User } from "../../../types/UserProps";

type ContextType = { user: User };

export function useUser() {
  return useOutletContext<ContextType>();
}
