'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'board', label: 'Board', icon: '📊' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    // Clear any authentication tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  return (
    <aside style={{
      width: '250px',
      backgroundColor: 'white',
      borderRight: '1px solid #E5E7EB',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Logo */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '40px',
        paddingLeft: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          backgroundColor: '#3B82F6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          T
        </div>
        <span style={{ 
          fontSize: '20px', 
          fontWeight: '700',
          color: '#111827'
        }}>
          TaskFlow
        </span>
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '8px' }}>
              <button
                onClick={() => {
                  setActiveItem(item.id);
                  router.push(`/${item.id === 'dashboard' ? 'dashboard' : item.id}`);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: activeItem === item.id ? '#F3F4F6' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  color: activeItem === item.id ? '#111827' : '#6B7280',
                  fontWeight: activeItem === item.id ? '500' : '400',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div style={{ 
        borderTop: '1px solid #E5E7EB', 
        paddingTop: '20px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          padding: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#3B82F6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            JD
          </div>
          <div>
            <p style={{ 
              fontSize: '15px', 
              color: '#111827',
              fontWeight: '500',
              marginBottom: '2px'
            }}>
              Jacob Doe
            </p>
            <p style={{ 
              fontSize: '13px', 
              color: '#6B7280'
            }}>
              Admin
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '15px',
            color: '#DC2626',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
          }}
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
