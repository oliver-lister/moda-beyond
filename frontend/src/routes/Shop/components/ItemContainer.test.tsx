import { screen } from "../../../testing-utils/index";
import { renderWithProviders } from "../../../testing-utils/render";
import ItemContainer from "./ItemContainer";
import { describe, expect, it } from "vitest";

describe("ItemContainer component", () => {
  it("renders loading state when isLoading is true", () => {
    renderWithProviders(
      <ItemContainer isLoading={true} products={null} error="" />
    );
    const loadingSkeletons = screen.getAllByTestId("skeleton");
    expect(loadingSkeletons).toHaveLength(12);
  });

  it("renders error message when error occurs", () => {
    const errorMessage = "An error occurred";
    renderWithProviders(
      <ItemContainer isLoading={false} products={null} error={errorMessage} />
    );
    const errorText = screen.getByText(errorMessage);
    expect(errorText).toBeInTheDocument();
  });

  it("renders 'No products found' message when no products are present", () => {
    renderWithProviders(
      <ItemContainer isLoading={false} products={[]} error="" />
    );
    const noProductsFoundText = screen.getByText(
      "No products found for this search query."
    );
    expect(noProductsFoundText).toBeInTheDocument();
  });

  it("renders products when products are present and loading has finished", () => {
    const products = [
      {
        _id: "1",
        name: "Product 1",
        brand: "Brand 1",
        price: 20,
        images: [""],
      },
      {
        _id: "2",
        name: "Product 2",
        brand: "Brand 1",
        price: 20,
        images: [""],
      },
    ];
    renderWithProviders(
      <ItemContainer isLoading={false} products={products} error="" />
    );
    const productNames = products.map((product) => product.name);
    productNames.forEach((name) => {
      const productName = screen.getByText(name);
      expect(productName).toBeInTheDocument();
    });
  });
});
