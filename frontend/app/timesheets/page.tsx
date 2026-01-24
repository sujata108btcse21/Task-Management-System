'use client';

import { useState, useEffect } from 'react';
import { 
  getAllMeetings, 
  addMeeting, 
  saveMeetings,
  calculateDuration,
  type Meeting 
} from '../../lib/meetings';

// Remove the TimeSlot interface or define it properly
interface TimeSlot {
  hour: string;
  time: string;
  meridiem: string;
}

export default function TimesheetsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMeeting, setShowAddMeeting] = useState(false);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    participants: '',
    type: 'Standup',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled'
  });

  // Load meetings on component mount
  useEffect(() => {
    const loadedMeetings = getAllMeetings();
    setMeetings(loadedMeetings);
  }, []);

  const timeSlots: TimeSlot[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    const displayHour = hour > 12 ? hour - 12 : hour;
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    const hourStr = hour.toString().padStart(2, '0');

    timeSlots.push({
      hour: `${hourStr}:00`,
      time: `${displayHour}:00`,
      meridiem
    });

    if (hour < 22) {
      timeSlots.push({
        hour: `${hourStr}:30`,
        time: `${displayHour}:30`,
        meridiem
      });
    }
  }

  const meetingTypes = [
    'Standup',
    'Team Meeting',
    'Client Meeting',
    'Review',
    'Planning',
    'Retrospective',
    'Workshop',
    'One-on-One',
    'Board Meeting',
    'All-Hands',
    'Demo',
    'Presentation'
  ];

  const handleAddMeeting = () => {
    if (newMeeting.title.trim() && newMeeting.date) {
      const duration = calculateDuration(newMeeting.startTime, newMeeting.endTime);
      const participantsList = newMeeting.participants
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const meeting: Omit<Meeting, 'id'> = {
        title: newMeeting.title,
        date: new Date(newMeeting.date),
        startTime: newMeeting.startTime,
        endTime: newMeeting.endTime,
        duration: duration,
        participants: participantsList.length > 0 ? participantsList : ['Team'],
        type: newMeeting.type,
        status: newMeeting.status
      };

      // Add meeting to storage and get the created meeting with ID
      const createdMeeting = addMeeting(meeting);
      
      // Update local state
      setMeetings(prev => [...prev, createdMeeting]);

      // Reset form
      setNewMeeting({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        participants: '',
        type: 'Standup',
        status: 'scheduled'
      });

      setShowAddMeeting(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'Standup': return '👨‍💼';
      case 'Team Meeting': return '👥';
      case 'Client Meeting': return '🤝';
      case 'Review': return '📋';
      case 'Planning': return '📅';
      case 'Retrospective': return '🔄';
      case 'Workshop': return '🔧';
      case 'One-on-One': return '👤';
      case 'Board Meeting': return '👔';
      case 'All-Hands': return '👨‍👩‍👧‍👦';
      case 'Demo': return '🎬';
      case 'Presentation': return '📽️';
      default: return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const upcomingMeetings = meetings
    .filter(meeting => {
      const meetingDate = new Date(meeting.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return meetingDate >= today && meetingDate <= nextWeek && meeting.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalMeetingHours = meetings.reduce((total, meeting) => {
    const [hours, minutes] = meeting.duration.split(':').map(Number);
    return total + hours + (minutes / 60);
  }, 0);

  // ... rest of your component remains the same ...

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '8px'
          }}>
            Meeting Schedule
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0
          }}>
            Total: {meetings.length} meetings • {totalMeetingHours.toFixed(1)} hours
          </p>
        </div>

        <button
          onClick={() => setShowAddMeeting(true)}
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
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3B82F6';
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
          Add Meeting
        </button>
      </div>

      <div style={{
        marginBottom: '20px'
      }}>
        <input
          type="text"
          placeholder="Search meetings by title, type, or participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '50%',
            padding: '12px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
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

      {upcomingMeetings.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📅</span>
            Upcoming Meetings ({upcomingMeetings.length})
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {upcomingMeetings.slice(0, 4).map(meeting => (
              <div
                key={meeting.id}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {getMeetingIcon(meeting.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '4px'
                    }}>
                      {meeting.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        backgroundColor: '#DBEAFE',
                        color: '#1D4ED8',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        {meeting.type}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        backgroundColor: getStatusColor(meeting.status) + '20',
                        color: getStatusColor(meeting.status),
                        borderRadius: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📅</span>
                    <span>{formatDate(meeting.date)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⏰</span>
                    <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                  </div>
                </div>

                {meeting.participants.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    <span>👥</span>
                    <span>{meeting.participants.slice(0, 3).join(', ')}</span>
                    {meeting.participants.length > 3 && (
                      <span style={{ color: '#999' }}>
                        +{meeting.participants.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '20px'
        }}>
          All Meetings ({filteredMeetings.length})
        </h2>

        <div style={{
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0'
              }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Meeting
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Date & Time
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Duration
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Type
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Participants
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMeetings.map(meeting => (
                <tr
                  key={meeting.id}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        backgroundColor: '#DBEAFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                        {getMeetingIcon(meeting.type)}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          marginBottom: '2px'
                        }}>
                          {meeting.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#1a1a1a'
                    }}>
                      {formatDate(meeting.date)}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1a1a1a'
                    }}>
                      {meeting.duration}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      backgroundColor: '#DBEAFE',
                      color: '#1D4ED8',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {meeting.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#666',
                      maxWidth: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {meeting.participants.join(', ')}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      backgroundColor: getStatusColor(meeting.status) + '20',
                      color: getStatusColor(meeting.status),
                      borderRadius: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {meeting.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddMeeting && (
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
          onClick={() => setShowAddMeeting(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}
            onClick={(e) => e.stopPropagation()}
          >
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
                Schedule New Meeting
              </h2>
              <button
                onClick={() => setShowAddMeeting(false)}
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

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="Enter meeting title..."
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
                  Meeting Date
                </label>
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
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
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newMeeting.endTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Meeting Type
                </label>
                <select
                  value={newMeeting.type}
                  onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {meetingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
                  Participants (comma separated)
                </label>
                <input
                  type="text"
                  value={newMeeting.participants}
                  onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
                  placeholder="John, Sarah, Mike"
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
                  Status
                </label>
                <select
                  value={newMeeting.status}
                  onChange={(e) => setNewMeeting({
                    ...newMeeting,
                    status: e.target.value as 'scheduled' | 'completed' | 'cancelled'
                  })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={handleAddMeeting}
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
                Schedule Meeting
              </button>
              <button
                onClick={() => setShowAddMeeting(false)}
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