import { renderHook, act } from "@testing-library/react";
import { useProducts } from "./useProducts";

// The 'act' utility is used to wrap any code that causes state updates.

describe("useProducts Hook", () => {
  test("should return initial products and pagination state", () => {
    // Render the hook
    const { result } = renderHook(() => useProducts());

    // Assert initial state
    expect(result.current.products.length).toBe(6); // 6 items on the first page
    expect(result.current.totalPages).toBe(2);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalProducts).toBe(12);
  });

  test("should filter products by category", () => {
    const { result } = renderHook(() => useProducts());

    // Act: update the filter state
    act(() => {
      result.current.updateFilters({ category: "Home" });
    });

    // Assert that the products are now filtered
    expect(result.current.products.length).toBe(3);
    expect(result.current.totalProducts).toBe(3);
    // Check that all returned products match the category
    expect(result.current.products.every((p) => p.category === "Home")).toBe(
      true
    );
  });

  test("should filter products by search query", () => {
    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.updateFilters({ search: "camera" });
    });

    expect(result.current.products.length).toBe(1);
    expect(result.current.products[0].name).toBe("Camera");
  });

  test("should filter products by price range", () => {
    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.updateFilters({ minPrice: 100, maxPrice: 300 });
    });

    // Headphones (199.99), Watch (299.99), Sunglasses (159.99)
    expect(result.current.totalProducts).toBe(3);
  });

  test("should handle pagination correctly", () => {
    const { result } = renderHook(() => useProducts());

    // Go to the next page
    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.products.length).toBe(6); // The second page also has 6 items
    // Check if a product from the second page is present
    expect(result.current.products.some((p) => p.name === "Sunglasses")).toBe(
      true
    );
  });

  test("should reset to page 1 when filters are updated", () => {
    const { result } = renderHook(() => useProducts());

    // Go to page 2 first
    act(() => {
      result.current.setCurrentPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    // Now, apply a filter
    act(() => {
      result.current.updateFilters({ category: "Fashion" });
    });

    // Assert that the page was reset to 1
    expect(result.current.currentPage).toBe(1);
  });
});
