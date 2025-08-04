import React, { useState } from "react";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onCartClick: () => void;
  onSearch: (query: string) => void;
}

export function Header({ onCartClick, onSearch }: HeaderProps) {
  const { itemCount } = useCart();
  const { user, login, logout, isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    login();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">ShopEasy</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 selectable-text">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}

            <button
              onClick={onCartClick}
              className="relative flex items-center space-x-1 text-gray-700 hover:text-gray-900"
              aria-label={`Open cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden py-4 border-t border-gray-200"
            data-testid="mobile-menu"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-700 selectable-text">
                    Hello, {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}

              <button
                onClick={() => {
                  onCartClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({itemCount})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
