'use client';

import { useState, useEffect } from 'react';
import { getAllTasks, addTask, updateTask, deleteTask, type Task } from '../../lib/tasks';
import './styles.css';

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
    <div className="tasks-container">
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">
            All Tasks
          </h1>
          <p className="tasks-subtitle">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <svg
              className="search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <button
            onClick={() => setShowAddTask(true)}
            className="add-task-button"
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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Tasks</p>
              <p className="stat-value">{tasks.length}</p>
            </div>
            <div className="stat-icon total">
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

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Completed</p>
              <p className="stat-value">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="stat-icon completed">
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

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">In Progress</p>
              <p className="stat-value">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div className="stat-icon in-progress">
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

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Pending</p>
              <p className="stat-value">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <div className="stat-icon pending">
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

      <div className="tasks-table-container">
        <div className="table-header">
          <div className="header-cell department">Department</div>
          <div className="header-cell task">Task</div>
          <div className="header-cell priority">Priority</div>
          <div className="header-cell actions">Actions</div>
        </div>

        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            className={`task-row ${task.status === 'completed' ? 'completed' : ''}`}
          >
            <div className="task-cell department-cell">
              <div className="department-info">
                <div 
                  className="department-dot"
                  style={{ backgroundColor: getDepartmentColor(task.department) }}
                ></div>
                <span className="department-name">
                  {task.department}
                </span>
              </div>
            </div>

            <div className="task-cell task-cell-content">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className={`status-toggle ${task.status === 'completed' ? 'checked' : ''}`}
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
              <span className={`task-description ${task.status === 'completed' ? 'completed' : ''}`}>
                {task.task}
              </span>
            </div>

            <div className="task-cell priority-cell">
              <span 
                className="priority-text"
                style={{ color: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
            </div>

            <div className="task-cell actions-cell">
              <div className="action-buttons">
                <button
                  onClick={() => handleEditTask(task.id)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <p>No tasks found matching your search</p>
          </div>
        )}
      </div>

      {showAddTask && (
        <div className="modal-overlay">
          <div className="add-task-modal">
            <div className="modal-header">
              <h2 className="modal-title">
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
                className="modal-close-button"
              >
                ×
              </button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">
                  Department
                </label>
                <select
                  value={newTask.department}
                  onChange={(e) => setNewTask({ ...newTask, department: e.target.value })}
                  className="form-select"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Task Description
                </label>
                <textarea
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  placeholder="Enter task description..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="form-select"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as 'pending' | 'in-progress' | 'completed' })}
                  className="form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={handleAddTask}
                className="save-button"
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
                className="cancel-button"
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