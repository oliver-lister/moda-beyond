import {
  useAddCartItemMutation,
  useClearCartMutation,
  useDeleteCartItemMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
} from "../cartSlice";
import { CartItem } from "../../../types/UserProps";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addItemToLocalCart,
  generateId,
  removeItemFromLocalCart,
  ShallowCartItem,
  updateItemInLocalCart,
} from "../utils/cartUtils";
import { clearLocalCart, setLocalCart } from "../guestCartSlice";

export const useCart = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id;
  const guestCart = useAppSelector((state) => state.guestCart);
  const dispatch = useAppDispatch();

  const {
    cart: serverCart,
    isLoading,
    ...rest
  } = useGetCartQuery(
    { userId },
    {
      selectFromResult: ({ data, ...rest }) => ({
        cart: data && Object.values(data.entities),
        ...rest,
      }),
      skip: !userId,
    }
  );

  // Calculate cart based on whether serverCart or localCart is available
  const cart = serverCart || guestCart;

  // Calculate total quantity of items in the active cart
  const cartTotal = cart.reduce((acc, item) => acc + item.quantity, 0);

  // For logged-in users, use RTK Query mutations
  const [addItemToServerCart] = useAddCartItemMutation();
  const [updateItemInServerCart] = useUpdateCartItemMutation();
  const [deleteItemFromServerCart] = useDeleteCartItemMutation();
  const [clearServerCart] = useClearCartMutation();

  // For guests (not logged-in users), mutate localCart
  const addItemToCart = async (newItem: ShallowCartItem) => {
    if (userId) {
      // Call RTK Query mutation if the user is logged in
      try {
        await addItemToServerCart({
          userId,
          newItem: { ...newItem, cartItemId: generateId() },
        }).unwrap();
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    } else {
      // Otherwise, modify the local cart
      dispatch(setLocalCart(addItemToLocalCart(guestCart, newItem)));
    }
  };

  const updateItemInCart = async (updatedItem: CartItem) => {
    if (userId) {
      // Use RTK Query mutation for logged-in users
      try {
        await updateItemInServerCart({
          userId,
          updatedItem,
        }).unwrap();
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    } else {
      // Otherwise, update the local cart
      dispatch(setLocalCart(updateItemInLocalCart(guestCart, updatedItem)));
    }
  };

  const removeItemFromCart = async (cartItemId: string) => {
    if (userId) {
      // Use RTK Query mutation for logged-in users
      try {
        await deleteItemFromServerCart({ userId, cartItemId }).unwrap();
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    } else {
      // Otherwise, remove the item from the local cart
      dispatch(setLocalCart(removeItemFromLocalCart(guestCart, cartItemId)));
    }
  };

  const clearCart = async () => {
    if (userId) {
      try {
        await clearServerCart({ userId }).unwrap();
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    } else {
      dispatch(clearLocalCart());
    }
  };

  return {
    ...rest,
    isLoading,
    cart,
    cartTotal,
    addItemToCart,
    updateItemInCart,
    removeItemFromCart,
    clearCart,
  };
};
