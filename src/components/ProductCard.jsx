import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
    return (
        <div className="product-card">
            <img
                src={product.image || "/placeholder.png"}
                alt={product.title}
                className="product-image"
            />
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">₹{product.price}</p>
                <Link to={`/product/${product.id}`} className="product-link">
                    View Details
                </Link>
            </div>
        </div>
    );
}
