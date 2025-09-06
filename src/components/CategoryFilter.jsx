import React, { useEffect, useState } from "react";
import "./CategoryFilter.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function CategoryFilter({ selected, onSelect }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch categories from backend
    const fetchCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data = await res.json();

            // Defensive: ensure it's an array
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="category-filter">
            {loading && <p>Loading categories...</p>}
            {error && <p className="error">{error}</p>}

            {/* Always include "All" */}
            <button
                className={`category-btn ${selected === "all" ? "active" : ""}`}
                onClick={() => onSelect("all")}
            >
                All
            </button>

            {categories.map((cat) => (
                <button
                    key={cat._id || cat.id || cat.name}
                    className={`category-btn ${selected === cat.name ? "active" : ""}`}
                    onClick={() => onSelect(cat.name)}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}
