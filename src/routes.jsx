import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Purchases from "./pages/Purchases";
import NotFound from "./pages/NotFound";
import { api } from "./services/api";
import { useCart } from "./contexts/CartContext";
import { useAuth } from "./contexts/AuthContext";
import Listings from "./pages/Listings";


export default function AppRoutes() {
    const [products, setProducts] = useState([]);
    const { items, addToCart, checkout, orders } = useCart();
    const { user, login, signup } = useAuth();

    useEffect(() => {
        api.fetchProducts().then(setProducts);
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/signup" element={<Signup onSignup={signup} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route
                path="/product/:id"
                element={<ProductDetail onAddToCart={addToCart} />}
            />
            <Route path="/listings" element={<Listings products={products} />} />
            <Route path="/cart" element={<Cart items={items} onCheckout={checkout} />} />
            <Route path="/checkout" element={<Checkout items={items} onConfirm={checkout} />} />
            <Route path="/purchases" element={<Purchases orders={orders} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
