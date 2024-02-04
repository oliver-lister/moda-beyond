import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ProductProps from "../../types/ProductProps";
import { v4 as uuidv4 } from "uuid"; // Import uuid

interface CartItem {
  cartId?: string;
  product: ProductProps;
  selectedColor: string | null;
  size: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  productTotal: number;
  totalQuantity: number;
  deliveryFee: number;
  deliveryType: "standard" | "express" | "pickup";
}

const deliveryFees = {
  standard: 16,
  express: 22,
  pickup: 6,
};

const initialState: CartState = {
  items: [],
  productTotal: 0,
  totalQuantity: 0,
  deliveryFee: deliveryFees["standard"],
  deliveryType: "standard",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === newItem.product.id &&
          item.size === newItem.size &&
          item.selectedColor === newItem.selectedColor
      );
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        // If item doesn't exist, add a new item
        state.items.push({ ...newItem, cartId: uuidv4() });
      }
      cartSlice.caseReducers.updateTotals(state);
    },

    removeItem: (state, action: PayloadAction<CartItem["cartId"]>) => {
      const cartId = action.payload;
      state.items = state.items.filter((item) => item.cartId !== cartId);
      cartSlice.caseReducers.updateTotals(state);
    },
    updateSize: (
      state,
      action: PayloadAction<{
        cartId: CartItem["cartId"];
        size: CartItem["size"];
      }>
    ) => {
      const { cartId, size } = action.payload;

      const itemToUpdateIndex = state.items.findIndex(
        (item) => item.cartId === cartId
      );

      if (itemToUpdateIndex !== -1) {
        // Check if item we're updating exists
        const updatedItem = { ...state.items[itemToUpdateIndex], size };

        const matchingItemIndex = state.items.findIndex(
          (item) =>
            item.product.id === updatedItem.product.id &&
            item.size === updatedItem.size &&
            item.selectedColor === updatedItem.selectedColor
        );

        if (matchingItemIndex !== -1) {
          // If matching item exists, update its quantity and delete the duplicate.
          state.items[matchingItemIndex].quantity += updatedItem.quantity;
          state.items.splice(itemToUpdateIndex, 1);
        } else {
          // If matching item doesn't exist, update the item
          state.items[itemToUpdateIndex] = updatedItem;
        }
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        cartId: CartItem["cartId"];
        quantity: CartItem["quantity"];
      }>
    ) => {
      const { cartId, quantity } = action.payload;

      const itemToUpdateIndex = state.items.findIndex(
        (item) => item.cartId === cartId
      );

      if (itemToUpdateIndex !== -1) {
        // Check if item we're updating exists
        const updatedItem = { ...state.items[itemToUpdateIndex], quantity };

        state.items[itemToUpdateIndex] = updatedItem;
      }
      cartSlice.caseReducers.updateTotals(state);
    },
    changeDelivery: (
      state,
      action: PayloadAction<"standard" | "express" | "pickup">
    ) => {
      const deliveryType = action.payload;
      state.deliveryFee = deliveryFees[deliveryType];
      state.deliveryType = deliveryType;
    },
    updateTotals: (state) => {
      state.productTotal = state.items.reduce(
        (acc, currentItem) =>
          acc + currentItem.product.price * currentItem.quantity,
        0
      );
      state.totalQuantity = state.items.reduce(
        (acc, currentItem) => acc + currentItem.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  changeDelivery,
  updateSize,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
