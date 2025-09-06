import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedOrders = localStorage.getItem('orders');

        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
            }
        }

        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (error) {
                console.error('Failed to parse orders from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    // Save orders to localStorage whenever orders change
    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (product, quantity = 1) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getCartTotal = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    const checkout = (orderDetails = {}) => {
        if (items.length === 0) {
            throw new Error('Cart is empty');
        }

        const newOrder = {
            id: Date.now().toString(),
            items: [...items],
            total: getCartTotal(),
            date: new Date().toISOString(),
            status: 'completed',
            ...orderDetails
        };

        setOrders(prevOrders => [newOrder, ...prevOrders]);
        clearCart();

        return newOrder;
    };

    const value = {
        items,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        checkout
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};