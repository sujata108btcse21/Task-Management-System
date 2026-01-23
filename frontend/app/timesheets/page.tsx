'use client';

import { useState } from 'react';

export default function TimesheetsPage() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Data structure matching the new screenshot format
  const tasks = [
    {
      id: 1,
      title: 'Study Case',
      times: {
        'Mon, 15 Sep': '8:00',
        'Tue, 16 Sep': '4:00',
        'Wed, 17 Sep': '2:30',
        'Thu, 18 Sep': '0:30',
        'Fri, 19 Sep': '6:00',
        'Sat, 20 Sep': '1:00',
        'Sun, 21 Sep': '0:00',
        'Total': '22:00'
      }
    },
    {
      id: 2,
      title: 'Socials Sept',
      times: {
        'Mon, 15 Sep': '2:00',
        'Tue, 16 Sep': '3:00',
        'Wed, 17 Sep': '1:30',
        'Thu, 18 Sep': '2:00',
        'Fri, 19 Sep': '1:00',
        'Sat, 20 Sep': '0:30',
        'Sun, 21 Sep': '0:00',
        'Total': '10:00'
      }
    },
    {
      id: 3,
      title: 'Black Box Testing',
      times: {
        'Mon, 15 Sep': '1:00',
        'Tue, 16 Sep': '2:00',
        'Wed, 17 Sep': '3:00',
        'Thu, 18 Sep': '1:30',
        'Fri, 19 Sep': '0:30',
        'Sat, 20 Sep': '0:00',
        'Sun, 21 Sep': '0:00',
        'Total': '8:00'
      }
    },
    {
      id: 4,
      title: 'Content Writing',
      times: {
        'Mon, 15 Sep': '0:30',
        'Tue, 16 Sep': '1:00',
        'Wed, 17 Sep': '0:30',
        'Thu, 18 Sep': '2:00',
        'Fri, 19 Sep': '1:00',
        'Sat, 20 Sep': '0:30',
        'Sun, 21 Sep': '0:00',
        'Total': '5:30'
      }
    },
    {
      id: 5,
      title: 'Targeted advertising',
      times: {
        'Mon, 15 Sep': '3:00',
        'Tue, 16 Sep': '2:00',
        'Wed, 17 Sep': '1:00',
        'Thu, 18 Sep': '3:00',
        'Fri, 19 Sep': '2:00',
        'Sat, 20 Sep': '1:00',
        'Sun, 21 Sep': '0:00',
        'Total': '12:00'
      }
    },
    {
      id: 6,
      title: 'Presentation "Employees ..."',
      times: {
        'Mon, 15 Sep': '1:00',
        'Tue, 16 Sep': '1:30',
        'Wed, 17 Sep': '2:00',
        'Thu, 18 Sep': '1:00',
        'Fri, 19 Sep': '0:30',
        'Sat, 20 Sep': '0:00',
        'Sun, 21 Sep': '0:00',
        'Total': '6:00'
      }
    }
  ];

  const columns = [
    'Tasks',
    'Mon, 15 Sep',
    'Tue, 16 Sep',
    'Wed, 17 Sep',
    'Thu, 18 Sep',
    'Fri, 19 Sep',
    'Sat, 20 Sep',
    'Sun, 21 Sep',
    'Total'
  ];

  const handleTaskClick = (taskId: number) => {
    setSelectedTask(taskId);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateColumnTotals = () => {
    const totals: {[key: string]: string} = {};
    
    columns.forEach(column => {
      if (column === 'Tasks') return;
      
      const times = tasks.map(task => task.times[column]);
      let totalMinutes = 0;
      
      times.forEach(time => {
        if (time) {
          const [hours, minutes] = time.split(':').map(Number);
          totalMinutes += hours * 60 + (minutes || 0);
        }
      });
      
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      totals[column] = `${totalHours}:${remainingMinutes.toString().padStart(2, '0')}`;
    });
    
    return totals;
  };

  const columnTotals = calculateColumnTotals();

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
      }}>
        <div style={{ 
          flex: 1,
          maxWidth: '300px'
        }}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.boxShadow = 'none';
            }}
          />
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
        </div>
      </div>
        
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600',
          color: '#1a1a1a',
          margin: 0
        }}>
          Timesheets
        </h1>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          gap: '8px',
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          padding: '4px'
        }}>
          <button
            style={{
              padding: '6px 16px',
              border: 'none',
              background: '#3b82f6',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              cursor: 'default'
            }}
          >
            List
          </button>
          <button
            disabled
            style={{
              padding: '6px 16px',
              border: 'none',
              background: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#999',
              cursor: 'not-allowed',
              opacity: 0.7
            }}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Timesheet Table */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '30px'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          {columns.map((column, index) => (
            <div key={index} style={{
              fontWeight: '600',
              fontSize: '14px',
              color: '#333',
              textAlign: index === 0 ? 'left' : 'center',
              padding: '0 10px'
            }}>
              {column}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <div>
          {filteredTasks.map((task) => (
            <div 
              key={task.id}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleTaskClick(task.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Task Name */}
              <div style={{
                fontSize: '14px',
                color: '#333',
                fontWeight: '500',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {task.title}
              </div>

              {/* Time Entries for Each Day */}
              {columns.slice(1).map((column, index) => (
                <div 
                  key={index}
                  style={{
                    fontSize: '14px',
                    color: '#333',
                    textAlign: 'center',
                    padding: '0 10px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {task.times[column] || '0:00'}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Total Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
          backgroundColor: '#f8f9fa',
          borderTop: '2px solid #e0e0e0',
          padding: '16px 20px',
          fontWeight: '600'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#333',
            padding: '0 10px'
          }}>
            Total
          </div>
          
          {columns.slice(1).map((column, index) => (
            <div 
              key={index}
              style={{
                fontSize: '14px',
                color: '#333',
                textAlign: 'center',
                padding: '0 10px'
              }}
            >
              {columnTotals[column] || '0:00'}
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Search and Workspace Info */}
      

      {/* Modal for Task Details */}
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
          zIndex: 1000
        }}
        onClick={() => setSelectedTask(null)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const task = tasks.find(t => t.id === selectedTask);
              if (!task) return null;
              
              return (
                <>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '20px'
                  }}>
                    {task.title} - Time Details
                  </h2>
                  
                  <div style={{
                    marginBottom: '20px'
                  }}>
                    {columns.slice(1, -1).map((column, index) => (
                      <div 
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 0',
                          borderBottom: index < columns.length - 2 ? '1px solid #f0f0f0' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          {column}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {task.times[column] || '0:00'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0',
                    marginTop: '16px'
                  }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      Total:
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
                      {task.times['Total']}
                    </span>
                  </div>
                  
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: 'white',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                  onClick={() => setSelectedTask(null)}
                  >
                    Close Details
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}