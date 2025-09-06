import React, { useState, useEffect } from "react";
import { ChevronRight, Leaf, Recycle, Users, Star, ArrowRight, TrendingUp } from "lucide-react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import "./Home.css";

export default function Home({ products, onSearch, onFilter, selectedCategory }) {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    const categories = ["All", "Electronics", "Books", "Fashion", "Home", "Sports"];

    const features = [
        { icon: Leaf, title: "Sustainable Living", desc: "Reduce waste, extend product lifecycles" },
        { icon: Recycle, title: "Circular Economy", desc: "Buy and sell with environmental impact" },
        { icon: Users, title: "Community Driven", desc: "Connect with conscious buyers & sellers" }
    ];

    const stats = [
        { number: "50K+", label: "Happy Users" },
        { number: "200K+", label: "Items Sold" },
        { number: "85%", label: "Waste Reduced" },
        { number: "4.9★", label: "User Rating" }
    ];

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className={`hero ${isVisible ? 'animate-in' : ''}`}>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Discover <span className="gradient-text">EcoFinds</span>
                            <br />
                            Your Sustainable Marketplace
                        </h1>
                        <p className="hero-subtitle">
                            Transform your shopping experience with pre-owned treasures.
                            Reduce waste, save money, and join a community that cares about our planet.
                        </p>
                        <div className="hero-actions">
                            <button className="btn-primary">
                                Start Shopping <ArrowRight size={18} />
                            </button>
                            <button className="btn-secondary">
                                Sell Your Items <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="floating-cards">
                            <div className="card-1">📱 Electronics</div>
                            <div className="card-2">👕 Fashion</div>
                            <div className="card-3">📚 Books</div>
                        </div>
                        <div className="eco-circle">
                            <Recycle className="recycle-icon" size={60} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.2}s` }}>
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Why Choose EcoFinds?</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                            onMouseEnter={() => setActiveFeature(index)}
                        >
                            <div className="feature-icon">
                                <feature.icon size={32} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

       

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Make a Difference?</h2>
                    <p>Join thousands of eco-conscious users who are transforming the way we consume</p>
                    <div className="cta-actions">
                        <button className="btn-primary large">
                            Join EcoFinds Today <Star size={20} />
                        </button>
                    </div>
                </div>
                <div className="cta-bg-pattern"></div>
            </section>
        </div>
    );
}