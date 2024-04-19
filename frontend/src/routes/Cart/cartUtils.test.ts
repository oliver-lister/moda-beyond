import {
  getDateInFuture,
  roundToTwoDec,
  useCartTotalQuantity,
  useCartSum,
} from "./cartUtils";
import { CartItemProps } from "../../types/UserProps";
import { renderHook } from "../../testing-utils/index";
import { describe, expect, it } from "vitest";
import { mockedCartItems } from "../../testing-utils/mocks/mockedCartItems";

describe("getDateInFuture", () => {
  it("returns the correct formatted future date", () => {
    const estDays = 7; // 7 days in the future
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + estDays);
    const formattedDate = getDateInFuture(estDays);
    const expectedFormattedDate = expectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    expect(formattedDate).toEqual(expectedFormattedDate);
  });
});

describe("roundToTwoDec", () => {
  it("rounds a number to two decimal places", () => {
    const num = 123.456789;
    const roundedNum = roundToTwoDec(num);
    expect(roundedNum).toEqual(123.46);
  });
});

describe("useCartTotalQuantity", () => {
  it("calculates the total quantity of cart items", () => {
    const cartItems: CartItemProps[] = mockedCartItems;
    const actualTotalQuantity = cartItems.reduce(
      (acc, current) => acc + current.quantity,
      0
    );
    const { result } = renderHook(() => useCartTotalQuantity(cartItems));
    expect(result.current).toEqual(actualTotalQuantity);
  });

  it("returns 0 if cartItems is empty", () => {
    const cartItems: CartItemProps[] = [];
    const { result } = renderHook(() => useCartTotalQuantity(cartItems));
    expect(result.current).toEqual(0);
  });
});

describe("useCartSum", () => {
  it("calculates the sum of prices of all cart items", () => {
    const cartItems: CartItemProps[] = mockedCartItems;
    const { result } = renderHook(() => useCartSum(cartItems));
    const actualCartSum = roundToTwoDec(
      cartItems.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      )
    );
    expect(result.current).toEqual(actualCartSum);
  });

  it("returns 0 if cartItems is empty", () => {
    const cartItems: CartItemProps[] = [];
    const { result } = renderHook(() => useCartSum(cartItems));
    expect(result.current).toEqual(0);
  });
});
