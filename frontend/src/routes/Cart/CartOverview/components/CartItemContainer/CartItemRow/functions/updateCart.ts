import { CartItem } from "../../../../../../../types/UserProps";

export const updateCart = (
  localCart: CartItem[],
  _id: string,
  value: string,
  fieldToUpdate: string
): CartItem[] => {
  try {
    // Find the item in the local cart and update the specified field
    const updatedCart = localCart.map((item: CartItem) => {
      if (item._id === _id) {
        return { ...item, [fieldToUpdate]: value };
      }
      return item;
    });

    console.log(
      `Cart updated successfully. Updated ${fieldToUpdate} to ${value}`
    );
    return updatedCart;
  } catch (error) {
    console.error("Error updating cart:", error);
    return localCart;
  }
};
