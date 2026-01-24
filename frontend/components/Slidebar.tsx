'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../../lib/user';
import './styles.css';

export default function Sidebar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'boards', label: 'Boards', icon: '📋', path: '/boards' },
    { id: 'tasks', label: 'Tasks', icon: '✅', path: '/tasks' },
    { id: 'timesheet', label: 'Meetings', icon: '📅', path: '/timesheet' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleNavigation = (item: typeof menuItems[0]) => {
    setActiveItem(item.id);
    router.push(item.path);
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          T
        </div>
        <span className="logo-text">
          TaskFlow
        </span>
      </div>

      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.id} className="menu-item">
              <button
                onClick={() => handleNavigation(item)}
                className={`menu-button ${activeItem === item.id ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="logout-section">
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
