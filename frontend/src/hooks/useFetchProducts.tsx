import { useState, useEffect } from "react";
import ProductProps from "../types/ProductProps";
import { useSearchParams } from "react-router-dom";

interface FetchProductsResult {
  products: ProductProps[] | null;
  error: Error | null;
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
            }`
          );
          const productData = await response.json();
          setProducts({ products: productData, error: null });
        } catch (error) {
          console.error("Error fetching products:", error);
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
            }`
          );
          const productData = await response.json();
          setProducts({ products: productData, error: null });
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [searchParams]);

  return { ...products, isLoading };
};
