import { ProductFilters as Filters } from "../types";

interface ProductFiltersProps {
  filters: Filters;
  categories: string[];
  onFiltersChange: (filters: Partial<Filters>) => void;
}

export function ProductFilters({
  filters,
  categories,
  onFiltersChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) => onFiltersChange({ category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label
            htmlFor="min-price-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Min Price
          </label>
          <input
            id="min-price-filter"
            type="number"
            value={filters.minPrice}
            onChange={(e) =>
              onFiltersChange({ minPrice: parseFloat(e.target.value) || 0 })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label
            htmlFor="max-price-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Max Price
          </label>
          <input
            id="max-price-filter"
            type="number"
            value={filters.maxPrice}
            onChange={(e) =>
              onFiltersChange({ maxPrice: parseFloat(e.target.value) || 2000 })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() =>
              onFiltersChange({
                category: "",
                search: "",
                minPrice: 0,
                maxPrice: 2000,
              })
            }
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
