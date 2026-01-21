'use client';

import { useState } from 'react';

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

    setShowSuccessModal(true);
    
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  return (
    <>
      <div style={{ 
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '48px 40px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h1 style={{ 
            fontSize: '30px', 
            color: '#111827',
            marginBottom: '30px',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            Create Account
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151',
                fontSize: '14px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `1px solid ${errors.fullName ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: '#f9fafb',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4f46e5';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.fullName ? '#ef4444' : '#d1d5db';
                  e.target.style.backgroundColor = '#f9fafb';
                }}
              />
              {errors.fullName && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '13px',
                  marginTop: '6px',
                  marginBottom: 0
                }}>
                  {errors.fullName}
                </p>
              )}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151',
                fontSize: '14px'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: '#f9fafb',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4f46e5';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#ef4444' : '#d1d5db';
                  e.target.style.backgroundColor = '#f9fafb';
                }}
              />
              {errors.email && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '13px',
                  marginTop: '6px',
                  marginBottom: 0
                }}>
                  {errors.email}
                </p>
              )}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151',
                fontSize: '14px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter the password"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingRight: '50px',
                    border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4f46e5';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#ef4444' : '#d1d5db';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: '14px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? (
                    <span style={{ fontSize: '12px' }}>Hide</span>
                  ) : (
                    <span style={{ fontSize: '12px' }}>Show</span>
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '13px',
                  marginTop: '6px',
                  marginBottom: 0
                }}>
                  {errors.password}
                </p>
              )}
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151',
                fontSize: '14px'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter the password"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingRight: '50px',
                    border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4f46e5';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#d1d5db';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: '14px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showConfirmPassword ? (
                    <span style={{ fontSize: '12px' }}>Hide</span>
                  ) : (
                    <span style={{ fontSize: '12px' }}>Show</span>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '13px',
                  marginTop: '6px',
                  marginBottom: 0
                }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#4f46e5',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              Create Account
            </button>
          </form>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '15px'
            }}>
              Already have an account?{' '}
              <a 
                href="/"
                style={{ 
                  color: '#4f46e5', 
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '50px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#d1fae5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              border: '2px solid #10b981'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="#10b981" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Account Created Successfully!
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.5',
              marginBottom: '30px'
            }}>
              Your account has been created successfully. 
              <br />
              Redirecting you to the login page...
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#4f46e5',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both'
              }}></div>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#4f46e5',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both',
                animationDelay: '0.2s'
              }}></div>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#4f46e5',
                borderRadius: '50%',
                animation: 'bounce 1.4s infinite ease-in-out both',
                animationDelay: '0.4s'
              }}></div>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              fontStyle: 'italic'
            }}>
              You will be redirected in a few seconds
            </p>
            <style>{`
              @keyframes bounce {
                0%, 80%, 100% { 
                  transform: scale(0);
                } 
                40% { 
                  transform: scale(1.0);
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}