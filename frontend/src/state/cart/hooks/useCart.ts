import { useGetCartQuery } from "../../cart/cartSlice";
import { useEffect, useState } from "react";
import { CartItem } from "../../../types/UserProps";
import { useAppSelector } from "../../hooks";

// Reusable useCart hook
export const useCart = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id;

  const {
    cart: userCart,
    isLoading,
    ...rest
  } = useGetCartQuery(
    { userId },
    {
      selectFromResult: ({ data, ...rest }) => ({
        cart: data && Object.values(data.entities),
        ...rest,
      }),
      skip: !userId,
    }
  );

  const [localCart, setLocalCart] = useState<CartItem[]>([]);

  // Fetch localStorage cart if the user cart doesn't exist
  useEffect(() => {
    if (!userCart && !isLoading) {
      const localCart = localStorage.getItem("cart");
      if (localCart) {
        setLocalCart(JSON.parse(localCart));
      }
    } else if (userCart) {
      // Sync user cart to localStorage when available
      localStorage.setItem("cart", JSON.stringify(userCart));
    }
  }, [userCart, isLoading]);

  // Use user cart if available, otherwise use local cart
  const cart = userCart || localCart;

  // Calculate the total number of items in the cart
  const cartTotal = cart
    ? cart.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return { ...rest, isLoading, cart, cartTotal };
};
