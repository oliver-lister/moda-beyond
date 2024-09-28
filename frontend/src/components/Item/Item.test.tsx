import { describe, expect, it } from "vitest";
import Item from "./Item";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../testing-utils/render";

describe("Item", () => {
  const renderItem = () =>
    renderWithProviders(
      <Item
        _id={"2a"}
        name="Turtleneck"
        brand="Nike"
        price={20}
        lastPrice={35}
        images={["", ""]}
        category={"men"}
        availableSizes={[]}
        availableColors={[]}
        description={""}
        material={""}
        createdAt={new Date()}
        available={false}
      />
    );

  it("renders correct text based on props", () => {
    renderItem();
    expect(screen.getByTestId("item-container")).toHaveTextContent("Nike");
    expect(screen.getByTestId("item-container")).toHaveTextContent(
      "Turtleneck"
    );
    expect(screen.getByTestId("item-container")).toHaveTextContent("$20");
    expect(screen.getByTestId("item-container")).toContainElement(
      screen.getByRole("img")
    );
  });

  it("renders sale badge if it has a higher lastPrice prop", () => {
    renderItem();
    expect(screen.getByTestId("item-container")).toContainElement(
      screen.getByText("Sale")
    );
  });

  it("doesn't render sale badge if it has a lower lastPrice prop", () => {
    renderWithProviders(
      <Item
        _id={"2a"}
        name="Turtleneck"
        brand="Nike"
        price={20}
        lastPrice={15}
        images={["", ""]}
        category={"men"}
        availableSizes={[]}
        availableColors={[]}
        description={""}
        material={""}
        createdAt={new Date()}
        available={false}
      />
    );
    expect(screen.getByTestId("item-container")).not.toHaveTextContent("Sale");
  });
});
