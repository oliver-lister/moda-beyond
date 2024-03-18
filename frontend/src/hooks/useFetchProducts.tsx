import { useState, useEffect } from "react";
import ProductProps from "../types/ProductProps";
import { useSearchParams } from "react-router-dom";

interface FetchProductsResult {
  products: ProductProps[] | null;
  error: string | null;
}

export const useFetchProducts = () => {
  const [products, setProducts] = useState<FetchProductsResult>({
    products: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    if (searchParams.get("search")) {
      const searchProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/products/searchproducts${
              searchParams ? "?" + searchParams.toString() : ""
            }`,
            {
              method: "GET",
            }
          );
          const responseData = await response.json();

          if (!response.ok) {
            setProducts({
              products: null,
              error: `${responseData.error}, ${responseData.errorCode}`,
            });
            throw new Error(`${responseData.error}, ${responseData.errorCode}`);
          }

          const { products } = responseData;
          setProducts({ products: products, error: null });
        } catch (err) {
          if (err instanceof Error)
            console.error("Error fetching products:", err.message);
        } finally {
          setIsLoading(false);
        }
      };
      searchProducts();
    } else {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/products/fetchproducts${
              searchParams ? "?" + searchParams.toString() : ""
            }`,
            {
              method: "GET",
            }
          );
          const responseData = await response.json();

          if (!response.ok) {
            setProducts({
              products: null,
              error: `${responseData.error}, ${responseData.errorCode}`,
            });
            throw new Error(`${responseData.error}, ${responseData.errorCode}`);
          }

          const { products } = responseData;
          setProducts({ products: products, error: null });
        } catch (err) {
          if (err instanceof Error)
            console.error("Error fetching products:", err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [searchParams]);

  return { ...products, isLoading };
};
