import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadGuestCart, saveGuestCart } from "./utils/cartUtils";
import { CartItem } from "../../types/UserProps";

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState: loadGuestCart() as CartItem[], // Load from localStorage
  reducers: {
    setLocalCart: (_, action: PayloadAction<CartItem[]>) => {
      saveGuestCart(action.payload);
      return action.payload;
    },
    clearLocalCart: (state) => {
      state.length = 0;
      saveGuestCart([]); // Sync to localStorage
    },
  },
});

export const { setLocalCart, clearLocalCart } = guestCartSlice.actions;
export default guestCartSlice.reducer;
