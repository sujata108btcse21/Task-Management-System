'use client';

import { useState, useEffect } from 'react';
import { getAllTasks, addTask, updateTask, deleteTask, type Task } from '../../lib/tasks';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    department: 'Management',
    task: '',
    priority: 'P1',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    dueDate: '',
  });

  useEffect(() => {
    setTasks(getAllTasks());
  }, []);

  const departments = [
    'Management', 'Sales', 'Operations', 'Marketing',
    'Human Resources', 'Finance', 'Customer Service'
  ];

  const priorities = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];

  const filteredTasks = tasks.filter(task =>
    task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTask = () => {
    if (newTask.task.trim()) {
      if (editingIndex !== null) {
        updateTask(editingIndex, {
          ...newTask,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null
        });
      } else {
        addTask({
          ...newTask,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null
        });
      }

      setTasks(getAllTasks());

      setNewTask({
        department: 'Management',
        task: '',
        priority: 'P1',
        status: 'pending',
        dueDate: ''
      });
      setShowAddTask(false);
      setEditingIndex(null);
    }
  };

  const handleEditTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setNewTask({
        department: task.department,
        task: task.task,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
      });
      setEditingIndex(task.id);
      setShowAddTask(true);
    }
  };

  const handleDeleteTask = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      setTasks(getAllTasks());
    }
  };

  const toggleTaskStatus = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const updatedTask = {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed' as 'pending' | 'completed'
      };
      updateTask(id, updatedTask);
      setTasks(getAllTasks());
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      'Management': '#3B82F6',
      'Sales': '#10B981',
      'Operations': '#8B5CF6',
      'Marketing': '#F59E0B',
      'Human Resources': '#EF4444',
      'Finance': '#EC4899',
      'Customer Service': '#06B6D4'
    };
    return colors[department] || '#6B7280';
  };

  const getPriorityColor = (priority: string) => {
    const num = parseInt(priority.split(' ')[0]);
    if (num <= 2) return '#10B981';
    if (num <= 4) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
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
            All Tasks
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280'
          }}>
            Manage your tasks efficiently
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 16px 10px 40px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                width: '250px',
                backgroundColor: 'white'
              }}
            />
            <svg
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9CA3AF'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <button
            onClick={() => setShowAddTask(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3B82F6',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M20 12H4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Total Tasks</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{tasks.length}</p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#3B82F610',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Completed</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#10B98110',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>In Progress</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#F59E0B10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L14 14M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Pending</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#EF444410',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 120px',
          padding: '16px 20px',
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Department
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Task
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Priority
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Actions
          </div>
        </div>

        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 120px',
              padding: '16px 20px',
              borderBottom: index !== filteredTasks.length - 1 ? '1px solid #E5E7EB' : 'none',
              alignItems: 'center',
              backgroundColor: task.status === 'completed' ? '#F9FAFB' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getDepartmentColor(task.department)
              }}></div>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827'
              }}>
                {task.department}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button
                onClick={() => toggleTaskStatus(task.id)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: task.status === 'completed' ? 'none' : '2px solid #D1D5DB',
                  backgroundColor: task.status === 'completed' ? '#10B981' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {task.status === 'completed' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span style={{
                fontSize: '14px',
                color: task.status === 'completed' ? '#9CA3AF' : '#374151',
                textDecoration: task.status === 'completed' ? 'line-through' : 'none'
              }}>
                {task.task}
              </span>
            </div>

            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: getPriorityColor(task.priority),
              textAlign: 'start'
            }}>
              {task.priority}
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => handleEditTask(task.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3B82F6',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#EF4444',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <p>No tasks found matching your search</p>
          </div>
        )}
      </div>

      {showAddTask && (
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
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
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
                {editingIndex !== null ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setEditingIndex(null);
                  setNewTask({
                    department: 'Management',
                    task: '',
                    priority: 'P1',
                    status: 'pending',
                    dueDate: ''
                  });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Department
                </label>
                <select
                  value={newTask.department}
                  onChange={(e) => setNewTask({ ...newTask, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Task Description
                </label>
                <textarea
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  placeholder="Enter task description..."
                  rows={3}
                  style={{
                    width: '96%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as 'pending' | 'in-progress' | 'completed' })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={handleAddTask}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#3B82F6',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {editingIndex !== null ? 'Update Task' : 'Add Task'}
              </button>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setEditingIndex(null);
                  setNewTask({
                    department: 'Management',
                    task: '',
                    priority: 'P1',
                    status: 'pending',
                    dueDate: ''
                  });
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}