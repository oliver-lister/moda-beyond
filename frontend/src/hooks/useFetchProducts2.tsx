import { useState } from "react";

export const useFetchProducts = () => {
  const [products, setProducts] = useState({
    data: [],
    totalCount: 0,
    isLoading: false,
    error: "",
  });

  const fetchProducts = async (queryString: string) => {
    try {
      setProducts({ ...products, isLoading: true });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/products/fetch?${queryString}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }

      setProducts({
        data: responseData.products,
        totalCount: responseData.totalCount,
        isLoading: false,
        error: "",
      });
    } catch (err) {
      if (err instanceof Error) {
        setProducts({
          data: [],
          isLoading: false,
          totalCount: 0,
          error: err.message,
        });
        console.error("Error fetching products:", err.message);
      }
    }
  };

  return [products, fetchProducts];
};
