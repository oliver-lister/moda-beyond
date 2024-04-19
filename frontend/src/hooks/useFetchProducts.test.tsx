import { describe, expect, test } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useFetchProducts } from "./useFetchProducts";
import { act } from "react-dom/test-utils";

describe("useFetchProducts", () => {
  test("should maintain correct default states", async () => {
    const { result } = renderHook(() => useFetchProducts(), {
      wrapper: Router,
    });

    // test defaults
    expect(result.current.products).toBe(null);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.error).toBe(null);

    act(() => {
      result.current[3](); // Invoke callApi function
    });

    expect(result.current[1]).toBe(true); // Loading state should be true during API call
    await waitFor(() => {
      // Wait for API call to complete
      expect(result.current[1]).toBe(false); // Loading state should be false after API call
      expect(result.current[0]).toEqual(mockData); // Data should match mock data
    });
  });
});
