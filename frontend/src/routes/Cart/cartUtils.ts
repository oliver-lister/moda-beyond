import { format, addDays } from "date-fns";
import { useMemo } from "react";
import { CartItem } from "../../types/UserProps";

export const getDateInFuture = (estDays: number) => {
  const currentDate = new Date();
  const futureDate = addDays(currentDate, estDays);
  const formattedDate = format(futureDate, "EEEE, MMMM d, yyyy");
  return formattedDate;
};

export const roundToTwoDec = (num: number) => {
  return Math.round(num * 100) / 100;
};

export const useCartTotalQuantity = (cartItems: CartItem[]) => {
  return useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);
};

// fix price $5
export const useCartSum = (cartItems: CartItem[]) => {
  return useMemo(() => {
    return roundToTwoDec(
      cartItems.reduce((acc, item) => acc + 5 * item.quantity, 0)
    );
  }, [cartItems]);
};
