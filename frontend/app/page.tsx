'use client';

import { useState } from 'react';

export default function HomePage() {
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleGoogleLogin = () => {
    setShowGoogleModal(true);
    
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  const openForgotPasswordModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPasswordModal(true);
    setResetEmail('');
    setEmailError('');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail || !resetEmail.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    
    console.log(`Reset email sent to: ${resetEmail}`);
    
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setResetEmail('');
      setEmailError('');
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
    
    if (!email || !password) {
      alert('Please fill in both email and password fields.');
      return;
    }
    
    if (email === 'test@example.com' && password === 'password123') {
      alert('Login successful! Redirecting to dashboard...');
      window.location.href = '/dashboard';
    } else {
      alert('Invalid credentials. Try: test@example.com / password123');
    }
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
        padding: '80px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          minHeight: '620px'
        }}>
          <div style={{
            flex: 1.2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 50px'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '420px'
            }}>
              <div style={{ textAlign: 'left', marginBottom: '40px' }}>
                <h1 style={{ 
                  fontSize: '32px', 
                  color: '#111827',
                  marginBottom: '12px',
                  fontWeight: '700',
                  lineHeight: '1.2'
                }}>
                  Welcome Back!
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Please enter login details below
                </p>
              </div>
              
              <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: '24px' }}>
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
                    placeholder="Enter the email"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #d1d5db',
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
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter the Password"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #d1d5db',
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
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  marginBottom: '28px' 
                }}>
                  <a 
                    href="#"
                    onClick={openForgotPasswordModal}
                    style={{ 
                      color: '#4f46e5', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Forgot password?
                  </a>
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
                    marginBottom: '28px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                >
                  Sign in
                </button>
              </form>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '28px' 
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                <span style={{ 
                  padding: '0 16px', 
                  color: '#6b7280', 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Or continue
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
              </div>
              
              <button
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '32px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Log in with Google
              </button>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '15px'
                }}>
                  Don't have an account?{' '}
                  <a 
                    href="/register"
                    style={{ 
                      color: '#4f46e5', 
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(124, 58, 237, 0.03) 100%)'
              }}></div>
              
              <img 
                src="/time.jpg" 
                alt="Task Management"
                style={{
                  width: '90%',
                  height: '95%',
                  borderRadius: '10px',
                  objectPosition: 'center',
                  zIndex: 1,
                  position: 'relative'
                }}
                onError={(e) => {
                  e.currentTarget.src = '';
                }}
              />
              
              <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                right: '40px',
                zIndex: 2,
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  Manage your task in a easy and more efficient way
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForgotPasswordModal && (
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
            padding: '40px',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Reset Your Password
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleResetSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `1px solid ${emailError ? '#ef4444' : '#d1d5db'}`,
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
                    e.target.style.borderColor = emailError ? '#ef4444' : '#d1d5db';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
                {emailError && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    marginTop: '8px'
                  }}>
                    {emailError}
                  </p>
                )}
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px',
                marginTop: '30px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                >
                  Send Reset Link
                </button>
              </div>
            </form>

            {!emailError && resetEmail.includes('@') && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#d1fae5',
                borderRadius: '8px',
                textAlign: 'center',
                animation: 'fadeIn 0.3s ease-in'
              }}>
                <p style={{
                  color: '#065f46',
                  fontSize: '14px',
                  fontWeight: '500',
                  margin: 0
                }}>
                  ✓ Reset link sent to {resetEmail}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showGoogleModal && (
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
              width: '60px',
              height: '60px',
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              border: '2px solid #e5e7eb'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Redirecting to Google
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.5',
              marginBottom: '30px'
            }}>
              Please wait while we redirect you to Google authentication...
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
              You will be redirected to the dashboard shortly
            </p>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
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