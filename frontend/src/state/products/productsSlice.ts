import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Product from "../../types/product";
import all_product from "../../assets/data/all_products";
import { AppDispatch } from "../store";

interface Products {
  items: Product[];
  loading: boolean;
}

const initialState: Products = {
  items: [],
  loading: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return all_product;
  }
);

// Immediately dispatch the fetchProducts action to load products when the app starts
export const initializeProducts = () => (dispatch: AppDispatch) => {
  dispatch(fetchProducts());
};

export default productsSlice.reducer;
