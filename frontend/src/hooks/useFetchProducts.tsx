import { useState, useEffect } from "react";
import ProductProps from "../types/ProductProps";
import { useSearchParams } from "react-router-dom";

interface FetchProductsResult {
  products: ProductProps[] | null;
  totalCount: number;
  error: string | null;
}

export const useFetchProducts = (queryString?: string | undefined) => {
  const [products, setProducts] = useState<FetchProductsResult>({
    products: null,
    totalCount: 0,
    error: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async (query: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_HOST}/products/fetch${
            query ? "?" + query : ""
          }`,
          {
            method: "GET",
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          setProducts({
            products: null,
            totalCount: 0,
            error: `${responseData.error}, ${responseData.errorCode}`,
          });
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }

        const { products, totalCount } = responseData;
        setProducts({
          products: products,
          totalCount: totalCount,
          error: null,
        });
      } catch (err) {
        if (err instanceof Error)
          console.error("Error fetching products:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (searchParams.toString() !== "") {
      fetchProducts(searchParams.toString());
    } else if (queryString) {
      fetchProducts(queryString);
    }
  }, [searchParams, queryString]);

  return { ...products, isLoading };
};
