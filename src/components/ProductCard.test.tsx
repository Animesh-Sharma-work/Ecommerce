import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./ProductCard";
import { CartProvider, useCart } from "../contexts/CartContext"; // We need the real provider
import { Product } from "../types";

// Mock data for our product
const mockProduct: Product = {
  id: "1",
  name: "Test Headphones",
  price: 99.99,
  image: "test.jpg",
  category: "Testing",
  description: "A product for testing purposes",
  stock: 10,
};

// A helper component to display cart state for verification
const CartStateTester = () => {
  const { itemCount, total } = useCart();
  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: {total.toFixed(2)}</p>
    </div>
  );
};

describe("ProductCard Component", () => {
  // Test Case 1: Renders product details
  test("should render product name, price, and category", () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    expect(screen.getByText("Test Headphones")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
    expect(screen.getByText("10 in stock")).toBeInTheDocument();
  });

  // Test Case 2: User interaction with "Add to Cart"
  test('should add the product to the cart when "Add to Cart" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
        <CartStateTester />
      </CartProvider>
    );

    // Verify initial cart state
    expect(screen.getByText("Items: 0")).toBeInTheDocument();
    expect(screen.getByText("Total: 0.00")).toBeInTheDocument();

    // Find the button and click it
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCartButton);

    // Verify updated cart state
    expect(screen.getByText("Items: 1")).toBeInTheDocument();
    expect(screen.getByText("Total: 99.99")).toBeInTheDocument();
  });

  // Test Case 3: Disabling the button when out of stock
  test('should disable the "Add to Cart" button if stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(
      <CartProvider>
        <ProductCard product={outOfStockProduct} />
      </CartProvider>
    );

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    expect(addToCartButton).toBeDisabled();
  });

  // Test Case 4: onProductClick callback
  test("should call onProductClick when the card is clicked", async () => {
    const user = userEvent.setup();
    const handleProductClick = jest.fn();
    render(
      <CartProvider>
        <ProductCard
          product={mockProduct}
          onProductClick={handleProductClick}
        />
      </CartProvider>
    );

    // The main div of the card has the group class
    await user.click(screen.getByText("Test Headphones"));
    expect(handleProductClick).toHaveBeenCalledWith(mockProduct);
    expect(handleProductClick).toHaveBeenCalledTimes(1);
  });
});
