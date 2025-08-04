import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

// Mock the entire module for each custom hook
jest.mock("../contexts/AuthContext");
jest.mock("../contexts/CartContext");

// Create typed mock functions. This is a standard pattern.
const mockedUseAuth = useAuth as jest.Mock;
const mockedUseCart = useCart as jest.Mock;

describe("Header Component", () => {
  // beforeEach runs before each test. It's a good place to reset mocks.
  beforeEach(() => {
    mockedUseAuth.mockClear();
    mockedUseCart.mockClear();
  });

  test("displays login button when user is logged out", () => {
    // Arrange: Set up the return values for our mocked hooks
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(), // Provide mock functions for any called functions
    });
    mockedUseCart.mockReturnValue({
      itemCount: 0,
    });

    // Act: Render the component
    render(<Header onCartClick={() => {}} onSearch={() => {}} />);

    // Assert: Check the document
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
  });

  test("displays user name, logout, and cart count when user is logged in", async () => {
    const user = userEvent.setup(); // Add userEvent setup
    const mockLogout = jest.fn();
    // Arrange
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: "Alice" },
      logout: mockLogout,
    });
    mockedUseCart.mockReturnValue({
      itemCount: 5,
    });

    render(<Header onCartClick={() => {}} onSearch={() => {}} />);

    // Assert
    expect(screen.getByText("Hello, Alice")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // Cart count

    // Let's find all buttons with the name "Logout"
    const logoutButtons = screen.getAllByRole("button", { name: /logout/i });

    // In our component, the first one is the desktop button. Let's click that one.
    // A more robust way could be to check which one is visible, but this is simple and effective.
    const desktopLogoutButton = logoutButtons[0];
    expect(desktopLogoutButton).toBeInTheDocument();

    // Test user interaction
    await user.click(desktopLogoutButton); // Use await for user events
    // ;
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test("calls onSearch with the query when form is submitted", async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();

    // Arrange mocks (user can be logged in or out, doesn't matter for this test)
    mockedUseAuth.mockReturnValue({ isAuthenticated: false });
    mockedUseCart.mockReturnValue({ itemCount: 0 });

    render(<Header onCartClick={() => {}} onSearch={handleSearch} />);

    const searchInput = screen.getByPlaceholderText(/search products/i);

    // Act: Simulate user typing and pressing Enter
    await user.type(searchInput, "laptop{enter}");

    // Assert
    expect(handleSearch).toHaveBeenCalledWith("laptop");
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  test("should toggle mobile menu and show correct items", async () => {
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, login: jest.fn() });
    mockedUseCart.mockReturnValue({ itemCount: 2 });

    render(<Header onCartClick={() => {}} onSearch={() => {}} />);

    // The mobile menu button is only visible in the mobile view, but it's in the DOM
    const menuButton = screen.getByRole("button", { name: /toggle menu/i });
    await user.click(menuButton);

    // Now that the menu is open, the mobile-specific items should be visible
    // First, find the mobile menu container using its test ID
    const mobileMenu = screen.getByTestId("mobile-menu");

    // Now, search for the button *within* the mobile menu
    const mobileLoginButton = within(mobileMenu).getByRole("button", {
      name: /login/i,
    });
    const mobileCartLink = within(mobileMenu).getByText(/cart \(2\)/i);

    expect(mobileLoginButton).toBeInTheDocument();
    expect(mobileCartLink).toBeInTheDocument();
  });
});
