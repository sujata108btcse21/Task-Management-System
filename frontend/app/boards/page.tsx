'use client';

import { useState, useEffect } from 'react';
import { getAllTasks, type Task } from '../../lib/tasks';

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
            marginBottom: '8px'
          }}>
            Boards
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>
            {tasks.length} tasks across {boardsWithTasks.length} boards
          </p>
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
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '82%',
                padding: '12px 20px 12px 48px',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: 'white',
                outline: 'none'
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
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '24px'
      }}>
        {filteredBoards.map((board) => (
          <div key={board.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '24px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => handleBoardClick(board.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = board.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#E5E7EB';
          }}
          >
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '12px',
              height: '12px',
              backgroundColor: board.color,
              borderRadius: '50%'
            }}></div>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px',
              lineHeight: '1.4',
              paddingRight: '30px'
            }}>
              {board.title}
            </h3>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {board.categories.map((category, index) => (
                <span key={index} style={{
                  padding: '4px 12px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  {category}
                </span>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                  {board.totalTasks}
                </p>
                <p style={{ fontSize: '12px', color: '#6B7280' }}>Total Tasks</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>
                  {board.completedTasks}
                </p>
                <p style={{ fontSize: '12px', color: '#6B7280' }}>Done</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>
                  {board.inProgressTasks}
                </p>
                <p style={{ fontSize: '12px', color: '#6B7280' }}>In Progress</p>
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #E5E7EB'
            }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', marginBottom: '12px' }}>
                Recent Tasks
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {board.tasks.slice(0, 3).map((task, index) => (
                  <div key={task.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '6px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: task.status === 'completed' ? '#10B981' : 
                                      task.status === 'in-progress' ? '#F59E0B' : '#EF4444'
                    }}></div>
                    <span style={{
                      fontSize: '12px',
                      color: '#374151',
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {task.task}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      backgroundColor: getPriorityColor(task.priority) + '20',
                      color: getPriorityColor(task.priority),
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      {task.priority}
                    </span>
                  </div>
                ))}
                {board.tasks.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center', padding: '8px' }}>
                    No tasks yet
                  </p>
                )}
                {board.tasks.length > 3 && (
                  <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', padding: '8px' }}>
                    +{board.tasks.length - 3} more tasks
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBoard !== null && (
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
        }}
        onClick={() => setSelectedBoard(null)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const board = boardsWithTasks.find(b => b.id === selectedBoard);
              if (!board) return null;
              
              return (
                <>
                  <button
                    onClick={() => setSelectedBoard(null)}
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
                  >
                    ×
                  </button>

                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '8px'
                  }}>
                    {board.title}
                  </h2>
                  
                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
                    {board.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px'
                  }}>
                    {board.categories.map((category, index) => (
                      <span key={index} style={{
                        padding: '4px 12px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        {category}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    marginBottom: '24px',
                    padding: '20px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '12px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                        {board.totalTasks}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>Total Tasks</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '24px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>
                        {board.completedTasks}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>Completed</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>
                        {board.inProgressTasks}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>In Progress</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444', marginBottom: '4px' }}>
                        {board.pendingTasks}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>Pending</p>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px'
                  }}>
                    All Tasks ({board.tasks.length})
                  </h3>

                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {board.tasks.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        No tasks in this board. Add tasks from the Tasks page!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {board.tasks.map((task) => (
                          <div key={task.id} style={{
                            padding: '16px',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ 
                                fontSize: '14px', 
                                color: '#111827',
                                marginBottom: '4px',
                                textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                              }}>
                                {task.task}
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ 
                                  fontSize: '12px', 
                                  color: '#6B7280',
                                  backgroundColor: '#F3F4F6',
                                  padding: '2px 8px',
                                  borderRadius: '12px'
                                }}>
                                  {task.department}
                                </span>
                                <span style={{ 
                                  fontSize: '12px', 
                                  color: task.status === 'completed' ? '#10B981' : 
                                         task.status === 'in-progress' ? '#F59E0B' : '#EF4444',
                                  fontWeight: '500'
                                }}>
                                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: '600',
                              color: getPriorityColor(task.priority)
                            }}>
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
            📋
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px'
          }}>
            No boards found
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            maxWidth: '400px',
            margin: '0 auto 24px'
          }}>
            Try adjusting your search or add some tasks to see them appear here.
          </p>
        </div>
      )}
    </div>
  );
}
