import React from "react";
import "./Input.css";

export default function Input({ label, type = "text", value, onChange, placeholder }) {
    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}
            <input
                className="input-field"
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}
