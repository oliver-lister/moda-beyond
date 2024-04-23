import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  renderWithProviders,
  waitFor,
} from "../../../../testing-utils";
import ProductDisplay from "./ProductDisplay";
import ProductProps from "../../../../types/ProductProps";
import { setupStore } from "../../../../state/store";
import { addItemToCart } from "../../../../state/cart/cartSlice";
import { CartItemProps } from "../../../../types/UserProps";
import ProductForm from "./components/ProductForm";

const mockProduct: ProductProps = {
  _id: "231382",
  name: "Raincoat",
  brand: "Nike",
  availableColors: [{ label: "Velvet", hex: "ffffff" }],
  availableSizes: ["UK 23", "UK 13"],
  price: 32,
  images: [""],
};

describe("ProductDisplay", () => {
  it("renders name and brand correctly", () => {
    const { getByTestId } = renderWithProviders(
      <ProductDisplay product={mockProduct} />
    );

    const brandText = getByTestId("product-brand");
    const nameText = getByTestId("product-name");

    expect(brandText).toHaveTextContent("Nike");
    expect(nameText).toHaveTextContent("Raincoat");
  });
  it("dispatches addToCart redux reducer when form is filled in and submit button pressed", async () => {
    const store = setupStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    const { getByTestId, getAllByTestId } = renderWithProviders(
      <ProductForm product={mockProduct} />,
      { store }
    );
    const colorButton = getByTestId("color-input-0");
    const sizeInput = getByTestId("size-input");
    const submitButton = getByTestId("submit-button");

    fireEvent.change(sizeInput, {
      target: { value: 1 },
    });

    expect(sizeInput.value).toBe("1");

    const mockCartItem: CartItemProps = {
      cartItemId: "23",
      productId: "231382",
      price: 32,
      color: "Velvet",
      size: "UK 13",
      quantity: 1,
    };

    fireEvent.click(colorButton);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
