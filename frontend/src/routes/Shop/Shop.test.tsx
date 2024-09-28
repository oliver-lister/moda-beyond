import { renderWithProviders } from "../../testing-utils/render";
import { screen, waitFor } from "@testing-library/react";
import Shop from "./Shop";
import { mockedProducts } from "../../testing-utils/mocks/mockedProducts";
import { server } from "../../testing-utils/mocks/server";
import { http } from "msw";

describe("Shop component", () => {
  // Test for loading state
  it("renders loading skeleton when fetching products", () => {
    renderWithProviders(<Shop />);
    const loadingSkeletons = screen.getAllByTestId("skeleton");
    loadingSkeletons.forEach((skeleton) => {
      expect(skeleton).toBeInTheDocument();
    });
  });

  // Test for successful data fetch
  it("renders products after fetching successfully", async () => {
    renderWithProviders(<Shop />);

    await waitFor(() => {
      const productNames = screen.getAllByTestId("product-name");
      expect(productNames).toHaveLength(mockedProducts.length);
      mockedProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });
  });

  it("displays an error message if products API call fails", async () => {
    // Force an error response for this test
    server.use(
      http.get(`${import.meta.env.VITE_BACKEND_HOST}/products/`, () => {
        return new Response(
          JSON.stringify({ success: false, error: "Internal Server Error" }),
          { status: 500 }
        );
      })
    );

    renderWithProviders(<Shop />);

    await waitFor(() => {
      expect(screen.getByText(/Error!/i)).toBeInTheDocument();
    });
  });
});

describe("Sizes API handler", () => {
  it("successfully fetches sizes and displays them in filter form", async () => {
    renderWithProviders(<Shop />);

    await waitFor(() => {
      // Select checkboxes by their testid
      const sizeCheckboxes = [
        screen.getByTestId("checkbox-INTL S"),
        screen.getByTestId("checkbox-INTL M"),
        screen.getByTestId("checkbox-INTL L"),
        screen.getByTestId("checkbox-INTL XL"),
      ];

      // Ensure the correct number of checkboxes is rendered
      expect(sizeCheckboxes).toHaveLength(4);

      expect(screen.getByText("INTL S")).toBeInTheDocument();
      expect(screen.getByText("INTL M")).toBeInTheDocument();
      expect(screen.getByText("INTL L")).toBeInTheDocument();
      expect(screen.getByText("INTL XL")).toBeInTheDocument();
    });
  });
});

describe("Brands API handler", () => {
  it("successfully fetches brands and displays them in filter form", async () => {
    renderWithProviders(<Shop />);

    await waitFor(() => {
      const brandCheckboxes = [
        screen.getByTestId("checkbox-Puma"),
        screen.getByTestId("checkbox-Nike"),
        screen.getByTestId("checkbox-Adidas"),
      ];

      // Ensure the correct number of checkboxes is rendered
      expect(brandCheckboxes).toHaveLength(3);

      expect(screen.getByText("Puma")).toBeInTheDocument();
      expect(screen.getByText("Nike")).toBeInTheDocument();
      expect(screen.getByText("Adidas")).toBeInTheDocument();
    });
  });
});
