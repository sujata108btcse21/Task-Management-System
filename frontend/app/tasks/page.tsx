'use client';

import { useState } from 'react';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState('kanban'); // 'list', 'grid', 'calendar', 'gantt', 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const statusColumns = [
    {
      id: 'not-started',
      title: 'Not Started',
      color: '#6B7280',
      tasks: [
        {
          id: 'task-1',
          title: 'Socials Sept',
          dateRange: '28-30 Sep 2020',
          badge: '+',
          badgeColor: '#F3F4F6',
          priority: 'Low',
          assignees: []
        }
      ]
    },
    {
      id: 'in-review',
      title: 'In Review',
      color: '#8B5CF6',
      tasks: [
        {
          id: 'task-2',
          title: 'Send a brief to the client',
          dateRange: '19-23 Sep 2020',
          badge: '+1',
          badgeColor: '#F3F4F6',
          priority: 'Medium',
          assignees: []
        },
        {
          id: 'task-3',
          title: 'Presentation "Employees..."',
          dateRange: '14-20 Sep 2020',
          badge: '+2',
          badgeColor: '#F3F4F6',
          priority: 'Medium',
          assignees: []
        },
        {
          id: 'task-4',
          title: 'Increase the speed ...',
          dateRange: '1 Oct 2020',
          badge: '+',
          badgeColor: '#F3F4F6',
          priority: 'Low',
          assignees: []
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#3B82F6',
      tasks: [
        {
          id: 'task-5',
          title: 'Content Writing',
          dateRange: '19-23 Sep 2020',
          badge: '+3',
          badgeColor: '#F3F4F6',
          priority: 'High',
          assignees: []
        },
        {
          id: 'task-6',
          title: 'Post for Facebook ...',
          dateRange: '10-25 Sep 2020',
          badge: '+',
          badgeColor: '#F3F4F6',
          priority: 'Medium',
          assignees: []
        },
        {
          id: 'task-7',
          title: 'Study Case',
          dateRange: '22-27 Sep 2020',
          badge: 'Low',
          badgeColor: '#D1FAE5',
          priority: 'Low',
          assignees: []
        },
        {
          id: 'task-8',
          title: 'HR Manager\'s Day',
          dateRange: '22-27 Sep 2020',
          badge: 'Middle',
          badgeColor: '#FEF3C7',
          priority: 'Medium',
          assignees: []
        },
        {
          id: 'task-9',
          title: 'Get a complete store...',
          dateRange: '22-27 Sep 2020',
          badge: 'Middle',
          badgeColor: '#FEF3C7',
          priority: 'Medium',
          assignees: []
        },
        {
          id: 'task-10',
          title: 'Increase conversion ...',
          dateRange: '26-30 Sep 2020',
          badge: 'Low',
          badgeColor: '#D1FAE5',
          priority: 'Low',
          assignees: []
        }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      color: '#10B981',
      tasks: [
        {
          id: 'task-11',
          title: 'Targeted advertising',
          dateRange: '20-26 Sep 2020',
          badge: 'High',
          badgeColor: '#FEE2E2',
          priority: 'High',
          assignees: []
        },
        {
          id: 'task-12',
          title: 'Black Box Testing',
          dateRange: '15-19 Sep 2020',
          badge: 'High',
          badgeColor: '#FEE2E2',
          priority: 'High',
          assignees: []
        }
      ]
    },
    {
      id: 'cancelled',
      title: 'Cancelled',
      color: '#EF4444',
      tasks: [
        {
          id: 'task-13',
          title: 'Increase confidence',
          dateRange: '2-4 Oct 2020',
          badge: '+',
          badgeColor: '#F3F4F6',
          priority: 'Medium',
          assignees: []
        }
      ]
    }
  ];

  const viewModes = [
    { id: 'list', label: 'List' },
    { id: 'grid', label: 'Grid' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'gantt', label: 'Gantt' },
    { id: 'kanban', label: 'Kanban' },
  ];

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    // In real app, would open task details modal or navigate to task page
    console.log(`Selected task: ${taskId}`);
  };

  const filteredStatusColumns = statusColumns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <>
      {/* Header with Search and View Toggle */}
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
            marginBottom: '8px'
          }}>
            Tasks
          </h1>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ 
            position: 'relative',
            width: '300px'
          }}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px 12px 48px',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3B82F6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
            <svg style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: '#9CA3AF'
            }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* View Mode Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            padding: '4px'
          }}>
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: viewMode === mode.id ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: viewMode === mode.id ? '#111827' : '#6B7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: viewMode === mode.id ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
          
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#3B82F6',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M20 12H4" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            New Task
          </button>
        </div>
      </div>

      {/* Kanban Board with Horizontal Scroll */}
      <div style={{
        overflowX: 'auto',
        paddingBottom: '20px',
        marginRight: '-20px',
        marginLeft: '-20px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          minWidth: 'min-content'
        }}>
          {filteredStatusColumns.map((column) => (
            <div key={column.id} style={{
              width: '320px',
              flexShrink: 0
            }}>
              {/* Column Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: column.color,
                    borderRadius: '50%'
                  }}></div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {column.title}
                  </h3>
                </div>
                <span style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: '500'
                }}>
                  {column.tasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task.id)}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Task Title */}
                    <h4 style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {task.title}
                    </h4>

                    {/* Date Range */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '12px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" 
                          stroke="#6B7280" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span style={{
                        fontSize: '13px',
                        color: '#6B7280'
                      }}>
                        {task.dateRange}
                      </span>
                    </div>

                    {/* Badge */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}>
                      <span style={{
                        padding: '4px 10px',
                        backgroundColor: task.badgeColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        {task.badge}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add Task Button */}
                {column.tasks.length === 0 && (
                  <div style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '2px dashed #D1D5DB',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      margin: 0
                    }}>
                      No tasks
                    </p>
                  </div>
                )}

                <button style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  e.currentTarget.style.color = '#6B7280';
                }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M20 12H4" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredStatusColumns.every(col => col.tasks.length === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          marginTop: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#F3F4F6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '32px'
          }}>
            📝
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px'
          }}>
            No tasks found
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            maxWidth: '400px',
            margin: '0 auto 24px'
          }}>
            Try adjusting your search or create a new task to get started.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3B82F6',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Clear search
          </button>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask !== null && (
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
        }}
        onClick={() => setSelectedTask(null)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTask(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: '#6B7280',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '24px'
            }}>
              Task Details
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              marginBottom: '24px'
            }}>
              Task details will be displayed here. Click "Open Task" to view complete information.
            </p>
            
            <button style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#3B82F6',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '20px'
            }}
            onClick={() => setSelectedTask(null)}
            >
              Open Task Details
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Custom scrollbar styling */
        div[style*="overflow-x: auto"]::-webkit-scrollbar {
          height: 8px;
        }
        
        div[style*="overflow-x: auto"]::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 4px;
        }
        
        div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb {
          background: #9CA3AF;
          border-radius: 4px;
        }
        
        div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
    </>
  );
}
