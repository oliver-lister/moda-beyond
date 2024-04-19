import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFetchProducts } from "./useFetchProducts";
import { act } from "react-dom/test-utils";

describe("useFetchProducts", () => {
  it("should return the initial values for data, error and isLoading, and totalCount", async () => {
    const { result } = renderHook(() => useFetchProducts());
    const [products] = result.current;
    const { data, error, isLoading, totalCount } = products;

    expect(data).toStrictEqual([]);
    expect(error).toBe("");
    expect(isLoading).toBe(false);
    expect(totalCount).toBe(0);
  });

  it("should set isLoading to true when fetchProducts is called", async () => {
    const { result } = renderHook(() => useFetchProducts());
    const [products, fetchProducts] = result.current;
    let { isLoading } = products;

    act(() => {
      fetchProducts("");
    });

    ({ isLoading } = result.current[0]); // Update isLoading value
    expect(isLoading).toBe(true);
  });
});
