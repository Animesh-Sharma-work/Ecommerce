import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { isAuthenticated, login } = useAuth();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // If the user is not logged in, trigger the Auth0 login flow.
      login();
    } else if (items.length > 0) {
      // Otherwise, proceed to the checkout modal.
      onCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="w-16 h-16 mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4" role="list">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg"
                    role="listitem"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)}
                      </p>

                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="px-2 py-1 bg-white rounded border">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Clear Cart
                </button>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {isAuthenticated
                    ? "Proceed to Checkout"
                    : "Login to Checkout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
