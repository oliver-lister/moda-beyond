import { describe, expect, it } from "vitest";
import { screen, waitFor } from "../../testing-utils/index";
import Shop from "./Shop";
import "@testing-library/jest-dom";
import { renderWithProviders } from "../../testing-utils/render";

describe("Shop component", () => {
  it("shows loading state before fetch completes, and shows ProductCounter when finished", async () => {
    renderWithProviders(<Shop />);
    // before fetch completes
    expect(screen.getByTestId("productcounter-container")).toHaveTextContent(
      "Loading..."
    );

    // Wait for fetch to complete
    await waitFor(() => {
      // Ensure that the ProductCounter component contains the expected text
      expect(screen.getByTestId("productcounter-text")).toBeInTheDocument();
    });
  });
});
