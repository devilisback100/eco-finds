import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Purchases from "./pages/Purchases";
import NotFound from "./pages/NotFound";
import Listings from "./pages/Listings";
import { api } from "./services/api";
import { useCart } from "./contexts/CartContext";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from './contexts/CartContext';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter } from "react-router-dom";
import Chatbot from "./Chatbot";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  const [products, setProducts] = useState([]);
  const { items, addToCart, checkout, orders } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    api.fetchProducts().then(setProducts);
  }, []);

  return (
    <Routes>
      {/* Public routes - only accessible when not authenticated */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Protected routes - only accessible when authenticated */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home products={products} addToCart={addToCart} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetail products={products} addToCart={addToCart} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart items={items} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout items={items} onCheckout={checkout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchases"
        element={
          <ProtectedRoute>
            <Purchases orders={orders} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatbot"
        element={
         <Chatbot/>
        }
      />
      <Route
        path="/listings"
        element={
          <ProtectedRoute>
            <Listings />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Main App component with both providers
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}