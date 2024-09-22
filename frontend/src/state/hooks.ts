import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { useGetCartQuery } from "./cart/cartSlice";
import { CartItem } from "../types/UserProps";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useCart = () => {
  const userId = useAppSelector((state: RootState) => state.auth.user?._id);
  const cartQuery = useGetCartQuery({ userId }, { skip: !userId });

  console.log(cartQuery);

  // Safely transform the normalized cart result into an array of entities
  const cart = cartQuery.data
    ? Object.values(cartQuery.data.entities).filter(
        (item): item is CartItem => !!item
      )
    : [];

  return { ...cartQuery, cart };
};
