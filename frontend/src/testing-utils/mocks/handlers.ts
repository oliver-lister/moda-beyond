import { http } from "msw";
import { mockedProducts } from "./mockedProducts";

export const handlers = [
  // Success handler for products query
  http.get(`${import.meta.env.VITE_BACKEND_HOST}/products/`, () => {
    return new Response(
      JSON.stringify({
        success: true,
        products: mockedProducts,
        totalCount: mockedProducts.length,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  }),

  // Sizes handler
  http.get(`${import.meta.env.VITE_BACKEND_HOST}/products/sizes`, () => {
    return new Response(
      JSON.stringify({
        sizes: ["INTL S", "INTL M", "INTL L", "INTL XL"],
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),

  // Brands handler
  http.get(`${import.meta.env.VITE_BACKEND_HOST}/products/brands`, () => {
    return new Response(
      JSON.stringify({
        brands: ["Nike", "Adidas", "Puma"],
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),
];
