import { describe, expect, it } from "vitest";
import reducer, {
  CartState,
  addItemToCart,
  clearCart,
  initialCartState,
  removeItemFromCart,
  setCart,
  updateQuantity,
  updateSize,
} from "./cartSlice";
import {
  mockCartItem,
  mockedCartItems,
} from "../../testing-utils/mocks/mockedCartItems";
import { CartItemProps } from "../../types/UserProps";

describe("Cart", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialCartState);
  });

  it("should handle setting the cart", () => {
    const prevState: CartState = {
      items: [],
      totalItems: 0,
      isLoading: false,
    };
    const finalState: CartState = {
      items: [...mockedCartItems],
      totalItems: mockedCartItems.reduce((acc, curr) => acc + curr.quantity, 0),
      isLoading: false,
    };
    expect(reducer(prevState, setCart(mockedCartItems))).toEqual(finalState);
  });

  it("should handle a cartItem being added to an empty cart", () => {
    const prevState: CartState = {
      items: [],
      totalItems: 0,
      isLoading: false,
    };
    const finalState: CartState = {
      items: [mockCartItem],
      totalItems: mockCartItem.quantity,
      isLoading: false,
    };
    expect(reducer(prevState, addItemToCart(mockCartItem))).toEqual(finalState);
  });

  it("should handle a cartItem being removed from an empty cart", async () => {
    const prevState: CartState = {
      items: [mockCartItem],
      totalItems: 3,
      isLoading: false,
    };
    const finalState: CartState = {
      items: [],
      totalItems: 0,
      isLoading: false,
    };
    expect(
      reducer(prevState, removeItemFromCart(mockCartItem.cartItemId))
    ).toEqual(finalState);
  });

  it("should handle a cartItem's size being updated", () => {
    const prevState: CartState = {
      items: [mockCartItem],
      totalItems: 3,
      isLoading: false,
    };
    const updatedmockCartItem: CartItemProps = {
      ...mockCartItem,
      size: "INTL L",
    };
    const finalState: CartState = {
      items: [updatedmockCartItem],
      totalItems: updatedmockCartItem.quantity,
      isLoading: false,
    };
    expect(
      reducer(
        prevState,
        updateSize({ cartItemId: mockCartItem.cartItemId, newSize: "INTL L" })
      )
    ).toEqual(finalState);
  });

  it("should handle same product cartItem objects being merged when one object's size changes to a shared value", () => {
    const prevState: CartState = {
      items: [
        ...mockedCartItems,
        {
          cartItemId: "1a2ef75c-1b67-464f-8945-22c3b3f30f45",
          productId: "8a10249c88550c7d48956qr2",
          size: "UK 12",
          price: 64.75,
          color: "Red",
          quantity: 1,
          _id: "72e9d1a90151d2b5b96df231",
        },
        {
          cartItemId: "1a2ef75c-1b67-464f-8945-22c3b3f30f45",
          productId: "8a10249c88550c7d48956qr2",
          size: "UK 13",
          price: 64.75,
          color: "Red",
          quantity: 1,
          _id: "72e9d1a90151d2b5b9642342",
        },
      ],
      totalItems:
        mockedCartItems.reduce((acc, curr) => acc + curr.quantity, 0) + 2,
      isLoading: false,
    };
    const finalState: CartState = {
      items: [
        ...mockedCartItems,
        {
          cartItemId: "1a2ef75c-1b67-464f-8945-22c3b3f30f45",
          productId: "8a10249c88550c7d48956qr2",
          size: "UK 13",
          price: 64.75,
          color: "Red",
          quantity: 2,
          _id: "72e9d1a90151d2b5b9642342",
        },
      ],
      totalItems: 9,
      isLoading: false,
    };
    expect(
      reducer(
        prevState,
        updateSize({
          cartItemId: "1a2ef75c-1b67-464f-8945-22c3b3f30f45",
          newSize: "UK 13",
        })
      )
    ).toEqual(finalState);
  });

  it("should handle cartItem quantity updates", () => {
    const prevState: CartState = {
      items: [
        ...mockedCartItems,
        {
          cartItemId: "1a2ef75c-1b67-464f-8945-22c3b3f30f45",
          productId: "8a10249c88550c7d48956qr2",
          size: "UK 12",
          price: 64.75,
          color: "Red",
          quantity: 1,
          _id: "72e9d1a90151d2b5b96df231",
        },
      ],
      totalItems:
        mockedCartItems.reduce((acc, curr) => acc + curr.quantity, 0) + 1,
      isLoading: false,
    };
    const finalState: CartState = {
      items: [
        ...mockedCartItems,
        {
          cartItemId: "1a2ef75c-1b67-464f-8945-22c3b3f30f45",
          productId: "8a10249c88550c7d48956qr2",
          size: "UK 12",
          price: 64.75,
          color: "Red",
          quantity: 4,
          _id: "72e9d1a90151d2b5b96df231",
        },
      ],
      totalItems:
        mockedCartItems.reduce((acc, curr) => acc + curr.quantity, 0) + 4,
      isLoading: false,
    };
    expect(
      reducer(
        prevState,
        updateQuantity({
          cartItemId: "1a2ef75c-1b67-464f-8945-22c3b3f30f45",
          newQuantity: 4,
        })
      )
    ).toEqual(finalState);
  });

  it("should handle clearing the cart", () => {
    const prevState: CartState = {
      items: [...mockedCartItems],
      totalItems: mockedCartItems.reduce((acc, curr) => acc + curr.quantity, 0),
      isLoading: false,
    };
    const finalState: CartState = {
      items: [],
      totalItems: 0,
      isLoading: false,
    };
    expect(reducer(prevState, clearCart())).toEqual(finalState);
  });
});
