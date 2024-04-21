import Login from "./Login";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  renderWithProviders,
  waitFor,
} from "../../../testing-utils";
import { setupStore } from "../../../state/store";

describe("Login Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
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

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        email: mockEmail,
        password: mockPassword,
      });
    });
  });

  it("doesn't call dispatch when honeypot is filled in", async () => {
    const store = setupStore();
    const mockDispatch = vi.fn();

    const { getByLabelText, getByTestId } = renderWithProviders(
      <Login dispatchValues={mockDispatch} />,
      {
        store,
      }
    );

    const honeypotInput = getByTestId("honeypot");
    expect(honeypotInput).toBeInTheDocument();
    expect(honeypotInput).toHaveAttribute("type", "hidden");
    const mockEmail = "oliverlister98@gmail.com";
    const mockPassword = "Ojl180898!";

    fireEvent.change(getByLabelText("Email"), {
      target: { value: mockEmail },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: mockPassword },
    });
    fireEvent.change(getByTestId("honeypot"), {
      target: { value: "hello" },
    });
    expect(getByTestId("honeypot")).toHaveValue("hello");

    fireEvent.click(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalledWith();
    });
  });
});
