import React, { useState, useEffect } from "react";
import { User, Mail, Edit3, Camera, Award, Leaf, ShoppingBag, LogOut } from "lucide-react";

// =============================================================================
//  API SERVICE CONFIGURATION
// =============================================================================
// The backend URL is read from an environment variable.
// For local development, create a `.env` file in your project root with:
// REACT_APP_API_URL=http://localhost:5000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const authService = {
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }
        return response.json();
    },
    signup: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Signup failed');
        }
        return response.json();
    }
};


// =============================================================================
//  UI COMPONENTS
// =============================================================================

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

const Profile = ({ user, onLogout }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    if (!user) {
        return (
            <div className="profile-container">
                <div className="profile-card p-8">
                    <p className="text-gray-600 text-center">Loading user profile...</p>
                </div>
            </div>
        );
    }

    const displayUser = {
        username: user.username || "EcoWarrior23",
        email: user.email || "eco.warrior@ecofinds.com",
        avatar: user.avatar || null,
        joinDate: user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "March 2024",
        itemsSold: user.itemsSold || 47,
        itemsBought: user.itemsBought || 23,
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
            <div className={`profile-card ${isHovered ? 'hovered' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <div className="profile-header">
                    <div className="avatar-container">
                        <Avatar src={displayUser.avatar} size={120} alt={`${displayUser.username}'s avatar`} />
                        <button className="avatar-edit-btn"><Camera size={16} /></button>
                    </div>
                    <div className="user-info">
                        <div className="username-section">
                            <h2 className="username">{displayUser.username}</h2>
                            <button className="edit-btn"><Edit3 size={18} /></button>
                        </div>
                        <p className="email"><Mail size={16} />{displayUser.email}</p>
                        <p className="join-date">Member since {displayUser.joinDate}</p>
                    </div>
                    <button onClick={onLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>

                <div className="profile-tabs">
                    {['overview', 'activity', 'impact'].map((tab) => (
                        <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
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
                                            <div className="stat-icon" style={{ color: stat.color }}><IconComponent size={24} /></div>
                                            <div className="stat-info"><span className="stat-value">{stat.value}</span><span className="stat-label">{stat.label}</span></div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="achievements">
                                <h3>Recent Achievements</h3>
                                <div className="achievement-badges">
                                    <div className="badge eco-champion"><Leaf size={20} /><span>Eco Champion</span></div>
                                    <div className="badge trusted-seller"><Award size={20} /><span>Trusted Seller</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'activity' && <div className="activity-content"><div className="activity-summary"><div className="activity-item"><span className="activity-number">{displayUser.itemsSold}</span><span className="activity-text">Items Successfully Sold</span></div><div className="activity-item"><span className="activity-number">{displayUser.itemsBought}</span><span className="activity-text">Items Purchased</span></div></div></div>}
                    {activeTab === 'impact' && <div className="impact-content"><div className="impact-stats"><div className="impact-item"><div className="impact-icon">💰</div><div><span className="impact-value">{displayUser.totalSaved}</span><span className="impact-label">Total Money Saved</span></div></div><div className="impact-item"><div className="impact-icon">🌱</div><div><span className="impact-value">{displayUser.co2Reduced}</span><span className="impact-label">CO₂ Emissions Reduced</span></div></div></div></div>}
                </div>
            </div>
        </div>
    );
};

const Login = ({ onLogin, onError }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [username, setUsername] = useState("");

    const Input = (props) => <input {...props} className="input-field" />;
    const Button = (props) => <button {...props} className={`button-primary ${props.className}`} />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (isSignupMode) {
                const signupData = { email, password };
                if (username.trim()) {
                    signupData.username = username;
                }
                const result = await authService.signup(signupData);
                if (result.userId) {
                    const loginResult = await authService.login({ email, password });
                    if (loginResult.token) {
                        localStorage.setItem('authToken', loginResult.token);
                        localStorage.setItem('user', JSON.stringify(loginResult.user));
                        onLogin({ user: loginResult.user, token: loginResult.token });
                    }
                }
            } else {
                const result = await authService.login({ email, password });
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    onLogin({ user: result.user, token: result.token });
                }
            }
        } catch (err) {
            setError(err.message);
            if (onError) {
                onError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignupMode(!isSignupMode);
        setError("");
        setEmail("");
        setPassword("");
        setUsername("");
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <h1 className="logo-text">EcoFinds</h1>
                    </div>
                    <p className="login-subtitle">
                        {isSignupMode ? "Join the sustainable shopping community" : "Welcome back to sustainable shopping"}
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    {isSignupMode && (
                        <div className="input-group">
                            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                        </div>
                    )}
                    <div className="input-group">
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                    </div>
                    <div className="input-group">
                        <div className="password-input-container">
                            <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required minLength={6} />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                            </button>
                        </div>
                    </div>
                    {!isSignupMode && <div className="form-options"><label className="remember-me"><input type="checkbox" /><span className="checkmark"></span>Remember me</label><a href="#" className="forgot-password">Forgot password?</a></div>}
                    <Button type="submit" className={`login-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                        {isLoading ? <><div className="spinner"></div>{isSignupMode ? 'Creating account...' : 'Signing in...'}</> : (isSignupMode ? 'Create Account' : 'Sign In')}
                    </Button>
                </form>

                <div className="login-divider"><span>or continue with</span></div>
                <div className="social-login">
                    <button className="social-button google" type="button"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg> Google</button>
                    <button className="social-button apple" type="button"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.86 11.35 7.75 12.11 7.75C12.87 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" /></svg> Apple</button>
                </div>

                <div className="signup-link"><p>{isSignupMode ? "Already have an account? " : "Don't have an account? "} <button type="button" className="mode-toggle-link" onClick={toggleMode}>{isSignupMode ? "Sign in here" : "Create one here"}</button></p></div>
            </div>
        </div>
    );
};


// =============================================================================
//  MAIN APP COMPONENT (CONTROLS AUTH FLOW)
// =============================================================================
export default function App() {
    const [auth, setAuth] = useState({ token: null, user: null });
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        if (token && user) {
            try {
                setAuth({ token, user: JSON.parse(user) });
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.clear();
            }
        }
        setIsAuthChecked(true);
    }, []);

    const handleLogin = (authData) => {
        setAuth(authData);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuth({ token: null, user: null });
    };

    if (!isAuthChecked) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <>
            
            {auth.token && auth.user ? (
                <Profile user={auth.user} onLogout={handleLogout} />
            ) : (
                <Login onLogin={handleLogin} onError={(err) => console.error(err)} />
            )}
        </>
    );
}
