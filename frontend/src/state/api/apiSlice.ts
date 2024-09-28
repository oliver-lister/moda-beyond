import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_HOST }),
  tagTypes: ["CartItem", "Auth", "User", "Product", "Size", "Brand"],
  endpoints: () => ({}),
});
