import {
  getDateInFuture,
  roundToTwoDec,
  useCartTotalQuantity,
  useCartSum,
} from "./cartUtils";
import { CartItem } from "../../types/UserProps";
import { renderHook, waitFor } from "../../testing-utils/index";
import { describe, expect, it, vi } from "vitest";
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
    const cartItems: CartItem[] = mockedCartItems;
    const actualTotalQuantity = cartItems.reduce(
      (acc, current) => acc + current.quantity,
      0
    );
    const { result } = renderHook(() => useCartTotalQuantity(cartItems));
    expect(result.current).toEqual(actualTotalQuantity);
  });

  it("returns 0 if cartItems is empty", () => {
    const cartItems: CartItem[] = [];
    const { result } = renderHook(() => useCartTotalQuantity(cartItems));
    expect(result.current).toEqual(0);
  });
});

describe("useCartSum", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates the sum of prices of all cart items", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        product: { price: 50 },
      }),
    });
    const { result } = renderHook(() => useCartSum(mockedCartItems));

    await waitFor(() => {
      expect(result.current).toEqual(150);
    });
  });

  it("calculates sum with different prices for each cart item", async () => {
    // Mock the fetch responses for each product
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ product: { price: 50 } }), // First cartItem has price 50
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ product: { price: 30 } }), // Second cartItem has price 30
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ product: { price: 70 } }), // Third cartItem has price 70
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ product: { price: 20 } }), // Fourth cartItem has price 20
      });

    const { result } = renderHook(() => useCartSum(mockedCartItems));

    await waitFor(() => {
      expect(result.current).toEqual(340); // (50 * 3) + (30 * 1) + (70 * 2) + (20 * 1) = 340
    });
  });

  it("returns 0 if cartItems is empty", async () => {
    const cartItems: CartItem[] = [];

    const { result } = renderHook(() => useCartSum(cartItems));

    await waitFor(() => {
      expect(result.current).toEqual(0);
    });
  });

  it("handles fetch errors and returns 0 for errored items", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => useCartSum(mockedCartItems));

    await waitFor(() => {
      expect(result.current).toEqual(0); // Expect 0 since fetch failed
    });
  });
});
