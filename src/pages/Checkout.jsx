import React, { useState, useEffect } from "react";
import {
    ShoppingBag,
    CreditCard,
    Shield,
    CheckCircle,
    Leaf,
    ArrowLeft,
    Trash2,
} from "lucide-react";
import Button from "../components/UI/Button";
import "./Checkout.css";

export default function Checkout({ items, onConfirm, onBack, onRemoveItem }) {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isAnimated, setIsAnimated] = useState(false);
    const [error, setError] = useState("");

    const total = items.reduce((sum, i) => sum + i.price, 0);
    const savings = items.reduce(
        (sum, i) => sum + (i.originalPrice - i.price || 0),
        0
    );
    const ecoImpact = items.length * 2.5; // kg CO2 saved per item

    useEffect(() => {
        setIsAnimated(true);
    }, []);

    const handleConfirm = async () => {
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/auth/checkout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // user must be logged in
                    },
                    body: JSON.stringify({
                        items: items.map((i) => ({
                            id: i.id || i._id,
                            title: i.title,
                            price: i.price,
                            category: i.category,
                        })),
                        paymentMethod,
                        total: total + 29,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error(`Checkout failed: ${res.statusText}`);
            }

            const order = await res.json();
            console.log("Order created:", order);

            // callback to parent
            onConfirm(order);
        } catch (err) {
            console.error("Checkout error:", err);
            setError("Something went wrong during checkout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const paymentMethods = [
        { id: "card", name: "Credit/Debit Card", icon: CreditCard },
        { id: "upi", name: "UPI", icon: Shield },
        { id: "wallet", name: "Digital Wallet", icon: CheckCircle },
    ];

    return (
        <div className={`checkout ${isAnimated ? "animate-in" : ""}`}>
            {/* Header */}
            <div className="checkout-header">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Cart
                </button>
                <div className="checkout-title">
                    <ShoppingBag className="checkout-icon" size={28} />
                    <h2>Checkout</h2>
                </div>
            </div>

            <div className="checkout-content">
                {/* Order Summary */}
                <div className="order-summary">
                    <h3 className="section-title">
                        <ShoppingBag size={20} />
                        Order Summary ({items.length} items)
                    </h3>

                    <div className="items-list">
                        {items.map((item, index) => (
                            <div
                                key={item.id || item._id}
                                className="checkout-item"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="item-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} />
                                    ) : (
                                        <div className="item-placeholder">{item.title[0]}</div>
                                    )}
                                </div>
                                <div className="item-details">
                                    <h4>{item.title}</h4>
                                    <p className="item-category">{item.category}</p>
                                    {item.condition && (
                                        <span className="condition-badge">{item.condition}</span>
                                    )}
                                </div>
                                <div className="item-pricing">
                                    <div className="current-price">₹{item.price}</div>
                                    {item.originalPrice && item.originalPrice > item.price && (
                                        <div className="original-price">₹{item.originalPrice}</div>
                                    )}
                                </div>
                                {onRemoveItem && (
                                    <button
                                        className="remove-item-btn"
                                        onClick={() => onRemoveItem(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="pricing-breakdown">
                        <div className="price-row">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="price-row">
                            <span>Platform Fee</span>
                            <span>₹29</span>
                        </div>
                        <div className="price-row">
                            <span>Delivery</span>
                            <span className="free">FREE</span>
                        </div>
                        {savings > 0 && (
                            <div className="price-row savings">
                                <span>You Save</span>
                                <span>-₹{savings}</span>
                            </div>
                        )}
                        <div className="price-row total-row">
                            <span>Total Amount</span>
                            <span>₹{total + 29}</span>
                        </div>
                    </div>

                    {/* Eco Impact */}
                    <div className="eco-impact">
                        <div className="eco-header">
                            <Leaf className="eco-icon" size={20} />
                            <span>Your Environmental Impact</span>
                        </div>
                        <div className="eco-stats">
                            <div className="eco-stat">
                                <span className="eco-number">{ecoImpact}kg</span>
                                <span className="eco-label">CO₂ Saved</span>
                            </div>
                            <div className="eco-stat">
                                <span className="eco-number">{items.length}</span>
                                <span className="eco-label">Items Reused</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="payment-section">
                    <h3 className="section-title">
                        <CreditCard size={20} />
                        Payment Method
                    </h3>

                    <div className="payment-methods">
                        {paymentMethods.map((method) => (
                            <label
                                key={method.id}
                                className={`payment-option ${paymentMethod === method.id ? "selected" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-option-content">
                                    <method.icon size={24} className="payment-icon" />
                                    <span>{method.name}</span>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="security-badge">
                        <Shield size={16} />
                        <span>Your payment information is secure and encrypted</span>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || items.length === 0}
                        className={`confirm-btn ${isLoading ? "loading" : ""}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="loading-spinner"></div>
                                Processing Payment...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Confirm Purchase - ₹{total + 29}
                            </>
                        )}
                    </Button>

                    <div className="guarantee">
                        <CheckCircle size={16} className="guarantee-icon" />
                        <span>30-day money-back guarantee on all purchases</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
