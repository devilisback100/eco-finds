import React, { useState } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import "./Signup.css";

// API configuration - Fixed to work with your Flask backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Signup({ onSignup, onSuccess }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear field-specific error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
        // Clear general error
        if (generalError) {
            setGeneralError("");
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Username is optional but if provided, validate it
        if (form.username.trim() && form.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});
        setGeneralError("");

        try {
            // Updated to match your Flask backend
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    username: form.username || undefined // Only include if provided
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Your Flask backend returns { message, userId } on successful signup
                // Now we need to login to get the token and user data
                try {
                    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: form.email,
                            password: form.password
                        }),
                    });

                    const loginData = await loginResponse.json();

                    if (loginResponse.ok) {
                        // Store JWT token and user data
                        localStorage.setItem('authToken', loginData.token);
                        localStorage.setItem('user', JSON.stringify(loginData.user));

                        // Success - call the success callback with the full response
                        if (onSuccess) {
                            onSuccess({
                                ...data,
                                token: loginData.token,
                                user: loginData.user
                            });
                        }
                        // Also call the original onSignup if provided for backward compatibility
                        if (onSignup) {
                            onSignup({
                                ...data,
                                token: loginData.token,
                                user: loginData.user
                            });
                        }
                    } else {
                        // Login failed after successful signup
                        setGeneralError('Account created but login failed. Please try logging in manually.');
                    }
                } catch (loginError) {
                    console.error('Login after signup error:', loginError);
                    setGeneralError('Account created but login failed. Please try logging in manually.');
                }
            } else {
                // Handle server errors - Updated for Flask backend error format
                if (data.error) {
                    // Flask backend returns errors in 'error' field
                    setGeneralError(data.error);
                } else {
                    setGeneralError('Failed to create account. Please try again.');
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            setGeneralError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup">
            <h2>Create Account</h2>
            {generalError && (
                <div className="error-message general-error">
                    {generalError}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <Input
                    label="Username (optional)"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    error={errors.username}
                    disabled={loading}
                />
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={loading}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    disabled={loading}
                    required
                />
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </form>
        </div>
    );
}