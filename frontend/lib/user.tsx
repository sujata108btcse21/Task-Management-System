// Helper function to get user from localStorage
export const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Helper function to get initials from name
export const getInitials = (name: string) => {
  if (!name) return 'US';
  
  return name
    .split(' ')
    .map(word => word[0])
    .filter(char => char) // Remove empty strings
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Logout function
export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
};

// Get user data for dashboard
export const getUserData = () => {
  const user = getUserFromStorage();
  
  if (user) {
    return {
      name: user.fullName || 'User',
      email: user.email || '',
      initials: getInitials(user.fullName || 'User'),
      role: 'User'
    };
  }
  
  // Fallback to mock data if no user is found
  return {
    name: 'Guest User',
    email: 'guest@example.com',
    initials: 'GU',
    role: 'Guest'
  };
};