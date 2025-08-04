import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cart } from "./Cart";
import { CartProvider } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { products } from "../data/products";

// Mock only the auth hook
jest.mock("../contexts/AuthContext");
const mockedUseAuth = useAuth as jest.Mock;

// Find specific products from our data to use as mocks
const mockHeadphones = products.find((p) => p.id === "1")!;
const mockSmartphone = products.find((p) => p.id === "2")!;

// Helper to render the Cart inside a real provider
const renderCart = (ui: React.ReactElement) => {
  return render(<CartProvider>{ui}</CartProvider>);
};

describe("Cart Component", () => {
  // This block runs before each and every test in this file
  beforeEach(() => {
    // Reset the auth mock to a default state
    mockedUseAuth.mockClear();
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      login: jest.fn(),
    });
    // *** THIS IS THE CRITICAL FIX ***
    // Clear localStorage to prevent state from leaking between tests
    localStorage.clear();
  });

  test('shows "cart is empty" message when no items are present', () => {
    renderCart(<Cart isOpen={true} onClose={() => {}} onCheckout={() => {}} />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByText(/total/i)).not.toBeInTheDocument();
  });

  test("updates quantity and total when + and - buttons are clicked", async () => {
    const user = userEvent.setup();
    const { useCart: actualUseCart } = jest.requireActual(
      "../contexts/CartContext"
    );
    const CartController = () => {
      const { addToCart } = actualUseCart();
      return (
        <div>
          <button onClick={() => addToCart(mockHeadphones)}>
            Add Headphones
          </button>
          <Cart isOpen={true} onClose={() => {}} onCheckout={() => {}} />
        </div>
      );
    };

    renderCart(<CartController />);
    await user.click(screen.getByRole("button", { name: /add headphones/i }));

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(
      screen.getByText("$199.99", { selector: ".font-medium" })
    ).toBeInTheDocument();

    const increaseButton = screen.getByLabelText(/increase quantity/i);
    await user.click(increaseButton);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(
      screen.getByText("$399.98", { selector: ".font-medium" })
    ).toBeInTheDocument();

    const decreaseButton = screen.getByLabelText(/decrease quantity/i);
    await user.click(decreaseButton);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("removes an item when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const { useCart: actualUseCart } = jest.requireActual(
      "../contexts/CartContext"
    );
    const CartController = () => {
      const { addToCart } = actualUseCart();
      return (
        <div>
          <button onClick={() => addToCart(mockHeadphones)}>Add Item</button>
          <Cart isOpen={true} onClose={() => {}} onCheckout={() => {}} />
        </div>
      );
    };
    renderCart(<CartController />);

    await user.click(screen.getByRole("button", { name: /add item/i }));
    expect(screen.getByText(/wireless headphones/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove/i }));

    expect(screen.queryByText(/wireless headphones/i)).not.toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test("should handle multiple different items and calculate the total correctly", async () => {
    const user = userEvent.setup();
    const { useCart: actualUseCart } = jest.requireActual(
      "../contexts/CartContext"
    );
    const CartController = () => {
      const { addToCart } = actualUseCart();
      return (
        <div>
          <button onClick={() => addToCart(mockHeadphones)}>
            Add Headphones
          </button>
          <button onClick={() => addToCart(mockSmartphone)}>
            Add Smartphone
          </button>
          <Cart isOpen={true} onClose={() => {}} onCheckout={() => {}} />
        </div>
      );
    };
    renderCart(<CartController />);

    await user.click(screen.getByRole("button", { name: /add headphones/i }));
    await user.click(screen.getByRole("button", { name: /add smartphone/i }));

    const list = screen.getByRole("list");
    expect(within(list).getByText(/wireless headphones/i)).toBeInTheDocument();
    expect(within(list).getByText(/smartphone/i)).toBeInTheDocument();

    const expectedTotal = mockHeadphones.price + mockSmartphone.price;
    const totalElement = screen.getByText(`$${expectedTotal.toFixed(2)}`, {
      selector: ".text-xl",
    });
    expect(totalElement).toBeInTheDocument();
  });

  test('shows "Login to Checkout" button when user is logged out and cart has items', async () => {
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, login: jest.fn() });
    const { useCart: actualUseCart } = jest.requireActual(
      "../contexts/CartContext"
    );
    const CartController = () => {
      const { addToCart } = actualUseCart();
      return (
        <div>
          <button onClick={() => addToCart(mockHeadphones)}>Add Item</button>
          <Cart isOpen={true} onClose={() => {}} onCheckout={() => {}} />
        </div>
      );
    };
    renderCart(<CartController />);

    await user.click(screen.getByRole("button", { name: /add item/i }));

    const checkoutButton = screen.getByRole("button", {
      name: /login to checkout/i,
    });
    expect(checkoutButton).toBeInTheDocument();
  });

  test("should remove item if quantity is decreased to 0 or less", async () => {
    const user = userEvent.setup();
    const { useCart: actualUseCart } = jest.requireActual(
      "../contexts/CartContext"
    );
    const CartController = () => {
      const { addToCart } = actualUseCart();
      return (
        <div>
          <button onClick={() => addToCart(mockHeadphones)}>Add Item</button>
          <Cart isOpen={true} onClose={() => {}} onCheckout={() => {}} />
        </div>
      );
    };
    renderCart(<CartController />);

    await user.click(screen.getByRole("button", { name: /add item/i }));

    const headphoneItemElement = screen
      .getByText(/wireless headphones/i)
      .closest('div[role="listitem"]');
    expect(headphoneItemElement).toBeInTheDocument();

    const decreaseButton = within(
      headphoneItemElement as HTMLElement
    ).getByLabelText(/decrease quantity/i);
    await user.click(decreaseButton);

    expect(screen.queryByText(/wireless headphones/i)).not.toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('should clear the cart when "Clear Cart" button is clicked', async () => {
    const user = userEvent.setup();
    const { useCart: actualUseCart } = jest.requireActual(
      "../contexts/CartContext"
    );
    const CartController = () => {
      const { addToCart } = actualUseCart();
      return (
        <div>
          <button onClick={() => addToCart(mockHeadphones)}>Add Item</button>
          <Cart isOpen={true} onClose={() => {}} onCheckout={() => {}} />
        </div>
      );
    };
    renderCart(<CartController />);

    await user.click(screen.getByRole("button", { name: /add item/i }));
    expect(screen.getByText(/wireless headphones/i)).toBeInTheDocument();

    const clearCartButton = screen.getByRole("button", { name: /clear cart/i });
    await user.click(clearCartButton);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
