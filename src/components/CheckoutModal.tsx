import React, { useState } from "react";
import { X, Lock } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { items, total, clearCart } = useCart();
  const { user } = useAuth(); // Assuming useAuth provides the user's name/email

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission.
      setError("Stripe is not ready yet. Please wait a moment and try again.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details are not available. Please refresh the page.");
      setIsProcessing(false);
      return;
    }

    // Step 1: Create a PaymentMethod. This is safe to do on the client-side.
    // It validates the card details and tokenizes them without making a charge.
    const { error: paymentMethodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
          email: user?.email,
        },
      });

    if (paymentMethodError) {
      setError(
        paymentMethodError.message ||
          "An error occurred while validating your card."
      );
      setIsProcessing(false);
      return;
    }

    console.log("PaymentMethod created successfully:", paymentMethod);

    // --- SAFELY SIMULATING THE BACKEND CALL ---
    // In a REAL app, you would now send `paymentMethod.id` and the cart total
    // to your backend. The backend would use the SECRET KEY to create and
    // confirm a PaymentIntent.
    // For this demo, we will just simulate a delay and a successful outcome.

    console.log("Simulating payment processing...");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

    // Assuming the simulated backend call was successful
    console.log("Payment simulation successful!");
    setIsProcessing(false);
    setPaymentSuccess(true);

    // Clear cart and close modal after success animation
    setTimeout(() => {
      clearCart();
      setPaymentSuccess(false);
      onClose();
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-gray-500 ml-2">
                      × {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 text-blue-800">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Secure Payment - Test Mode
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Use test card number 4242 4242 4242 4242 and any valid future
                date and CVV.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Details
              </label>
              <div className="p-3 border border-gray-300 rounded-lg bg-white">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <div className="border-t border-gray-200 pt-4">
              <button
                type="submit"
                disabled={isProcessing || !stripe}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                {isProcessing
                  ? "Processing Payment..."
                  : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500">
            <Lock className="w-3 h-3 inline mr-1" />
            Your payment information is secure and encrypted.
          </div>
        </div>
      </div>
    </div>
  );
}
