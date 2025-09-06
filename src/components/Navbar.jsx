import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, Leaf } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount] = useState(3); // Mock cart count

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/', icon: null },
        { name: 'Browse', path: '/listings', icon: null },
        { name: 'Cart', path: '/cart', icon: ShoppingCart, count: cartCount },
        { name: 'Purchases', path: '/purchases', icon: null },
        { name: 'Profile', path: '/profile', icon: User }
    ];

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    {/* Logo */}
                    <div className="navbar-logo">
                        <div className="logo-icon">
                            <Leaf className="leaf-icon" size={24} />
                        </div>
                        <span className="logo-text">EcoFinds</span>
                        <div className="logo-shine"></div>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="navbar-links">
                        {navItems.map((item) => (
                            <li key={item.name} className="nav-item">
                                <a href={item.path} className="nav-link">
                                    {item.icon && (
                                        <div className="nav-icon">
                                            <item.icon size={18} />
                                            {item.count && <span className="nav-badge">{item.count}</span>}
                                        </div>
                                    )}
                                    <span>{item.name}</span>
                                    <div className="nav-underline"></div>
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Search Bar */}
                    <div className="search-container">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search eco-friendly products..."
                            className="search-input"
                        />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-search">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="mobile-search-input"
                        />
                    </div>

                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.path}
                            className="mobile-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.icon && (
                                <div className="mobile-nav-icon">
                                    <item.icon size={20} />
                                    {item.count && <span className="mobile-nav-badge">{item.count}</span>}
                                </div>
                            )}
                            <span>{item.name}</span>
                        </a>
                    ))}
                </div>
            </nav>

            {/* Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-backdrop"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
}