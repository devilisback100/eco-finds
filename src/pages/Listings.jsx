import React, { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import "./Listings.css";

export default function Listings({ products = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [isLoading, setIsLoading] = useState(false);

    const safeProducts = Array.isArray(products) ? products : [];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = safeProducts.filter((product) => {
            const matchesSearch =
                product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategory === "all" || product.category === selectedCategory;

            const matchesPrice =
                product.price >= priceRange.min && product.price <= priceRange.max;

            return matchesSearch && matchesCategory && matchesPrice;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "name":
                    return a.title.localeCompare(b.title);
                case "newest":
                default:
                    return (b.id || b._id) - (a.id || a._id);
            }
        });

        return filtered;
    }, [safeProducts, searchTerm, selectedCategory, sortBy, priceRange]);

    const simulateLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 300);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSortBy("newest");
        setPriceRange({ min: 0, max: 100000 });
        simulateLoading();
    };

    return (
        <div className="listings-container">
            {/* Filters */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        simulateLoading();
                    }}
                />

                <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        simulateLoading();
                    }}
                >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                </select>

                <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear Filters
                </button>
            </div>

            {/* Results */}
            <div className="results-section">
                {isLoading ? (
                    <div className="loading-grid">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="loading-card">
                                <div className="loading-shimmer"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="no-results">
                        <h3>No items found</h3>
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div
                        className={`product-grid ${viewMode === "list" ? "list-view" : "grid-view"
                            } ${isLoading ? "loading" : ""}`}
                    >
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id || product._id || index}
                                className="product-item"
                                style={{
                                    animationDelay: `${index * 0.05}s`,
                                    "--item-index": index,
                                }}
                            >
                                <ProductCard product={product} viewMode={viewMode} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
