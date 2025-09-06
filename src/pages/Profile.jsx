import React, { useState } from "react";
import { User, Mail, Edit3, Camera, Award, Leaf, ShoppingBag } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext"; // NEW: Import useCart to access orders
import './Profile.css'
// Simple Avatar component
const Avatar = ({ src, size = 80, alt = "User Avatar" }) => (
    <div
        className="avatar"
        style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundImage: src ? `url(${src})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: src ? 'transparent' : '#047857',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #f59e0b',
            boxShadow: '0 8px 32px rgba(26, 54, 93, 0.15)',
            transition: 'all 0.3s ease',
        }}
    >
        {!src && <User size={size * 0.4} color="#fefdf8" />}
    </div>
);

export default function Profile() {
    const { user, isLoading } = useAuth(); // UPDATED: Get isLoading from useAuth
    const { orders } = useCart(); // NEW: Get orders from useCart
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // UPDATED: Better loading state
    if (isLoading) {
        return (
            <div className="profile-container">
                <div className="profile-card p-8">
                    <p className="text-gray-600 text-center">Loading user profile...</p>
                </div>
            </div>
        );
    }

    // If loading is finished and there's still no user
    if (!user) {
        return (
            <div className="profile-container">
                <div className="profile-card p-8">
                    <p className="text-gray-600 text-center">User not found. Please log in.</p>
                </div>
            </div>
        );
    }

    // NEW: Calculate total items bought from the orders history
    const totalItemsBought = orders.reduce((total, order) => {
        return total + order.items.reduce((itemCount, item) => itemCount + item.quantity, 0);
    }, 0);

    // Use the authenticated user's data
    const displayUser = {
        username: user.username || "EcoWarrior23",
        email: user.email || "eco.warrior@ecofinds.com",
        avatar: user.avatar || null,
        joinDate: user.joinDate ?
            new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
            "September 2025",
        // NOTE: 'itemsSold' would need to come from a backend or another context.
        // We'll keep it as a placeholder for now.
        itemsSold: user.itemsSold || 47,
        itemsBought: totalItemsBought, // UPDATED: Use the calculated value
        sustainabilityScore: user.sustainabilityScore || 8.4,
        totalSaved: user.totalSaved || "$2,340",
        co2Reduced: user.co2Reduced || "156 kg"
    };

    const stats = [
        { icon: ShoppingBag, label: "Items Sold", value: displayUser.itemsSold, color: "#047857" },
        { icon: Award, label: "Sustainability Score", value: displayUser.sustainabilityScore, color: "#f59e0b" },
        { icon: Leaf, label: "CO₂ Reduced", value: displayUser.co2Reduced, color: "#047857" }
    ];

    return (
        <div className="profile-container">
            <div
                className={`profile-card ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="profile-header">
                    <div className="avatar-container">
                        <Avatar
                            src={displayUser.avatar}
                            size={120}
                            alt={`${displayUser.username}'s avatar`}
                        />
                        <button className="avatar-edit-btn">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="user-info">
                        <div className="username-section">
                            <h2 className="username">{displayUser.username}</h2>
                            <button className="edit-btn">
                                <Edit3 size={18} />
                            </button>
                        </div>
                        <p className="email">
                            <Mail size={16} />
                            {displayUser.email}
                        </p>
                        <p className="join-date">Member since {displayUser.joinDate}</p>
                    </div>
                </div>

                <div className="profile-tabs">
                    {['overview', 'activity', 'impact'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="profile-content">
                    {activeTab === 'overview' && (
                        <div className="overview-content">
                            <div className="stats-grid">
                                {stats.map((stat, index) => {
                                    const IconComponent = stat.icon;
                                    return (
                                        <div key={index} className="stat-card">
                                            <div className="stat-icon" style={{ color: stat.color }}>
                                                <IconComponent size={24} />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value">{stat.value}</span>
                                                <span className="stat-label">{stat.label}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="achievements">
                                <h3>Recent Achievements</h3>
                                <div className="achievement-badges">
                                    <div className="badge eco-champion">
                                        <Leaf size={20} />
                                        <span>Eco Champion</span>
                                    </div>
                                    <div className="badge trusted-seller">
                                        <Award size={20} />
                                        <span>Trusted Seller</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="activity-content">
                            <div className="activity-summary">
                                <div className="activity-item">
                                    <span className="activity-number">{displayUser.itemsSold}</span>
                                    <span className="activity-text">Items Successfully Sold</span>
                                </div>
                                <div className="activity-item">
                                    <span className="activity-number">{displayUser.itemsBought}</span>
                                    <span className="activity-text">Items Purchased</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'impact' && (
                        <div className="impact-content">
                            <div className="impact-stats">
                                <div className="impact-item">
                                    <div className="impact-icon">💰</div>
                                    <div>
                                        <span className="impact-value">{displayUser.totalSaved}</span>
                                        <span className="impact-label">Total Money Saved</span>
                                    </div>
                                </div>
                                <div className="impact-item">
                                    <div className="impact-icon">🌱</div>
                                    <div>
                                        <span className="impact-value">{displayUser.co2Reduced}</span>
                                        <span className="impact-label">CO₂ Emissions Reduced</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}