import { CartItem } from "../../../types/UserProps";
import { v4 as uuidv4 } from "uuid";

export const loadGuestCart = () => {
  const cart = localStorage.getItem("guestCart");
  return cart ? JSON.parse(cart) : [];
};

export const saveGuestCart = (cart: CartItem[]) => {
  localStorage.setItem("guestCart", JSON.stringify(cart));
};

export interface ShallowCartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export const isMatching = (
  item: CartItem | ShallowCartItem,
  newItem: CartItem | ShallowCartItem
) =>
  String(item.productId) === String(newItem.productId) &&
  item.size === newItem.size &&
  item.color === newItem.color;

export const addItemToLocalCart = (
  cart: CartItem[],
  newItem: ShallowCartItem
): CartItem[] => {
  const existingItemIndex = cart.findIndex((item: CartItem) =>
    isMatching(item, newItem)
  );

  if (existingItemIndex !== -1) {
    return cart.map((item) =>
      isMatching(item, newItem)
        ? { ...item, quantity: item.quantity + newItem.quantity }
        : item
    );
  }

  return [...cart, { ...newItem, cartItemId: uuidv4() }];
};

export const updateItemInLocalCart = (
  cart: CartItem[],
  updatedItem: CartItem
): CartItem[] => {
  const updatedCart = cart.map((item: CartItem) =>
    updatedItem.cartItemId === item.cartItemId ? updatedItem : item
  );

  const consolidatedCart: CartItem[] = [];

  updatedCart.forEach((item: CartItem) => {
    const existingItemIndex = consolidatedCart.findIndex((i) =>
      isMatching(i, item)
    );

    if (existingItemIndex !== -1) {
      consolidatedCart[existingItemIndex].quantity += Number(item.quantity);
    } else {
      consolidatedCart.push(item);
    }
  });

  return consolidatedCart;
};

export const removeItemFromLocalCart = (
  cart: CartItem[],
  itemId: string
): CartItem[] => {
  return cart.filter((item) => item.cartItemId !== itemId);
};
