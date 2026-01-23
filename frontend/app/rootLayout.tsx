'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(() => {
    // Determine active item based on current path
    if (pathname.includes('/boards')) return 'boards';
    if (pathname.includes('/tasks')) return 'tasks';
    if (pathname.includes('/meetings')) return 'meetings';
    if (pathname.includes('/timesheets')) return 'timesheets';
    return 'dashboard'; // default
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'boards', label: 'Boards', path: '/boards' },
    { id: 'tasks', label: 'Tasks', path: '/tasks' },
    { id: 'meetings', label: 'Meetings', path: '/meetings' },
    { id: 'timesheets', label: 'Timesheets', path: '/timesheets' },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    setActiveItem(item.id);
    router.push(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#FFFFFF',
      display: 'flex'
    }}>
      {/* Fixed Left Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #E5E7EB',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '48px',
          paddingLeft: '8px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#111827',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            T
          </div>
          <span style={{ 
            fontSize: '22px', 
            fontWeight: '700',
            color: '#111827'
          }}>
            TaskFlow
          </span>
        </div>

        {/* Menu Items */}
        <nav>
          <h2 style={{ 
            fontSize: '14px', 
            color: '#6B7280',
            fontWeight: '500',
            marginBottom: '16px',
            paddingLeft: '8px',
            letterSpacing: '0.5px'
          }}>
            Navigation
          </h2>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.id} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => handleNavigation(item)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: activeItem === item.id ? '#F3F4F6' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: activeItem === item.id ? '#111827' : '#6B7280',
                    fontWeight: activeItem === item.id ? '600' : '400',
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
                  <span>{item.label}</span>
                  {activeItem === item.id && (
                    <div style={{
                      width: '4px',
                      height: '20px',
                      backgroundColor: '#3B82F6',
                      borderRadius: '2px'
                    }}></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ flex: 1 }}></div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px 20px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#DC2626',
            fontWeight: '600',
            marginTop: 'auto',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 16L21 12M21 12L17 8M21 12H9M13 16C13 17.6569 11.6569 19 10 19H6C4.34315 19 3 17.6569 3 16V8C3 6.34315 4.34315 5 6 5H10C11.6569 5 13 6.34315 13 8" 
              stroke="#DC2626" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        marginLeft: '280px',
        flex: 1,
        padding: '40px 48px',
        overflowY: 'auto',
        minHeight: '100vh',
        backgroundColor: pathname.includes('/boards') ? '#F9FAFB' : '#FFFFFF'
      }}>
        {children}
      </main>
    </div>
  );
}
