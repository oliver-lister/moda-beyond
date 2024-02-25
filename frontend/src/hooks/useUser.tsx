import { useState, useEffect } from "react";
import { CartItemProps } from "../types/UserProps";

const useUser = (authToken: string) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/fetchuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching user data");
      }

      const userData = await response.json();
      setUser(userData);
      setCart(userData.cart || []);
    } catch (error) {
      console.error("Fetch user data error:", error);
    }
  };

  const addToCart = async (params: CartItemProps) => {
    try {
      const response = await fetch("http://localhost:3000/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accessToken": authToken,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Error adding product to cart");
      }

      // Refresh user data and cart after adding to cart
      fetchUserData();
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch("http://localhost:3000/removefromcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({
          cartItemId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error removing product from cart");
      }

      // Refresh user data and cart after removing from cart
      fetchUserData();
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  return {
    user,
    cart,
    addToCart,
    removeFromCart,
  };
};

export default useUser;
