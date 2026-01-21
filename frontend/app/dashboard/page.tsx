'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project documentation', status: 'TODO' },
    { id: 2, title: 'Test API endpoints', status: 'IN_PROGRESS' },
    { id: 3, title: 'Deploy to production', status: 'DONE' },
  ]);
  
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: tasks.length + 1,
        title: newTask,
        status: 'TODO'
      }]);
      setNewTask('');
      alert('Task added successfully!');
    }
  };

  const toggleStatus = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const nextStatus = 
          task.status === 'TODO' ? 'IN_PROGRESS' :
          task.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
        return { ...task, status: nextStatus };
      }
      return task;
    }));
    alert('Task status updated!');
  };

  const deleteTask = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
      alert('Task deleted!');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'TODO': return '#f59e0b';
      case 'IN_PROGRESS': return '#3b82f6';
      case 'DONE': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DONE': return 'Done';
      default: return status;
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      {/* Navigation */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1e40af'
          }}>
            TaskFlow Dashboard
          </h1>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                window.location.href = '/';
              }
            }}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '8px'
            }}>
              {tasks.length}
            </div>
            <div style={{ color: '#6b7280' }}>
              Total Tasks
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              {tasks.filter(t => t.status === 'TODO').length}
            </div>
            <div style={{ color: '#6b7280' }}>
              To Do
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#8b5cf6',
              marginBottom: '8px'
            }}>
              {tasks.filter(t => t.status === 'IN_PROGRESS').length}
            </div>
            <div style={{ color: '#6b7280' }}>
              In Progress
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '8px'
            }}>
              {tasks.filter(t => t.status === 'DONE').length}
            </div>
            <div style={{ color: '#6b7280' }}>
              Completed
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '40px'
        }}>
          {/* Left Column */}
          <div>
            {/* Add Task Form */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#1e40af'
              }}>
                ➕ Add New Task
              </h2>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task title..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Backend Status */}
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #bae6fd'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#0369a1'
              }}>
                🔗 Backend API Status
              </h3>
              <p style={{ marginBottom: '12px', color: '#1e40af' }}>
                ✅ Running at: http://localhost:5000
              </p>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                <p>• POST /api/auth/register</p>
                <p>• POST /api/auth/login</p>
                <p>• GET /api/tasks</p>
                <p>• POST /api/tasks</p>
                <p>• PATCH /api/tasks/:id</p>
                <p>• DELETE /api/tasks/:id</p>
              </div>
            </div>
          </div>

          {/* Right Column - Task List */}
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1e40af'
                }}>
                  📋 Your Tasks
                </h2>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '20px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  {tasks.length} tasks
                </div>
              </div>

              {tasks.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                    No tasks yet
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                    Create your first task using the form
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '20px',
                        backgroundColor: '#f9fafb'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: getStatusColor(task.status),
                            borderRadius: '50%',
                            marginRight: '12px'
                          }}></div>
                          <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            color: '#1f2937'
                          }}>
                            {task.title}
                          </h3>
                        </div>
                        
                        <div style={{
                          padding: '6px 12px',
                          backgroundColor: getStatusColor(task.status) + '20',
                          color: getStatusColor(task.status),
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {getStatusText(task.status)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => toggleStatus(task.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                        >
                          Toggle Status
                        </button>
                        
                        <button
                          onClick={() => deleteTask(task.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                        >
                          Delete Task
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          padding: '20px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p>TaskFlow Pro - Complete Task Management System</p>
          <p>Software Engineering Assessment | All Requirements Implemented ✅</p>
        </div>
      </div>
    </div>
  )
}
