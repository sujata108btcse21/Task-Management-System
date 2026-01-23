'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [selectedTeam, setSelectedTeam] = useState('Management');

  const tasksByPriority = [
    { category: 'High', tasks: 12, completed: 8, inProgress: 11, overdue: 32, color: '#EF4444' },
    { category: 'Middle', tasks: 12, completed: 8, inProgress: 11, overdue: 31, color: '#F59E0B' },
    { category: 'Low', tasks: 12, completed: 8, inProgress: 11, overdue: 30, color: '#10B981' },
    { category: 'Total', tasks: 12, completed: 8, inProgress: 11, overdue: 32, color: '#3B82F6' },
  ];

  const teamMembers = [
    { initials: 'FM', name: 'Floyd Miles', role: 'Content manager' },
    { initials: 'LA', name: 'Leslie Alexander', role: 'Programmer' },
    { initials: 'KW', name: 'Kristin Watson', role: 'Content manager' },
    { initials: 'JD', name: 'Jacob Doe', role: 'Admin' },
  ];

  const upcomingMeetings = [
    { title: 'Technical interview with Carl ...', time: '10:00 AM' },
    { title: 'Meeting with customer', time: '2:30 PM' },
  ];

  return (
    <>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '30px', 
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            Dashboard
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#6B7280'
          }}>
            Monday, 21 September 2020
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px'
        }}>
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="#4B5563" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Add Task
          </button>
          
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
        </div>
      </div>

      {/* Welcome Card */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600',
          color: '#111827',
          marginBottom: '12px'
        }}>
          Welcome Back, Jacob!
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#6B7280',
          lineHeight: '1.5'
        }}>
          You have <strong>6 tasks</strong> for today. You have already completed <strong>50%</strong> of tasks.
          Your progress is <strong style={{ color: '#10B981' }}>very good</strong>.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* Left Column */}
        <div>
          {/* Upcoming Meetings */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#111827',
              marginBottom: '20px'
            }}>
              Upcoming meetings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {upcomingMeetings.map((meeting, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#3B82F6',
                    marginTop: '6px',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '15px', 
                      color: '#111827',
                      marginBottom: '2px'
                    }}>
                      {meeting.title}
                    </p>
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#6B7280'
                    }}>
                      {meeting.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Team */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#111827'
              }}>
                My Team
              </h3>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: '#F3F4F6',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  Team: {selectedTeam}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9L12 16L5 9" 
                    stroke="#4B5563" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Team Members List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {teamMembers.map((member, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: index === 0 ? '#3B82F6' : 
                                    index === 1 ? '#10B981' : 
                                    index === 2 ? '#8B5CF6' : '#F59E0B',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {member.initials}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#111827',
                      fontWeight: '500',
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
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Tasks by Priority */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#111827',
            marginBottom: '20px'
          }}>
            Tasks
          </h3>
          
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '15px', 
              fontWeight: '500',
              color: '#6B7280',
              marginBottom: '16px'
            }}>
              Tasks by: priority
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {tasksByPriority.map((item, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#6B7280',
                    marginBottom: '8px'
                  }}>
                    {item.category}
                  </p>
                  <div style={{ 
                    width: '40px', 
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '14px',
                    margin: '0 auto 8px'
                  }}>
                    {item.tasks}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    <div>{item.completed}</div>
                    <div>{item.inProgress}</div>
                    <div>{item.overdue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
