import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemProps } from "../../types/UserProps";

// Types
interface CartState {
  items: CartItemProps[];
  totalItems: number;
  isLoading: boolean;
}

interface UpdateQuantityPayload {
  cartItemId: string;
  newQuantity: number;
}

interface UpdateSizePayload {
  cartItemId: string;
  newSize: string;
}

// Initial state
const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  isLoading: false,
};

// Reducers
const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    setCart(state, action: PayloadAction<CartItemProps[]>) {
      state.isLoading = true;
      const newCart = action.payload;
      state.items = newCart;
      state.totalItems = newCart.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      state.isLoading = false;
    },
    addItemToCart(state, action: PayloadAction<CartItemProps>) {
      state.isLoading = true;
      const newItem = action.payload;

      // See if the same item exists in the cart
      const sameItemIndex = state.items.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.color === newItem.color &&
          item.size === newItem.size
      );

      // If it doesn't exist, add the new item
      if (sameItemIndex === -1) {
        state.items.push(newItem);
      } else {
        // If it does exist, update its quantity
        state.items[sameItemIndex].quantity += 1;
      }

      state.totalItems = state.items.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
      state.totalItems = state.items.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
      );
      state.isLoading = false;
    },
    removeItemFromCart(state, action: PayloadAction<string>) {
      state.isLoading = true;
      const itemIdToRemove = action.payload;
      state.items = state.items.filter(
        (item) => item.cartItemId !== itemIdToRemove
      );
      state.totalItems = state.items.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
      state.totalItems = state.items.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
      );
      state.isLoading = false;
    },
    updateSize(state, action: PayloadAction<UpdateSizePayload>) {
      state.isLoading = true;
      const { cartItemId, newSize } = action.payload;
      const itemToUpdateIndex = state.items.findIndex((item: CartItemProps) => {
        return item.cartItemId === cartItemId;
      });

      if (itemToUpdateIndex < 0) throw new Error("Cannot find item to update.");
      const itemToUpdate = state.items[itemToUpdateIndex];

      const sameItemIndex = state.items.findIndex((item, index) => {
        if (index === itemToUpdateIndex) return false;
        return (
          item.productId === itemToUpdate.productId &&
          item.size === newSize &&
          item.color === itemToUpdate.color
        );
      });

      // If same item with same size doesn't exist, amend current item to new Size
      if (sameItemIndex === -1) {
        state.items = state.items.map((item) => {
          if (item.cartItemId === cartItemId) {
            return { ...item, size: newSize };
          }
          return item;
        });
        localStorage.setItem("cart", JSON.stringify(state.items));
        return;
      }

      // If same item with same size does exist, add to its quantity
      const newCart: CartItemProps[] = [];

      state.items.forEach((item, index) => {
        if (index === sameItemIndex) {
          const updatedQuantity =
            Number(item.quantity) + Number(itemToUpdate.quantity);
          newCart.push({
            ...item,
            quantity: updatedQuantity,
          });
        } else if (item.cartItemId !== cartItemId) {
          newCart.push(item);
        }
      });

      state.items = newCart;
      localStorage.setItem("cart", JSON.stringify(state.items));
      state.totalItems = state.items.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
      );
      state.isLoading = false;
    },
    updateQuantity(state, action: PayloadAction<UpdateQuantityPayload>) {
      state.isLoading = true;
      const { cartItemId, newQuantity } = action.payload;

      state.items = state.items.map((item) => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: Number(newQuantity) };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(state.items));
      state.totalItems = state.items.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
      );
      state.isLoading = false;
    },
    clearCart(state) {
      state.isLoading = true;
      state.items = [];
      state.totalItems = 0;
      localStorage.setItem("cart", JSON.stringify([]));
      state.isLoading = false;
    },
  },
});

export const {
  setCart,
  addItemToCart,
  removeItemFromCart,
  updateQuantity,
  updateSize,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
