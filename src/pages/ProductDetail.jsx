import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Heart,
    Share2,
    ShoppingCart,
    Star,
    MapPin,
    Calendar,
    Leaf,
    Shield,
    Truck,
    MessageCircle,
    Camera,
    Info
} from "lucide-react";
import Button from "../components/UI/Button";
import "./ProductDetail.css";

export default function ProductDetail({ product, onAddToCart, onBack, relatedProducts = [] }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAnimated, setIsAnimated] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        setIsAnimated(true);
    }, []);

    if (!product) {
        return (
            <div className="product-not-found">
                <div className="not-found-content">
                    <h2>Product not found</h2>
                    <p>The product you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={onBack}>
                        <ArrowLeft size={18} />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    // Mock data for enhanced product details
    const productImages = product.images || [product.image || "/placeholder.png"];
    const seller = product.seller || {
        name: "EcoSeller",
        rating: 4.8,
        reviews: 156,
        location: "Bengaluru, Karnataka"
    };

    const ecoStats = {
        co2Saved: 3.2,
        treesPlanted: 1,
        waterSaved: 150
    };

    const handleAddToCart = () => {
        onAddToCart({ ...product, quantity });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed');
            }
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className={`product-detail ${isAnimated ? 'animate-in' : ''}`}>
            {/* Header */}
            <div className="product-header">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div className="header-actions">
                    <button
                        className={`action-btn ${isFavorite ? 'favorited' : ''}`}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button className="action-btn" onClick={handleShare}>
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            <div className="product-content">
                {/* Image Gallery */}
                <div className="image-gallery">
                    <div className="main-image">
                        <img
                            src={productImages[selectedImage]}
                            alt={product.title}
                            onError={(e) => {
                                e.target.src = "/placeholder.png";
                            }}
                        />
                        <div className="image-badge">
                            <Camera size={16} />
                            {productImages.length}
                        </div>
                    </div>

                    {productImages.length > 1 && (
                        <div className="image-thumbnails">
                            {productImages.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={img} alt={`${product.title} ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <div className="product-meta">
                        <span className="category-badge">{product.category}</span>
                        {product.condition && (
                            <span className="condition-badge">{product.condition}</span>
                        )}
                    </div>

                    <h1 className="product-title">{product.title}</h1>

                    <div className="rating-section">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.floor(product.rating || 4.5) ? "currentColor" : "none"}
                                    className="star"
                                />
                            ))}
                        </div>
                        <span className="rating-text">
                            {product.rating || "4.5"} ({product.reviews || "23"} reviews)
                        </span>
                    </div>

                    <div className="pricing-section">
                        <div className="current-price">₹{product.price}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <>
                                <div className="original-price">₹{product.originalPrice}</div>
                                <div className="discount-badge">
                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                </div>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <div className="description-section">
                        <h3>Description</h3>
                        <div className={`description-content ${showFullDescription ? 'expanded' : ''}`}>
                            <p>{product.description}</p>
                            {product.features && (
                                <ul className="feature-list">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {product.description && product.description.length > 200 && (
                            <button
                                className="show-more-btn"
                                onClick={() => setShowFullDescription(!showFullDescription)}
                            >
                                {showFullDescription ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>

                    {/* Eco Impact */}
                    <div className="eco-impact-section">
                        <div className="eco-header">
                            <Leaf className="eco-icon" size={20} />
                            <h3>Environmental Impact</h3>
                        </div>
                        <div className="eco-stats">
                            <div className="eco-stat">
                                <span className="eco-number">{ecoStats.co2Saved}kg</span>
                                <span className="eco-label">CO₂ Saved</span>
                            </div>
                            <div className="eco-stat">
                                <span className="eco-number">{ecoStats.waterSaved}L</span>
                                <span className="eco-label">Water Saved</span>
                            </div>
                            <div className="eco-stat">
                                <span className="eco-number">{ecoStats.treesPlanted}</span>
                                <span className="eco-label">Tree Equivalent</span>
                            </div>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="seller-section">
                        <h3>Seller Information</h3>
                        <div className="seller-info">
                            <div className="seller-avatar">
                                {seller.name[0]}
                            </div>
                            <div className="seller-details">
                                <div className="seller-name">{seller.name}</div>
                                <div className="seller-rating">
                                    <Star size={14} fill="currentColor" className="star" />
                                    {seller.rating} ({seller.reviews} reviews)
                                </div>
                                <div className="seller-location">
                                    <MapPin size={14} />
                                    {seller.location}
                                </div>
                            </div>
                            <button className="contact-seller-btn">
                                <MessageCircle size={16} />
                                Contact
                            </button>
                        </div>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="purchase-section">
                        <div className="quantity-selector">
                            <label>Quantity</label>
                            <div className="quantity-controls">
                                <button
                                    className="qty-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="quantity">{quantity}</span>
                                <button
                                    className="qty-btn"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <Button
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={20} />
                            Add to Cart - ₹{product.price * quantity}
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-section">
                        <div className="trust-badge">
                            <Shield size={16} />
                            <span>Secure Payment</span>
                        </div>
                        <div className="trust-badge">
                            <Truck size={16} />
                            <span>Free Delivery</span>
                        </div>
                        <div className="trust-badge">
                            <Calendar size={16} />
                            <span>30-Day Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="related-section">
                    <h3>You Might Also Like</h3>
                    <div className="related-products">
                        {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                            <div key={relatedProduct.id} className="related-item">
                                <img src={relatedProduct.image || "/placeholder.png"} alt={relatedProduct.title} />
                                <div className="related-info">
                                    <h4>{relatedProduct.title}</h4>
                                    <div className="related-price">₹{relatedProduct.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}