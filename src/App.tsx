import React, { useState, useCallback, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { ProductFilters } from "./components/ProductFilters";
import { Pagination } from "./components/Pagination";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { useProducts } from "./hooks/useProducts";
import { Product } from "./types";

// The AuthModal is no longer needed and can be removed from lazy loading
const ProductModal = React.lazy(() =>
  import("./components/ProductModal").then((module) => ({
    default: module.ProductModal,
  }))
);
const Cart = React.lazy(() =>
  import("./components/Cart").then((module) => ({ default: module.Cart }))
);
const CheckoutModal = React.lazy(() =>
  import("./components/CheckoutModal").then((module) => ({
    default: module.CheckoutModal,
  }))
);

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const {
    products,
    filters,
    updateFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    categories,
    totalProducts,
  } = useProducts();

  const handleSearch = useCallback(
    (query: string) => {
      updateFilters({ search: query });
    },
    [updateFilters]
  );

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters
          filters={filters}
          categories={categories}
          onFiltersChange={updateFilters}
        />

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
        {isCartOpen && (
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
          />
        )}

        {isCheckoutModalOpen && (
          <Elements stripe={stripePromise}>
            <CheckoutModal
              isOpen={isCheckoutModalOpen}
              onClose={() => setIsCheckoutModalOpen(false)}
            />
          </Elements>
        )}

        {isProductModalOpen && (
          <ProductModal
            product={selectedProduct}
            isOpen={isProductModalOpen}
            onClose={() => {
              setIsProductModalOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
