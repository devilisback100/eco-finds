import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
    return (
        <div className="notfound">
            <h1>404</h1>
            <p>Page not found.</p>
            <Link to="/" className="back-home">Go back home</Link>
        </div>
    );
}
