import { useOutletContext } from "react-router-dom";
import { ProductProps } from "../routes/AddProduct/components/AddProductForm";

type ContextType = { products: ProductProps[] | []; isLoading: boolean };

export function useProducts() {
  return useOutletContext<ContextType>();
}
