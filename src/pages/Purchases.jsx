import React from "react";
import "./Purchases.css";

export default function Purchases({ orders }) {
    return (
        <div className="purchases">
            <h2>Previous Purchases</h2>
            {orders.length === 0 ? (
                <p>No purchases yet.</p>
            ) : (
                <ul>
                    {orders.map((o, i) => (
                        <li key={i}>
                            {o.title} - ₹{o.price}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
