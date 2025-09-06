import React, { useEffect, useState } from "react";
import Listings from "./Listings";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ListingsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/listings`);
                if (!res.ok) throw new Error("Failed to fetch listings");
                const data = await res.json();

                // Backend may return { listings: [...] } or just an array
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (Array.isArray(data.listings)) {
                    setProducts(data.listings);
                } else {
                    console.error("Unexpected listings response:", data);
                    setProducts([]);
                }
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    if (loading) {
        return <div className="loading">Loading listings...</div>;
    }

    return <Listings products={products} />;
}
