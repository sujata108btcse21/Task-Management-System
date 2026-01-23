'use client';

import { useState, useEffect, useRef } from 'react';

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock user data (in real app, this would come from auth context/API)
  const [user, setUser] = useState({
    name: 'Jacob Doe',
    email: 'jacob.doe@example.com',
    initials: 'JM',
    role: 'Admin'
  });

  const stats = [
    { title: 'Total Tasks', value: '156', change: '+12%', color: '#3B82F6' },
    { title: 'Completed', value: '89', change: '+8%', color: '#10B981' },
    { title: 'In Progress', value: '42', change: '-3%', color: '#F59E0B' },
    { title: 'Overdue', value: '25', change: '+2%', color: '#EF4444' },
  ];

  const recentActivities = [
    { user: 'Emma Wilson', action: 'completed', task: 'Q3 Financial Report', time: '10 min ago' },
    { user: 'Michael Chen', action: 'uploaded', task: 'Design Mockups', time: '45 min ago' },
    { user: 'Sarah Johnson', action: 'commented', task: 'Marketing Campaign', time: '2 hours ago' },
    { user: 'Alex Rivera', action: 'assigned', task: 'Client Meeting Notes', time: '4 hours ago' },
  ];

  const tasks = [
    { title: 'Prepare Board Meeting Presentation', priority: 'High', due: 'Today', progress: 75 },
    { title: 'Review Q3 Marketing Strategy', priority: 'Medium', due: 'Tomorrow', progress: 30 },
    { title: 'Update Employee Handbook', priority: 'Low', due: 'Next Week', progress: 10 },
    { title: 'Client Proposal - TechCorp', priority: 'High', due: 'Today', progress: 90 },
  ];

  const teamMembers = [
    { name: 'Alex Johnson', role: 'Project Manager', tasks: 12, avatarColor: '#3B82F6' },
    { name: 'Sarah Miller', role: 'UX Designer', tasks: 8, avatarColor: '#8B5CF6' },
    { name: 'Marcus Lee', role: 'Frontend Dev', tasks: 15, avatarColor: '#10B981' },
    { name: 'Priya Patel', role: 'Backend Dev', tasks: 11, avatarColor: '#F59E0B' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Redirect to login
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px',
        position: 'relative'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Dashboard
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#6B7280'
          }}>
            Welcome! Here's what's happening today.
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: '#F3F4F6',
            padding: '4px',
            borderRadius: '8px'
          }}>
            {['All', 'Today', 'This Week', 'Overdue'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedFilter === filter ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: selectedFilter === filter ? '#111827' : '#6B7280',
                  cursor: 'pointer',
                  boxShadow: selectedFilter === filter ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  outline: 'none'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
          
          {/* User Avatar with Dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {user.initials}
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                border: '1px solid #E5E7EB',
                minWidth: '280px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                {/* User Info Section */}
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #F3F4F6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '18px'
                    }}>
                      {user.initials}
                    </div>
                    <div>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {user.name}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '8px'
                      }}>
                        {user.email}
                      </p>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        backgroundColor: '#F3F4F6',
                        color: '#6B7280',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6B7280',
                  marginBottom: '8px'
                }}>
                  {stat.title}
                </p>
                <p style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {stat.value}
                </p>
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px',
                borderRadius: '8px',
                backgroundColor: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M18 12L12 18L6 12" 
                    stroke={stat.color} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p style={{ 
              fontSize: '14px', 
              color: stat.change.startsWith('+') ? '#10B981' : '#EF4444',
              marginTop: '12px'
            }}>
              {stat.change} from last week
            </p>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '32px'
      }}>
        {/* Main Content */}
        <div>
          {/* Recent Tasks */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600',
                color: '#111827'
              }}>
                Recent Tasks
              </h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#6B7280',
                cursor: 'pointer'
              }}>
                View All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {tasks.map((task, index) => (
                <div key={index} style={{ 
                  padding: '20px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  backgroundColor: index === 0 ? '#F0F9FF' : 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <p style={{ 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {task.title}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#6B7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <div style={{ 
                            width: '8px', 
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 
                              task.priority === 'High' ? '#EF4444' : 
                              task.priority === 'Medium' ? '#F59E0B' : '#10B981'
                          }}></div>
                          {task.priority} Priority
                        </span>
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                          Due: {task.due}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '6px 12px',
                        backgroundColor: '#F3F4F6',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#374151',
                        cursor: 'pointer'
                      }}>
                        Edit
                      </button>
                      <button style={{
                        padding: '6px 12px',
                        backgroundColor: '#10B981',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'white',
                        cursor: 'pointer'
                      }}>
                        Complete
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>Progress</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{task.progress}%</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${task.progress}%`, 
                        height: '100%',
                        backgroundColor: task.progress > 70 ? '#10B981' : task.progress > 30 ? '#3B82F6' : '#F59E0B',
                        borderRadius: '3px'
                      }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Performance */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#111827',
              marginBottom: '24px'
            }}>
              Team Performance
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {teamMembers.map((member, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: member.avatarColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '18px'
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {member.name}
                      </p>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6B7280'
                      }}>
                        {member.role}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      fontSize: '24px', 
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {member.tasks}
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6B7280'
                    }}>
                      Active Tasks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Recent Activity */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#111827',
              marginBottom: '24px'
            }}>
              Recent Activity
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recentActivities.map((activity, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 
                      activity.action === 'completed' ? '#D1FAE5' :
                      activity.action === 'uploaded' ? '#DBEAFE' :
                      activity.action === 'commented' ? '#FEF3C7' : '#E0E7FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {activity.action === 'completed' ? (
                        <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : activity.action === 'uploaded' ? (
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" 
                          stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : activity.action === 'commented' ? (
                        <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11441 17.053 3.99479 18.5291 5.47086C20.0052 6.94694 20.8856 8.91565 21 11V11.5Z" 
                          stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                          stroke="#8B5CF6" strokeWidth="2"/>
                      )}
                    </svg>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#111827',
                      marginBottom: '2px',
                      lineHeight: '1.4'
                    }}>
                      <strong>{activity.user}</strong> {activity.action} {activity.task}
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6B7280'
                    }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600',
                color: '#111827'
              }}>
                Upcoming Events
              </h2>
              <span style={{ 
                fontSize: '14px', 
                color: '#6B7280'
              }}>
                Today
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                padding: '16px',
                backgroundColor: '#F0F9FF',
                borderRadius: '8px',
                borderLeft: '4px solid #3B82F6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    Team Standup
                  </p>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#3B82F6'
                  }}>
                    9:00 AM
                  </span>
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6B7280',
                  marginBottom: '12px'
                }}>
                  Daily sync with the development team
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#DBEAFE',
                    color: '#1E40AF',
                    borderRadius: '4px'
                  }}>
                    Remote
                  </span>
                  <span style={{ 
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    borderRadius: '4px'
                  }}>
                    30 min
                  </span>
                </div>
              </div>

              <div style={{ 
                padding: '16px',
                backgroundColor: '#FEFCE8',
                borderRadius: '8px',
                borderLeft: '4px solid #F59E0B'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    Client Review
                  </p>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#F59E0B'
                  }}>
                    2:00 PM
                  </span>
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6B7280',
                  marginBottom: '12px'
                }}>
                  Q3 Performance review with TechCorp
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    borderRadius: '4px'
                  }}>
                    Conference Room A
                  </span>
                  <span style={{ 
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    borderRadius: '4px'
                  }}>
                    1 hour
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}