import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight } from 'react-icons/fi';
import api from "../api/api";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'PATIENT',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
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
            const response = await api.post("/api/auth/register", formData);
            console.log("Register success:", response.data);

            showToast('Registration successful! Please login.', 'success');
            setTimeout(() => navigate('/login'), 1500);

        } catch (error) {
            console.error("Register error:", error.response?.data || error.message);
            showToast(
                error.response?.data?.message || 'Registration failed. Please try again.',
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
                        <FiUser className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold mb-sm">Create Account</h1>
                    <p className="text-secondary">Join us to never miss a dose</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                    <div className="form-group">
                        <label className="form-label">
                            <FiUser className="inline mr-2" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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
                        <label className="form-label">
                            <FiPhone className="inline mr-2" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="+1234567890"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiLock className="inline mr-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                            required
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="CAREGIVER">Caregiver</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                        <FiArrowRight />
                    </Button>
                </form>

                <div className="mt-lg text-center">
                    <p className="text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
