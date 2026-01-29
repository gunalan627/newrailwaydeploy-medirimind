import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import api from "../api/api";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast, ToastContainer } = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/api/auth/login", {
                email: formData.email,
                password: formData.password
            });

            // Save token
            localStorage.setItem("token", response.data.token);

            showToast('Login successful!', 'success');

            // Force reload to update AuthContext state
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);

        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            showToast(
                error.response?.data?.message || 'Login failed. Please check your credentials.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-md" style={{ background: 'var(--gradient-purple)' }}>
            <ToastContainer />

            <div className="card-glass max-w-md w-full animate-fadeIn">
                <div className="text-center mb-xl">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-md shadow-lg">
                        <FiLock className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold mb-sm">Welcome Back</h1>
                    <p className="text-secondary">Sign in to manage your medications</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                    <div className="form-group">
                        <label className="form-label">
                            <FiMail className="inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="flex justify-between items-center mb-sm">
                            <label className="form-label mb-0">
                                <FiLock className="inline mr-2" />
                                Password
                            </label>
                            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 'bold' }}>
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        <FiArrowRight />
                    </Button>
                </form>

                <div className="mt-lg text-center">
                    <p className="text-secondary">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
