import { SerializedError } from "@reduxjs/toolkit";
import { screen } from "../../../testing-utils/index";
import { mockedProducts } from "../../../testing-utils/mocks/mockedProducts";
import { renderWithProviders } from "../../../testing-utils/render";
import ItemContainer from "./ItemContainer";
import { describe, expect, it } from "vitest";

const error: SerializedError = {
  message: "Error!",
  name: "TestError",
};

describe("ItemContainer component", () => {
  it("renders loading state when isLoading is true", () => {
    renderWithProviders(
      <ItemContainer
        isLoading={true}
        products={mockedProducts}
        error={undefined}
      />
    );
    const loadingSkeletons = screen.getAllByTestId("skeleton");
    expect(loadingSkeletons).toHaveLength(12);
  });

  it("renders error message when error occurs", () => {
    renderWithProviders(
      <ItemContainer isLoading={false} products={[]} error={error} />
    );
    const errorText = screen.getByText(String(error.message));
    expect(errorText).toBeInTheDocument();
  });

  it("renders 'No products found' message when no products are present", () => {
    renderWithProviders(
      <ItemContainer isLoading={false} products={[]} error={undefined} />
    );
    const noProductsFoundText = screen.getByText(
      "No products found for this search query."
    );
    expect(noProductsFoundText).toBeInTheDocument();
  });

  it("renders 12 skeletons while loading", () => {
    renderWithProviders(
      <ItemContainer isLoading={true} products={[]} error={undefined} />
    );
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons).toHaveLength(12);
  });

  it("prioritizes loading state over error when both are true", () => {
    renderWithProviders(
      <ItemContainer isLoading={true} products={[]} error={error} />
    );
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons).toHaveLength(12); // Ensure the loading state takes precedence over error
    expect(screen.queryByText(String(error.message))).not.toBeInTheDocument(); // Error should not be displayed
  });

  it("renders error message instead of 'No products found' when error is present", () => {
    renderWithProviders(
      <ItemContainer isLoading={false} products={[]} error={error} />
    );
    const errorText = screen.getByText(String(error.message));
    expect(errorText).toBeInTheDocument();

    const noProductsText = screen.queryByText(
      "No products found for this search query."
    );
    expect(noProductsText).not.toBeInTheDocument();
  });

  it("renders products when products are present and loading has finished", () => {
    renderWithProviders(
      <ItemContainer
        isLoading={false}
        products={mockedProducts}
        error={undefined}
      />
    );
    const productNames = mockedProducts.map((product) => product.name);
    productNames.forEach((name) => {
      const productName = screen.getByText(name);
      expect(productName).toBeInTheDocument();
    });
  });
});
