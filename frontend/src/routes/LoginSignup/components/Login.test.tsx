import Login from "./Login";
import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  renderWithProviders,
  waitFor,
} from "../../../testing-utils";
import { setupStore } from "../../../state/store";

describe("Login Component", () => {
  it("shows validation errors when required fields are empty", async () => {
    const store = setupStore();
    const mockDispatch = vi.fn();

    const { getByTestId, getByText } = renderWithProviders(
      <Login dispatchValues={mockDispatch} />,
      {
        store,
      }
    );

    fireEvent.click(getByTestId("login-button"));

    await waitFor(() => {
      expect(getByText("Email is required")).toBeInTheDocument();
      expect(getByText("Please enter a valid password")).toBeInTheDocument();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("shows an error when an invalid email is entered", async () => {
    const store = setupStore();
    const mockDispatch = vi.fn();

    const { getByLabelText, getByTestId, getByText } = renderWithProviders(
      <Login dispatchValues={mockDispatch} />,
      {
        store,
      }
    );

    fireEvent.change(getByLabelText("Email"), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "ValidPassword1!" },
    });
    fireEvent.click(getByTestId("login-button"));

    await waitFor(() => {
      expect(
        getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("shows an error when the password does not meet validation criteria", async () => {
    const store = setupStore();
    const mockDispatch = vi.fn();

    const { getByLabelText, getByTestId, getByText } = renderWithProviders(
      <Login dispatchValues={mockDispatch} />,
      {
        store,
      }
    );

    fireEvent.change(getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "short" },
    });
    fireEvent.click(getByTestId("login-button"));

    await waitFor(() => {
      expect(getByText("Please enter a valid password")).toBeInTheDocument();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("submits the form with valid values and calls dispatch", async () => {
    const store = setupStore();
    const mockDispatch = vi.fn().mockResolvedValueOnce(Promise.resolve());

    const { getByLabelText, getByTestId } = renderWithProviders(
      <Login dispatchValues={mockDispatch} />,
      {
        store,
      }
    );

    const mockEmail = "test@example.com";
    const mockPassword = "Okl180792!";

    fireEvent.change(getByLabelText("Email"), {
      target: { value: mockEmail },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: mockPassword },
    });
    fireEvent.click(getByTestId("login-button"));

    expect(getByTestId("login-button")).toBeDisabled(); // Ensure the button is disabled during submission

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        email: mockEmail,
        password: mockPassword,
      });
    });
  });

  it("calls dispatch when form is submitted without honeypot", async () => {
    const store = setupStore();
    const mockDispatch = vi.fn();
    const { getByLabelText, getByTestId } = renderWithProviders(
      <Login dispatchValues={mockDispatch} />,
      {
        store,
      }
    );
    const mockEmail = "test@example.com";
    const mockPassword = "Okl180792!";

    fireEvent.change(getByLabelText("Email"), {
      target: { value: mockEmail },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: mockPassword },
    });
    fireEvent.click(getByTestId("login-button"));

    expect(getByTestId("login-button")).toBeDisabled();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        email: mockEmail,
        password: mockPassword,
      });
    });
  });
});
