import { useState, useMemo, useCallback } from 'react';
import { Product, ProductFilters } from '../types';
import { products } from '../data/products';

const ITEMS_PER_PAGE = 6;

export function useProducts() {
  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    search: '',
    minPrice: 0,
    maxPrice: 2000
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [filters]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(product => product.category)));
  }, []);

  return {
    products: paginatedProducts,
    filters,
    updateFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    categories,
    totalProducts: filteredProducts.length
  };
}