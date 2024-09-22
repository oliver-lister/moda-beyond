import { format, addDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
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

export const useCartSum = (cartItems: CartItem[]) => {
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch product prices and calculate the total sum
  useEffect(() => {
    const fetchProduct = async (productId: string) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_HOST}/products/${productId}`
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }

        const { product } = responseData;
        return product.price;
      } catch (error) {
        console.error("Error fetching product:", error);
        return 0;
      }
    };

    const calculateCartSum = async () => {
      try {
        const total = await Promise.all(
          cartItems.map(async (item) => {
            const price = await fetchProduct(item.productId);
            return Number(price) * item.quantity;
          })
        );

        const cartSum = total.reduce((acc, itemTotal) => acc + itemTotal, 0);
        setCartTotal(roundToTwoDec(cartSum));
      } catch (error) {
        console.error("Error calculating cart total:", error);
      }
    };

    if (cartItems.length > 0) {
      calculateCartSum(); // Trigger calculation when cart items change
    }
  }, [cartItems]);

  return cartTotal;
};
