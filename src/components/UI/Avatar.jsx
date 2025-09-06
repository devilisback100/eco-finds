import React from "react";
import "./Avatar.css";

export default function Avatar({ src, alt = "User", size = "40" }) {
    return (
        <img
            src={src || "/placeholder.png"}
            alt={alt}
            className="avatar"
            style={{ width: size, height: size }}
        />
    );
}
