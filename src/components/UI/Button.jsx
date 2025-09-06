import React from "react";
import "./Button.css";

export default function Button({ children, onClick, type = "button", variant = "primary" }) {
    return (
        <button className={`btn ${variant}`} type={type} onClick={onClick}>
            {children}
        </button>
    );
}
