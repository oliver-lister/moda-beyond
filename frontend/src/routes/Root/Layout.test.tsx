import { waitFor } from "@testing-library/react";
import Layout from "./Layout";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../testing-utils/render";
import { setupStore } from "../../state/store";
import { refreshAccessTokenAsync } from "../../state/auth/authSlice";
import { setCart } from "../../state/cart/cartSlice";
import UserProps from "../../types/UserProps";
import { mockedCartItems } from "../../testing-utils/mocks/mockedCartItems";

describe("Layout", () => {
  afterEach(() => {
    // Reset mocked localStorage
    vi.clearAllMocks();

    // Clear any localStorage changes
    localStorage.clear();
  });

  it("sets user isAuthenticated to false if supplied with invalid refreshToken", async () => {
    const store = setupStore();
    const dummyRefreshToken = "invalidToken";
    store.dispatch(refreshAccessTokenAsync(dummyRefreshToken));
    renderWithProviders(<Layout />, { store });

    expect(store.getState().auth.isLoading).toBe(true);
    expect(store.getState().auth.isAuthenticated).toBe(false);

    // wait for Loading state to be false
    await waitFor(() => {
      expect(store.getState().auth.isLoading).toBe(false);
    });

    // check reset of default states on failed authentication
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.accessToken).toBe("");
    expect(store.getState().auth.refreshToken).toBe("");
    expect(store.getState().auth.userId).toBe(null);
  });

  it("does not dispatch setCart if no localStorage or user isn't logged in", () => {
    const store = setupStore();
    const mockLocalStorage = (() => {
      let store = {} as Storage;

      return {
        getItem(key: string) {
          return store[key];
        },

        setItem(key: string, value: string) {
          store[key] = value;
        },

        removeItem(key: string) {
          delete store[key];
        },

        clear() {
          store = {} as Storage;
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });

    const dispatchSpy = vi.spyOn(store, "dispatch");

    renderWithProviders(<Layout />, { store });

    expect(store.getState().cart.items).toStrictEqual([]);
    expect(dispatchSpy).not.toBeCalled();
  });

  it("uses cart items in localStorage if user isn't logged in", () => {
    const store = setupStore();
    const mockLocalStorage = (() => {
      let store = {} as Storage;

      return {
        getItem(key: string) {
          return store[key];
        },

        setItem(key: string, value: string) {
          store[key] = value;
        },

        removeItem(key: string) {
          delete store[key];
        },

        clear() {
          store = {} as Storage;
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });

    const mockCart = [
      {
        cartItemId: "e4c7d585-38c7-4187-8ffa-604026fd454f",
        productId: "660299ecd64e6c5891d85368",
        size: "INTL L",
        price: 1199,
        color: "Dorado",
        quantity: 1,
        _id: "662259411d3603329949ada3",
      },
    ];

    mockLocalStorage.setItem("cart", JSON.stringify(mockCart));

    const dispatchSpy = vi.spyOn(store, "dispatch");

    renderWithProviders(<Layout />, { store });

    expect(store.getState().user.data).toBe(null);
    expect(store.getState().cart.items).toStrictEqual(mockCart);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it("uses cart items in user.data store if user is logged in", () => {
    const mockLocalStorage = (() => {
      let store = {} as Storage;

      return {
        getItem(key: string) {
          return store[key];
        },

        setItem(key: string, value: string) {
          store[key] = value;
        },

        removeItem(key: string) {
          delete store[key];
        },

        clear() {
          store = {} as Storage;
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });
    const mockUserCart = [
      {
        cartItemId: "e4c7d585-38c7-4187-8ffa-604026fd454f",
        productId: "660299ecd64e6c5891d85368",
        size: "INTL L",
        price: 1199,
        color: "Dorado",
        quantity: 1,
        _id: "662259411d3603329949ada3",
      },
    ];
    const mockUser: UserProps = {
      cart: mockUserCart,
      _id: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      shoppingPreference: "",
      newsletter: false,
    };
    const store = setupStore({
      user: {
        data: mockUser,
        isLoading: false,
      },
    });
    // Mocking Local Storage, to make sure it isn't used.
    const mockLocalStorageCart = [...mockUserCart, ...mockedCartItems];
    mockLocalStorage.setItem("cart", JSON.stringify(mockLocalStorageCart));

    const dispatchSpy = vi.spyOn(store, "dispatch");

    renderWithProviders(<Layout />, { store });

    expect(store.getState().user.data).toStrictEqual(mockUser);
    expect(store.getState().cart.items).toStrictEqual(mockUserCart);
    expect(dispatchSpy).toHaveBeenCalledWith(setCart(mockUserCart));
    expect(dispatchSpy).not.toHaveBeenCalledWith(setCart(mockLocalStorageCart));
  });
});
