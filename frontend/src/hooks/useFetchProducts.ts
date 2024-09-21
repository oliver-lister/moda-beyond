import { useState } from "react";
import ProductProps from "../types/ProductProps";

type FetchProducts = {
  data: ProductProps[];
  totalCount: number;
  isLoading: boolean;
  error: string;
};

export const useFetchProducts = () => {
  const [products, setProducts] = useState<FetchProducts>({
    data: [],
    totalCount: 0,
    isLoading: false,
    error: "",
  });

  const fetchProducts = async (queryString: string): Promise<void> => {
    try {
      setProducts({ ...products, isLoading: true });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/products?${queryString}`
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }

      setProducts({
        data: responseData.data,
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

  return [products, fetchProducts] as const;
};
