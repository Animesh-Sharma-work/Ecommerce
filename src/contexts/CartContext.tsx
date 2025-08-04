import React, { createContext, useContext, useCallback, useMemo } from "react";
import { CartContextType, CartItem, Product } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart", []);

  const addToCart = useCallback(
    (product: Product) => {
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          return currentItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...currentItems, { product, quantity: 1 }];
      });
    },
    [setItems]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((currentItems) =>
        currentItems.filter((item) => item.product.id !== productId)
      );
    },
    [setItems]
  );

  // const updateQuantity = useCallback((productId: string, quantity: number) => {
  //   if (quantity <= 0) {
  //     removeFromCart(productId);
  //     return;
  //   }

  //   setItems(currentItems =>
  //     currentItems.map(item =>
  //       item.product.id === productId
  //         ? { ...item, quantity }
  //         : item
  //     )
  //   );
  // }, [setItems, removeFromCart]);
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((currentItems) => {
        // If the new quantity is 0 or less, filter out the item.
        if (quantity <= 0) {
          return currentItems.filter((item) => item.product.id !== productId);
        }

        // Otherwise, map through the items and update the correct one.
        return currentItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      });
    },
    [setItems]
  ); // Now it only depends on setItems, which is more robust.

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
