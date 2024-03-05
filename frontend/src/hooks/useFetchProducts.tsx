import { useState, useEffect } from "react";
import ProductProps from "../types/ProductProps";

export interface Query {
  prop: string;
  value: string | null;
}

interface FetchProductsResult {
  products: ProductProps[] | null;
  error: Error | null;
}

export const useFetchProducts = (initialSortQuery: Query[] | null) => {
  const [products, setProducts] = useState<FetchProductsResult>({
    products: null,
    error: null,
  });
  const [query, setQuery] = useState<Query[] | null>(initialSortQuery);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let queryString = "";

        if (query && query.length > 0) {
          queryString = query
            .map(({ prop, value }) => `${prop}=${value}`)
            .join("&");
        }

        const response = await fetch(
          `http://localhost:3000/products/fetchproducts?${queryString}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const products = await response.json();
        setProducts({ products, error: null });
      } catch (error) {
        setProducts({
          products: [],
          error:
            error instanceof Error ? error : new Error("An error occurred"),
        });
      }
    };
    fetchProducts();
  }, [query]);

  const updateQuery = (newSortQuery: Query[] | null) => {
    setQuery(newSortQuery);
  };

  return { ...products, updateQuery };
};
