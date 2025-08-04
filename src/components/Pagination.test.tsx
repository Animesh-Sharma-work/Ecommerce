import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination Component", () => {
  // Test case 1: Ensure it doesn't render if there's only one page
  test("should not render if totalPages is 1 or less", () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    // Also test with 0 pages
    rerender(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  // Test case 2: Renders correctly with multiple pages
  test("should render the correct number of pages and controls", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );

    // Find by accessible roles
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();

    // Check for all page number buttons
    expect(
      screen.getByRole("button", { name: "Go to page 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 5" })
    ).toBeInTheDocument();

    // Check which page is marked as current
    const currentPageButton = screen.getByRole("button", {
      name: "Go to page 3",
    });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  // Test case 3: Buttons are disabled correctly
  test("should disable previous/next buttons at boundaries", () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
    expect(screen.getByLabelText("Go to next page")).not.toBeDisabled();

    rerender(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );
    expect(screen.getByLabelText("Go to previous page")).not.toBeDisabled();
    expect(screen.getByLabelText("Go to next page")).toBeDisabled();
  });

  // Test case 4: User interaction
  test("should call onPageChange with the correct page number on click", async () => {
    const user = userEvent.setup();
    const handlePageChange = jest.fn(); // Create a mock function
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    // Simulate user clicking the "next" button
    await user.click(screen.getByLabelText("Go to next page"));
    expect(handlePageChange).toHaveBeenCalledWith(3);

    // Simulate user clicking a specific page number
    await user.click(screen.getByRole("button", { name: "Go to page 4" }));
    expect(handlePageChange).toHaveBeenCalledWith(4);

    // Simulate user clicking the "previous" button
    await user.click(screen.getByLabelText("Go to previous page"));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });
});
