import { shallowEqual, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { useEffect } from "react";
import { setCart, updateDBCartAsync } from "../state/cart/cartSlice";
import { AuthState } from "../state/auth/authSlice";
import { UserState } from "../state/user/userSlice";

// Custom hook for managing cart logic
const useCartSync = (
  auth: AuthState,
  user: UserState,
  dispatch: AppDispatch
) => {
  const cart = useSelector((state: RootState) => state.cart.items, {
    equalityFn: shallowEqual,
  });

  useEffect(() => {
    const localCart = localStorage.getItem("cart");

    // If no user is logged in and localStorage is empty, rely on default cart [].
    if (!user.data && !localCart) return;

    // If user is logged in, access cart in database
    if (user.data) {
      dispatch(setCart(user.data.cart));
      // If localStorage cart exists, use that
    } else if (localCart) {
      dispatch(setCart(JSON.parse(localCart)));
    }
  }, [user.data, dispatch]);

  useEffect(() => {
    // if user is logged in, and there's a change to the cart - update the database
    if (auth.isAuthenticated) {
      dispatch(updateDBCartAsync(cart));
    }
  }, [cart, auth.isAuthenticated, dispatch]);

  return cart;
};

export default useCartSync;
