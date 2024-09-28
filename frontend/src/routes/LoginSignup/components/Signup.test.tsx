import { describe, expect, it, vi } from "vitest";
import Signup from "./Signup";
import { fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../../testing-utils";

const validMockValues = {
  email: "test@example.com",
  password: "Okl180792!",
  firstName: "John",
  lastName: "Doe",
  dob: new Date("1990-01-01"),
  newsletter: true,
  shoppingPreference: "Womenswear",
};

describe("Signup Component", () => {
  const mockDispatch = vi.fn();

  it("displays error text when user submits with invalid values", async () => {
    const { getByLabelText, getByTestId, queryByText } = renderWithProviders(
      <Signup dispatchValues={mockDispatch} />
    );
    const invalidMockValues = {
      email: "testexample.com",
      password: "Okl1807922",
      firstName: "",
      lastName: "Doe",
      dob: new Date("1990-01-01"),
      newsletter: true,
      shoppingPreference: "Jeremy",
    };

    const { email, password, lastName, dob } = invalidMockValues;

    fireEvent.change(getByLabelText("Email", { exact: false }), {
      target: { value: email },
    });
    fireEvent.change(getByLabelText("Password", { exact: false }), {
      target: { value: password },
    });
    fireEvent.change(getByLabelText("Last Name", { exact: false }), {
      target: { value: lastName },
    });
    fireEvent.change(getByLabelText("Birthday", { exact: false }), {
      target: { value: dob },
    });

    fireEvent.click(getByTestId("signup-button"));

    await waitFor(() => {
      expect(queryByText("Please enter a valid email address")).toBeTruthy();
      expect(
        queryByText(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
      ).toBeTruthy();
      expect(queryByText("First name is required")).toBeTruthy();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it("calls dispatch when form is submitted without honeypot", async () => {
    const { getByLabelText, getByTestId } = renderWithProviders(
      <Signup dispatchValues={mockDispatch} />
    );

    const { email, password, firstName, lastName, dob } = validMockValues;

    fireEvent.change(getByLabelText("Email", { exact: false }), {
      target: { value: email },
    });
    fireEvent.change(getByLabelText("Password", { exact: false }), {
      target: { value: password },
    });
    fireEvent.change(getByLabelText("First Name", { exact: false }), {
      target: { value: firstName },
    });
    fireEvent.change(getByLabelText("Last Name", { exact: false }), {
      target: { value: lastName },
    });
    fireEvent.change(getByLabelText("Birthday", { exact: false }), {
      target: { value: dob },
    });

    fireEvent.click(getByTestId("signup-button"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(validMockValues);
    });

    vi.clearAllMocks();
  });
  it("does not call dispatch when honeypot is filled in", async () => {
    const { getByLabelText, getByTestId } = renderWithProviders(
      <Signup dispatchValues={mockDispatch} />
    );

    // Simulate honeypot being filled (bot behavior)
    fireEvent.change(getByTestId("honeypot"), { target: { value: "hello" } });

    const { email, password, firstName, lastName, dob } = validMockValues;

    fireEvent.change(getByLabelText("Email", { exact: false }), {
      target: { value: email },
    });
    fireEvent.change(getByLabelText("Password", { exact: false }), {
      target: { value: password },
    });
    fireEvent.change(getByLabelText("First Name", { exact: false }), {
      target: { value: firstName },
    });
    fireEvent.change(getByLabelText("Last Name", { exact: false }), {
      target: { value: lastName },
    });
    fireEvent.change(getByLabelText("Birthday", { exact: false }), {
      target: { value: dob },
    });

    fireEvent.click(getByTestId("signup-button"));

    await waitFor(() => {
      // Assert that dispatch is NOT called
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
