'use client';

import { useState } from 'react';

export default function BoardsPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const boards = [
    {
      id: 1,
      title: 'Content strategy development',
      categories: ['Marketing'],
      totalTasks: 125,
      teamName: 'Explore Team',
      teamMembers: '+8',
      color: '#3B82F6'
    },
    {
      id: 2,
      title: 'Social media strategy development',
      categories: ['Marketing'],
      totalTasks: 68,
      teamName: 'Explore Team',
      teamMembers: '+5',
      color: '#10B981'
    },
    {
      id: 3,
      title: 'Email marketing campaign',
      categories: ['Management', 'Marketing', 'Human Resources'],
      totalTasks: 125,
      teamName: 'Explore Team',
      teamMembers: '+4',
      color: '#8B5CF6'
    },
    {
      id: 4,
      title: 'Old content updates',
      categories: ['Marketing'],
      totalTasks: 20,
      teamName: 'Explore Team',
      teamMembers: '+2',
      color: '#F59E0B'
    },
    {
      id: 5,
      title: 'Conducting customer and market research',
      categories: ['Marketing'],
      totalTasks: 41,
      teamName: 'Explore Team',
      teamMembers: '+2',
      color: '#EF4444'
    },
    {
      id: 6,
      title: 'Overseeing outside vendors and agencies',
      categories: ['Marketing'],
      totalTasks: 28,
      teamName: 'Explore Team',
      teamMembers: '+20',
      color: '#06B6D4'
    },
    {
      id: 7,
      title: 'Exhibitions, seminars and events',
      categories: ['Marketing'],
      totalTasks: 17,
      teamName: 'Explore Team',
      teamMembers: '+9',
      color: '#EC4899'
    },
  ];

  const handleBoardClick = (boardId: number) => {
    setSelectedBoard(boardId);
  };

  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            Boards
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
              placeholder="Search boards..."
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
            padding: '4px',
            marginRight: '12px'
          }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                color: viewMode === 'list' ? '#111827' : '#6B7280',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                color: viewMode === 'grid' ? '#111827' : '#6B7280',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              Grid
            </button>
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
            New Board
          </button>
        </div>
      </div>

      {/* Boards Grid View */}
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
            e.currentTarget.style.borderColor = '#3B82F6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#E5E7EB';
          }}
          >
            {/* Color accent dot */}
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '12px',
              height: '12px',
              backgroundColor: board.color,
              borderRadius: '50%'
            }}></div>

            {/* Board Title */}
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '20px',
              lineHeight: '1.4',
              paddingRight: '30px'
            }}>
              {board.title}
            </h3>

            {/* Categories */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '24px'
            }}>
              {board.categories.map((category, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#6B7280',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{
                    fontSize: '15px',
                    color: '#6B7280'
                  }}>
                    {category}
                  </span>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div style={{
              height: '1px',
              backgroundColor: '#E5E7EB',
              margin: '24px 0'
            }}></div>

            {/* Stats and Team Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  marginBottom: '4px'
                }}>
                  <strong>Total tasks</strong> {board.totalTasks}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#6B7280'
                }}>
                  {board.teamMembers}
                </span>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '20px',
                  fontSize: '14px',
                  color: '#374151',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {board.teamName}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Board Details */}
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
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => setSelectedBoard(null)}
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
            {(() => {
              const board = boards.find(b => b.id === selectedBoard);
              if (!board) return null;
              
              return (
                <>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '24px'
                  }}>
                    {board.title}
                  </h2>
                  
                  <p style={{
                    fontSize: '16px',
                    color: '#6B7280',
                    marginBottom: '24px'
                  }}>
                    Click the button below to explore this board in detail.
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
                  onClick={() => setSelectedBoard(null)}
                  >
                    Open Board Details
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
