import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { useGetCartQuery } from "./cart/cartSlice";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useCart = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id;
  const { cart, ...rest } = useGetCartQuery(
    { userId },
    {
      selectFromResult: ({ data, ...rest }) => ({
        cart: data && Object.values(data.entities),
        ...rest,
      }),
      skip: !userId,
    }
  );
  return { ...rest, cart };
};
