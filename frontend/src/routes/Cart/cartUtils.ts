import { format, addDays } from "date-fns";
import { useMemo } from "react";
import { CartItemProps } from "../../types/UserProps";

export const getDateInFuture = (estDays: number) => {
  const currentDate = new Date();
  const futureDate = addDays(currentDate, estDays);
  const formattedDate = format(futureDate, "EEEE, MMMM d, yyyy");
  return formattedDate;
};

export const roundToTwoDec = (num: number) => {
  return Math.round(num * 100) / 100;
};

export const useCartTotalQuantity = (cartItems: CartItemProps[]) => {
  return useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);
};

export const useCartSum = (cartItems: CartItemProps[]) => {
  return useMemo(() => {
    return roundToTwoDec(
      cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  }, [cartItems]);
};
