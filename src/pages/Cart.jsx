import React, { useState, useEffect } from "react";
import Button from "../components/UI/Button";
import "./Cart.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Cart() {
    const [items, setItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [animatingItems, setAnimatingItems] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ========================
    // Fetch cart items
    // ========================
    const fetchCart = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/auth/cart`, {
                credentials: "include", // important for JWT cookies
            });
            if (!res.ok) throw new Error("Failed to fetch cart");
            const data = await res.json();
            setItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ========================
    // Update quantity
    // ========================
    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/auth/cart/${itemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ qty: newQuantity }),
            });
            if (!res.ok) throw new Error("Failed to update quantity");
            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    };

    // ========================
    // Remove specific item
    // ========================
    const handleRemoveItem = async (itemId) => {
        setAnimatingItems((prev) => new Set([...prev, itemId]));
        setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/cart/${itemId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to remove item");
                await fetchCart();
            } catch (err) {
                setError(err.message);
            } finally {
                setAnimatingItems((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
            }
        }, 300);
    };

    // ========================
    // Clear entire cart
    // ========================
    const clearCart = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/cart`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to clear cart");
            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    };

    // ========================
    // Checkout
    // ========================
    const handleCheckout = async () => {
        setIsProcessing(true);
        setTimeout(() => {
            alert("Checkout complete (stub)");
            clearCart(); // clear after checkout
            setIsProcessing(false);
        }, 2000);
    };

    // ========================
    // Totals
    // ========================
    const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className="cart-container">
            {loading && <p>Loading cart...</p>}
            {error && <p className="error">{error}</p>}

            <div className="cart-card">
                <div className="cart-header">
                    <h1 className="cart-title">Your Cart</h1>
                    <p className="cart-subtitle">
                        {itemCount === 0
                            ? "Your sustainable shopping cart is empty"
                            : `${itemCount} item${itemCount > 1 ? "s" : ""} ready for checkout`}
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="empty-cart">
                        <h3>Your cart is empty</h3>
                        <Button className="continue-shopping-btn">Continue Shopping</Button>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className={`cart-item ${animatingItems.has(item._id) ? "removing" : ""}`}
                                >
                                    <div className="item-details">
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                        <div className="item-actions">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item._id, (item.quantity || 1) - 1)
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity || 1}</span>
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item._id, (item.quantity || 1) + 1)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="item-price">
                                                ₹{item.price.toLocaleString()}
                                            </div>
                                            <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Subtotal ({itemCount} items)</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">Free</span>
                            </div>
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span className="total-amount">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="checkout-section">
                            <Button
                                onClick={handleCheckout}
                                className={`checkout-btn ${isProcessing ? "processing" : ""}`}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "Proceed to Checkout"}
                            </Button>
                            <Button onClick={clearCart} className="clear-cart-btn">
                                Clear Cart
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
