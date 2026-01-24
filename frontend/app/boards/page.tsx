'use client';

import { useState, useEffect } from 'react';
import { getAllTasks, type Task } from '../../lib/tasks';
import './styles.css';

export default function BoardsPage() {
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getAllTasks());
  }, []);

  const boards = [
    {
      id: 1,
      title: 'Management Board',
      categories: ['Management'],
      color: '#3B82F6',
      description: 'All management related tasks'
    },
    {
      id: 2,
      title: 'Sales Board',
      categories: ['Sales'],
      color: '#10B981',
      description: 'Sales team tasks and targets'
    },
    {
      id: 3,
      title: 'Operations Board',
      categories: ['Operations'],
      color: '#8B5CF6',
      description: 'Operations and logistics tasks'
    },
    {
      id: 4,
      title: 'Marketing Board',
      categories: ['Marketing'],
      color: '#F59E0B',
      description: 'Marketing campaigns and strategies'
    },
    {
      id: 5,
      title: 'HR Board',
      categories: ['Human Resources'],
      color: '#EF4444',
      description: 'Human resources and recruitment'
    },
    {
      id: 6,
      title: 'Finance Board',
      categories: ['Finance'],
      color: '#06B6D4',
      description: 'Financial planning and analysis'
    },
    {
      id: 7,
      title: 'Customer Service Board',
      categories: ['Customer Service'],
      color: '#EC4899',
      description: 'Customer support and service'
    },
  ];

  const boardsWithTasks = boards.map(board => {
    const boardTasks = tasks.filter(task => 
      board.categories.some(category => 
        task.department.toLowerCase().includes(category.toLowerCase())
      )
    );
    
    return {
      ...board,
      tasks: boardTasks,
      totalTasks: boardTasks.length,
      completedTasks: boardTasks.filter(t => t.status === 'completed').length,
      pendingTasks: boardTasks.filter(t => t.status === 'pending').length,
      inProgressTasks: boardTasks.filter(t => t.status === 'in-progress').length,
    };
  });

  const handleBoardClick = (boardId: number) => {
    setSelectedBoard(boardId);
  };

  const filteredBoards = boardsWithTasks.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getPriorityColor = (priority: string) => {
    const num = parseInt(priority.split(' ')[0]);
    if (num <= 2) return '#10B981';
    if (num <= 4) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="boards-container">
      <div className="boards-header">
        <div>
          <h1 className="boards-title">
            Boards
          </h1>
          <p className="boards-subtitle">
            {tasks.length} tasks across {boardsWithTasks.length} boards
          </p>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="boards-grid">
        {filteredBoards.map((board) => (
          <div 
            key={board.id} 
            className="board-card"
            onClick={() => handleBoardClick(board.id)}
          >
            <div 
              className="board-color-dot"
              style={{ backgroundColor: board.color }}
            ></div>

            <h3 className="board-title">
              {board.title}
            </h3>

            <div className="categories-container">
              {board.categories.map((category, index) => (
                <span key={index} className="category-tag">
                  {category}
                </span>
              ))}
            </div>

            <div className="stats-container">
              <div className="stat-item">
                <p className="stat-number">{board.totalTasks}</p>
                <p className="stat-label">Total Tasks</p>
              </div>
              <div className="stat-item">
                <p className="stat-number completed">{board.completedTasks}</p>
                <p className="stat-label">Done</p>
              </div>
              <div className="stat-item">
                <p className="stat-number in-progress">{board.inProgressTasks}</p>
                <p className="stat-label">In Progress</p>
              </div>
            </div>

            <div className="recent-tasks-section">
              <p className="recent-tasks-title">
                Recent Tasks
              </p>
              <div className="tasks-list">
                {board.tasks.slice(0, 3).map((task, index) => (
                  <div key={task.id} className="task-item">
                    <div 
                      className="task-status-dot"
                      style={{ 
                        backgroundColor: task.status === 'completed' ? '#10B981' : 
                                        task.status === 'in-progress' ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                    <span className="task-name">
                      {task.task}
                    </span>
                    <span 
                      className="task-priority"
                      style={{
                        backgroundColor: getPriorityColor(task.priority) + '20',
                        color: getPriorityColor(task.priority)
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
                {board.tasks.length === 0 && (
                  <p className="no-tasks-message">
                    No tasks yet
                  </p>
                )}
                {board.tasks.length > 3 && (
                  <p className="more-tasks-message">
                    +{board.tasks.length - 3} more tasks
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBoard !== null && (
        <div 
          className="modal-overlay"
          onClick={() => setSelectedBoard(null)}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const board = boardsWithTasks.find(b => b.id === selectedBoard);
              if (!board) return null;
              
              return (
                <>
                  <button
                    onClick={() => setSelectedBoard(null)}
                    className="modal-close-button"
                  >
                    ×
                  </button>

                  <h2 className="modal-title">
                    {board.title}
                  </h2>
                  
                  <p className="modal-description">
                    {board.description}
                  </p>
                  
                  <div className="modal-categories">
                    {board.categories.map((category, index) => (
                      <span key={index} className="modal-category-tag">
                        {category}
                      </span>
                    ))}
                  </div>

                  <div className="modal-stats-grid">
                    <div className="modal-stat-item">
                      <p className="modal-stat-number">{board.totalTasks}</p>
                      <p className="modal-stat-label">Total Tasks</p>
                    </div>
                    <div className="modal-stat-item">
                      <p className="modal-stat-number completed">{board.completedTasks}</p>
                      <p className="modal-stat-label">Completed</p>
                    </div>
                    <div className="modal-stat-item">
                      <p className="modal-stat-number in-progress">{board.inProgressTasks}</p>
                      <p className="modal-stat-label">In Progress</p>
                    </div>
                    <div className="modal-stat-item">
                      <p className="modal-stat-number pending">{board.pendingTasks}</p>
                      <p className="modal-stat-label">Pending</p>
                    </div>
                  </div>

                  <h3 className="all-tasks-title">
                    All Tasks ({board.tasks.length})
                  </h3>

                  <div className="modal-tasks-container">
                    {board.tasks.length === 0 ? (
                      <div className="no-tasks-modal">
                        No tasks in this board. Add tasks from the Tasks page!
                      </div>
                    ) : (
                      <div className="modal-tasks-list">
                        {board.tasks.map((task) => (
                          <div key={task.id} className="modal-task-item">
                            <div className="modal-task-content">
                              <p 
                                className="modal-task-name"
                                style={{ 
                                  textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                                }}
                              >
                                {task.task}
                              </p>
                              <div className="modal-task-meta">
                                <span className="modal-task-department">
                                  {task.department}
                                </span>
                                <span 
                                  className="modal-task-status"
                                  style={{ 
                                    color: task.status === 'completed' ? '#10B981' : 
                                           task.status === 'in-progress' ? '#F59E0B' : '#EF4444'
                                  }}
                                >
                                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <span 
                              className="modal-task-priority"
                              style={{ color: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {filteredBoards.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            📋
          </div>
          <h3 className="empty-state-title">
            No boards found
          </h3>
          <p className="empty-state-description">
            Try adjusting your search or add some tasks to see them appear here.
          </p>
        </div>
      )}
    </div>
  );
}
