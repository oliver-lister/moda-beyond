import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "../../../../testing-utils";
import ProductDisplay from "./ProductDisplay";
import ProductProps from "../../../../types/ProductProps";
import { setupStore } from "../../../../state/store";
import { CartItem } from "../../../../types/UserProps";
import ProductForm from "./components/ProductForm";

const mockProduct: ProductProps = {
  _id: "231382",
  name: "Raincoat",
  brand: "Nike",
  availableColors: [{ label: "Velvet", hex: "ffffff" }],
  availableSizes: ["UK 23", "UK 13"],
  price: 32,
  images: [""],
  category: "men",
  description: "",
  material: "",
  createdAt: new Date(),
  available: true,
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

  it("selects UK 13 option", async () => {
    const store = setupStore();
    const mockAddToCart = vi.fn();
    renderWithProviders(
      <ProductForm product={mockProduct} handleAddToCart={mockAddToCart} />,
      { store }
    );

    // Click Select to open the options list
    await userEvent.click(screen.getByPlaceholderText("Pick a size..."));

    // Get option by its label and click it
    await userEvent.click(screen.getByRole("option", { name: "UK 13" }));

    // Verify that the option is selected
    expect(screen.getByRole("textbox")).toHaveValue("UK 13");
    expect(document.querySelector('input[name="size"]')).toHaveValue("UK 13");
  });

  it("dispatches addToCart function when form is filled in and submit button pressed", async () => {
    const store = setupStore();
    const mockAddToCart = vi.fn();
    const { getByTestId } = renderWithProviders(
      <ProductForm product={mockProduct} handleAddToCart={mockAddToCart} />,
      { store }
    );
    const colorButton = getByTestId("color-input-0");
    const submitButton = getByTestId("submit-button");

    fireEvent.click(colorButton);

    // Click Select to open the options list
    await userEvent.click(screen.getByPlaceholderText("Pick a size..."));

    // Get option by its label and click it
    await userEvent.click(screen.getByRole("option", { name: "UK 13" }));

    fireEvent.click(submitButton);

    // expect error state to not be shown
    expect(getByTestId("form-container")).not.toHaveTextContent(
      "Please pick a size."
    );

    const mockCartItem: CartItem = {
      cartItemId: "23",
      productId: "231382",
      color: "Velvet",
      size: "UK 13",
      quantity: 1,
    };

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(
        mockCartItem.quantity,
        mockCartItem.size,
        mockCartItem.color
      );
    });
  });
});
