'use client';

import { useState, useEffect } from 'react';
import { 
  getAllMeetings, 
  addMeeting, 
  calculateDuration,
  type Meeting 
} from '../../lib/meetings';
import './styles.css';

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

      const createdMeeting = addMeeting(meeting);
      
      setMeetings(prev => [...prev, createdMeeting]);

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

  return (
    <div className="timesheets-container">
      <div className="timesheets-header">
        <div>
          <h1 className="timesheets-title">
            Meeting Schedule
          </h1>
          <p className="timesheets-subtitle">
            Total: {meetings.length} meetings • {totalMeetingHours.toFixed(1)} hours
          </p>
        </div>

        <button
          onClick={() => setShowAddMeeting(true)}
          className="add-meeting-button"
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

      <div className="search-container">
        <input
          type="text"
          placeholder="Search meetings by title, type, or participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {upcomingMeetings.length > 0 && (
        <div className="upcoming-meetings-section">
          <h2 className="section-title">
            <span>📅</span>
            Upcoming Meetings ({upcomingMeetings.length})
          </h2>

          <div className="upcoming-meetings-grid">
            {upcomingMeetings.slice(0, 4).map(meeting => (
              <div
                key={meeting.id}
                className="meeting-card"
              >
                <div className="meeting-card-header">
                  <div className="meeting-icon-wrapper">
                    {getMeetingIcon(meeting.type)}
                  </div>
                  <div className="meeting-card-details">
                    <h3 className="meeting-title">
                      {meeting.title}
                    </h3>
                    <div className="meeting-tags">
                      <span className="type-tag">
                        {meeting.type}
                      </span>
                      <span 
                        className="status-tag"
                        style={{
                          backgroundColor: getStatusColor(meeting.status) + '20',
                          color: getStatusColor(meeting.status)
                        }}
                      >
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="meeting-time-info">
                  <div className="time-info-item">
                    <span>📅</span>
                    <span>{formatDate(meeting.date)}</span>
                  </div>
                  <div className="time-info-item">
                    <span>⏰</span>
                    <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                  </div>
                </div>

                {meeting.participants.length > 0 && (
                  <div className="participants-info">
                    <span>👥</span>
                    <span>{meeting.participants.slice(0, 3).join(', ')}</span>
                    {meeting.participants.length > 3 && (
                      <span className="more-participants">
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

      <div className="all-meetings-section">
        <h2 className="section-title">
          All Meetings ({filteredMeetings.length})
        </h2>

        <div className="meetings-table-container">
          <table className="meetings-table">
            <thead>
              <tr>
                <th className="table-header">Meeting</th>
                <th className="table-header">Date & Time</th>
                <th className="table-header">Duration</th>
                <th className="table-header">Type</th>
                <th className="table-header">Participants</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeetings.map(meeting => (
                <tr
                  key={meeting.id}
                  className="meeting-row"
                >
                  <td className="meeting-info-cell">
                    <div className="meeting-info">
                      <div className="table-meeting-icon">
                        {getMeetingIcon(meeting.type)}
                      </div>
                      <div className="meeting-details">
                        <div className="table-meeting-title">
                          {meeting.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="date-time-cell">
                    <div className="meeting-date">
                      {formatDate(meeting.date)}
                    </div>
                    <div className="meeting-time-range">
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </div>
                  </td>
                  <td className="duration-cell">
                    <div className="meeting-duration">
                      {meeting.duration}
                    </div>
                  </td>
                  <td className="type-cell">
                    <span className="table-type-tag">
                      {meeting.type}
                    </span>
                  </td>
                  <td className="participants-cell">
                    <div className="table-participants">
                      {meeting.participants.join(', ')}
                    </div>
                  </td>
                  <td className="status-cell">
                    <span 
                      className="table-status-tag"
                      style={{
                        backgroundColor: getStatusColor(meeting.status) + '20',
                        color: getStatusColor(meeting.status)
                      }}
                    >
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
        <div 
          className="modal-overlay"
          onClick={() => setShowAddMeeting(false)}
        >
          <div 
            className="add-meeting-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                Schedule New Meeting
              </h2>
              <button
                onClick={() => setShowAddMeeting(false)}
                className="modal-close-button"
              >
                ×
              </button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="Enter meeting title..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Meeting Date
                </label>
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="time-inputs-grid">
                <div className="form-group">
                  <label className="form-label">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newMeeting.endTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Meeting Type
                </label>
                <select
                  value={newMeeting.type}
                  onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
                  className="form-select"
                >
                  {meetingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Participants (comma separated)
                </label>
                <input
                  type="text"
                  value={newMeeting.participants}
                  onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
                  placeholder="John, Sarah, Mike"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Status
                </label>
                <select
                  value={newMeeting.status}
                  onChange={(e) => setNewMeeting({
                    ...newMeeting,
                    status: e.target.value as 'scheduled' | 'completed' | 'cancelled'
                  })}
                  className="form-select"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={handleAddMeeting}
                className="schedule-button"
              >
                Schedule Meeting
              </button>
              <button
                onClick={() => setShowAddMeeting(false)}
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