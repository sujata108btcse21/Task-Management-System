'use client';

import { useState } from 'react';
import './styles.css';

export default function RegisterPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain letters and numbers';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  const userData = {
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password,
    registeredAt: new Date().toISOString()
  };
  
  localStorage.setItem('user', JSON.stringify(userData));
  
  setShowSuccessModal(true);
  
  setTimeout(() => {
    window.location.href = '/';
  }, 2000);
};
  return (
    <>
      <div className="register-container">
        <div className="register-card">
          <h1 className="register-title">
            Create Account
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
              />
              {errors.fullName && (
                <p className="error-message">
                  {errors.fullName}
                </p>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && (
                <p className="error-message">
                  {errors.email}
                </p>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter the password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">
                  {errors.password}
                </p>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter the password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="submit-button"
            >
              Create Account
            </button>
          </form>
          
          <div className="login-link-container">
            <p className="login-text">
              Already have an account?{' '}
              <a 
                href="/"
                className="login-link"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="#10b981" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="success-title">
              Account Created Successfully!
            </h2>

            <p className="success-message">
              Your account has been created successfully. 
              <br />
              Redirecting you to the login page...
            </p>

            <div className="loading-dots">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
            </div>

            <p className="redirect-notice">
              You will be redirected in a few seconds
            </p>
          </div>
        </div>
      )}
    </>
  );
}