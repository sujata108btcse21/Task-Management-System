'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getAllTasks,
  updateTask,
  getTasksCreatedToday,
  getTasksCreatedThisWeek,
  addActivity,
  getRecentActivities,
  type Task
} from '../../lib/tasks';
import {
  getAllMeetings,
  getUpcomingMeetings,
  formatMeetingTime,
  formatMeetingDate,
  type Meeting
} from '../../lib/meetings';

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAllMeetings, setShowAllMeetings] = useState(false);

  useEffect(() => {
    const loadedTasks = getAllTasks();
    setTasks(loadedTasks);

    const loadedMeetings = getAllMeetings();
    setMeetings(loadedMeetings);

    const recentActivities = getRecentActivities(4);
    setActivities(recentActivities);
  }, []);

  const [user, setUser] = useState({
    name: 'Jacob Doe',
    email: 'jacob.doe@example.com',
    initials: 'JM',
    role: 'Admin'
  });

  const getFilteredTasks = () => {
    if (showAllTasks) {
      switch (selectedFilter) {
        case 'Today':
          return getTasksCreatedToday();
        case 'This Week':
          return getTasksCreatedThisWeek();
        default:
          return tasks;
      }
    }

    switch (selectedFilter) {
      case 'Today':
        const todayTasks = getTasksCreatedToday();
        return todayTasks.slice(0, 4);
      case 'This Week':
        const weekTasks = getTasksCreatedThisWeek();
        return weekTasks.slice(0, 4);
      case 'Calendar':
        const upcomingTasks = tasks.filter(task =>
          task.dueDate && task.dueDate >= new Date()
        ).slice(0, 4);
        return upcomingTasks.length > 0 ? upcomingTasks : tasks.slice(0, 4);
      default:
        return tasks.slice(0, 4);
    }
  };

  const getStats = (meetingsData: Meeting[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingMeetings = getUpcomingMeetings(7);
    const todayMeetings = meetingsData.filter(m => {
      const meetingDate = new Date(m.date);
      return meetingDate.toDateString() === today.toDateString();
    });

    switch (selectedFilter) {
      case 'Today': {
        const todayTasks = getTasksCreatedToday();
        const completedToday = todayTasks.filter(t => t.status === 'completed').length;
        const inProgressToday = todayTasks.filter(t => t.status === 'in-progress').length;

        return [
          { title: 'Tasks Today', value: todayTasks.length.toString(), change: '+5%', color: '#3B82F6' },
          { title: 'Meetings Today', value: todayMeetings.length.toString(), change: '+3%', color: '#8B5CF6' },
          { title: 'Completed', value: completedToday.toString(), change: '+2%', color: '#10B981' },
          { title: 'In Progress', value: inProgressToday.toString(), change: '-1%', color: '#F59E0B' },
        ];
      }

      case 'This Week': {
        const weekTasks = getTasksCreatedThisWeek();
        const completedWeek = weekTasks.filter(t => t.status === 'completed').length;
        const inProgressWeek = weekTasks.filter(t => t.status === 'in-progress').length;

        const weekMeetings = meetingsData.filter(m => {
          const meetingDate = new Date(m.date);
          const startOfWeek = new Date();
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 7);
          return meetingDate >= startOfWeek && meetingDate <= endOfWeek;
        });

        return [
          { title: 'Tasks This Week', value: weekTasks.length.toString(), change: '+15%', color: '#3B82F6' },
          { title: 'Meetings This Week', value: weekMeetings.length.toString(), change: '+10%', color: '#8B5CF6' },
          { title: 'Completed', value: completedWeek.toString(), change: '+10%', color: '#10B981' },
          { title: 'In Progress', value: inProgressWeek.toString(), change: '-2%', color: '#F59E0B' },
        ];
      }

      case 'Calendar': {
        const upcomingTasks = tasks.filter(task =>
          task.dueDate && task.dueDate >= new Date()
        );

        return [
          { title: 'Upcoming Meetings', value: upcomingMeetings.length.toString(), change: '+8%', color: '#8B5CF6' },
          { title: 'Upcoming Tasks', value: upcomingTasks.length.toString(), change: '+3%', color: '#3B82F6' },
          { title: 'Client Meetings', value: upcomingMeetings.filter(m => m.type === 'Client Meeting').length.toString(), change: '+5%', color: '#10B981' },
          { title: 'Team Meetings', value: upcomingMeetings.filter(m => ['Scrum', 'Planning', 'Retrospective', 'Team Meeting'].includes(m.type)).length.toString(), change: '-1%', color: '#F59E0B' },
        ];
      }

      default: {
        const allTasks = tasks;
        const completedAll = allTasks.filter(t => t.status === 'completed').length;
        const inProgressAll = allTasks.filter(t => t.status === 'in-progress').length;
        const pendingAll = allTasks.filter(t => t.status === 'pending').length;

        return [
          { title: 'Total Tasks', value: allTasks.length.toString(), change: '+12%', color: '#3B82F6' },
          { title: 'Completed', value: completedAll.toString(), change: '+8%', color: '#10B981' },
          { title: 'In Progress', value: inProgressAll.toString(), change: '-3%', color: '#F59E0B' },
          { title: 'Pending', value: pendingAll.toString(), change: '-2%', color: '#f50b0b' }
        ];
      }
    }
  };


  const getFilteredActivities = () => {
    switch (selectedFilter) {
      case 'Today':
        return activities.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          const today = new Date();
          return activityDate.toDateString() === today.toDateString();
        }).slice(0, 3);
      case 'This Week':
        return activities.slice(0, 3);
      case 'Calendar':
        return [
          { user: 'Calendar System', action: 'scheduled', task: 'Team Standup', time: 'Recurring', timestamp: new Date() },
          { user: 'Calendar System', action: 'reminder', task: 'Client Review', time: 'Tomorrow', timestamp: new Date() },
          { user: 'System', action: 'auto-generated', task: 'Monthly Report Due', time: 'Next Week', timestamp: new Date() },
        ];
      default:
        return activities.slice(0, 4);
    }
  };

  const getPriorityText = (priority: string) => {
    const num = parseInt(priority.split(' ')[0]);
    if (num <= 2) return 'High';
    if (num <= 4) return 'Medium';
    return 'Low';
  };

  const getDueDate = (task: Task) => {
    if (!task.dueDate) return 'No due date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
    return dueDate.toLocaleDateString();
  };

  const getProgress = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return 100;
      case 'in-progress':
        const created = new Date(task.createdAt).getTime();
        const now = new Date().getTime();
        const diff = now - created;
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        return Math.min(95, Math.max(5, Math.floor((diff / oneWeek) * 100)));
      case 'pending':
        return task.id % 30;
      default:
        return 0;
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      const taskToUpdate = {
        ...editingTask,
        createdAt: editingTask.createdAt || new Date(),
        dueDate: editingTask.dueDate || null
      };

      updateTask(editingTask.id, taskToUpdate);

      addActivity({
        user: user.name,
        action: 'updated',
        task: editingTask.task,
        taskId: editingTask.id
      });

      setTasks(getAllTasks());
      setActivities(getRecentActivities(4));
      setShowEditModal(false);
      setEditingTask(null);
    }
  };

  const handleCompleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const updatedTask = {
        ...task,
        status: newStatus as 'pending' | 'completed'
      };

      updateTask(taskId, updatedTask);

      addActivity({
        user: user.name,
        action: newStatus === 'completed' ? 'completed' : 'reopened',
        task: task.task,
        taskId: task.id
      });

      setTasks(getAllTasks());
      setActivities(getRecentActivities(4));
    }
  };

  const stats = getStats(meetings);
  const filteredTasks = getFilteredTasks();
  const recentActivities = getFilteredActivities();
  const [currentDate, setCurrentDate] = useState(new Date());

  const CalendarView = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
      setMeetings(getAllMeetings());
    }, []);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthTasks = tasks.filter(task =>
      task.dueDate &&
      task.dueDate.getMonth() === currentDate.getMonth() &&
      task.dueDate.getFullYear() === currentDate.getFullYear()
    );

    const monthMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate.getMonth() === currentDate.getMonth() &&
        meetingDate.getFullYear() === currentDate.getFullYear();
    });

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = monthTasks.filter(task =>
        task.dueDate &&
        task.dueDate.getDate() === day
      );

      const dayMeetings = monthMeetings.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        return meetingDate.getDate() === day;
      });

      const scheduledMeetings = dayMeetings.filter(m => m.status === 'scheduled');
      const completedMeetings = dayMeetings.filter(m => m.status === 'completed');
      const cancelledMeetings = dayMeetings.filter(m => m.status === 'cancelled');

      const dayDeadlines = dayTasks.filter(task =>
        task.priority.includes('1') || task.priority.includes('2')
      );

      days.push(
        <div
          key={day}
          className="calendar-day"
          style={{
            padding: '8px',
            border: '1px solid #E5E7EB',
            minHeight: '120px',
            position: 'relative',
            backgroundColor: day === new Date().getDate() ? '#F0F9FF' : 'white',
            cursor: 'pointer'
          }}
          onClick={() => {
            console.log(`Clicked on day ${day}`, {
              meetings: dayMeetings,
              tasks: dayTasks
            });
          }}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '4px',
            color: day === new Date().getDate() ? '#3B82F6' : '#111827'
          }}>
            {day}
          </div>

          {scheduledMeetings.length > 0 && (
            <div style={{
              fontSize: '9px',
              padding: '1px 4px',
              backgroundColor: '#3B82F6',
              color: 'white',
              borderRadius: '3px',
              marginBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span>📅</span>
              <span>{scheduledMeetings.length} meeting{scheduledMeetings.length > 1 ? 's' : ''}</span>
            </div>
          )}

          {completedMeetings.length > 0 && (
            <div style={{
              fontSize: '9px',
              padding: '1px 4px',
              backgroundColor: '#10B981',
              color: 'white',
              borderRadius: '3px',
              marginBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span>✓</span>
              <span>{completedMeetings.length} completed</span>
            </div>
          )}

          {cancelledMeetings.length > 0 && (
            <div style={{
              fontSize: '9px',
              padding: '1px 4px',
              backgroundColor: '#EF4444',
              color: 'white',
              borderRadius: '3px',
              marginBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span>✗</span>
              <span>{cancelledMeetings.length} cancelled</span>
            </div>
          )}

          {dayDeadlines.length > 0 && (
            <div style={{
              fontSize: '9px',
              padding: '1px 4px',
              backgroundColor: '#F59E0B',
              color: 'white',
              borderRadius: '3px',
              marginBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span>⏰</span>
              <span>{dayDeadlines.length} deadline{dayDeadlines.length > 1 ? 's' : ''}</span>
            </div>
          )}

          {dayMeetings.slice(0, 1).map(meeting => (
            <div
              key={meeting.id}
              style={{
                fontSize: '10px',
                padding: '2px 4px',
                backgroundColor:
                  meeting.status === 'scheduled' ? '#3B82F6' :
                    meeting.status === 'completed' ? '#10B981' : '#EF4444',
                color: 'white',
                borderRadius: '4px',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                borderLeft: `3px solid ${meeting.type === 'Client Meeting' ? '#8B5CF6' :
                  meeting.type === 'Planning' ? '#EC4899' :
                    meeting.type === 'Demo' ? '#10B981' :
                      meeting.type === 'Scrum' ? '#3B82F6' : '#F59E0B'
                  }`
              }}
              title={`${meeting.title}\nTime: ${formatMeetingTime(meeting.startTime)} - ${formatMeetingTime(meeting.endTime)}\nType: ${meeting.type}`}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Meeting: ${meeting.title}\nDate: ${formatMeetingDate(new Date(meeting.date))}\nTime: ${formatMeetingTime(meeting.startTime)} - ${formatMeetingTime(meeting.endTime)}\nStatus: ${meeting.status}`);
              }}
            >
              {meeting.title.substring(0, 12)}...
            </div>
          ))}

          {dayTasks.slice(0, 1).map(task => (
            <div
              key={task.id}
              style={{
                fontSize: '10px',
                padding: '2px 4px',
                backgroundColor:
                  task.status === 'completed' ? '#10B981' :
                    task.priority.includes('1') || task.priority.includes('2') ? '#EF4444' :
                      task.priority.includes('3') || task.priority.includes('4') ? '#F59E0B' :
                        '#6B7280',
                color: 'white',
                borderRadius: '4px',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
              title={`${task.task} (${getPriorityText(task.priority)} Priority)`}
              onClick={(e) => {
                e.stopPropagation();
                handleEditTask(task);
              }}
            >
              {task.task.substring(0, 12)}...
            </div>
          ))}

          {(dayMeetings.length > 1 || dayTasks.length > 1) && (
            <div style={{
              fontSize: '8px',
              color: '#6B7280',
              textAlign: 'center',
              cursor: 'pointer',
              marginTop: '2px'
            }} title={`Click to see all items`}>
              +{dayMeetings.length + dayTasks.length - 2} more
            </div>
          )}
        </div>
      );
    }

    const upcomingEvents = tasks
      .filter(task => task.dueDate && task.dueDate >= new Date())
      .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))
      .slice(0, showAllTasks ? 20 : 6);

    const upcomingMeetings = getUpcomingMeetings(30);

    const meetingsToShow = showAllMeetings ? upcomingMeetings : upcomingMeetings.slice(0, 8);

    const clientMeetings = meetingsToShow.filter(m => m.type === 'Client Meeting');
    const teamMeetings = meetingsToShow.filter(m =>
      ['Scrum', 'Planning', 'Retrospective', 'Team Meeting'].includes(m.type)
    );
    const otherMeetings = meetingsToShow.filter(m =>
      !['Client Meeting', 'Scrum', 'Planning', 'Retrospective', 'Team Meeting'].includes(m.type)
    );

    return (
      <div style={{ marginTop: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              style={{
                padding: '6px 12px',
                backgroundColor: '#F3F4F6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              style={{
                padding: '6px 12px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              style={{
                padding: '6px 12px',
                backgroundColor: '#F3F4F6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '20px'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{
              padding: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#6B7280',
              backgroundColor: '#F9FAFB'
            }}>
              {day}
            </div>
          ))}
          {days}
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📅</span>
                  Upcoming Meetings ({upcomingMeetings.length})
                </h4>
                <button
                  onClick={() => setShowAllMeetings(!showAllMeetings)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: showAllMeetings ? '#8B5CF6' : 'transparent',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: showAllMeetings ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {showAllMeetings ? 'Show Less' : 'View All'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {showAllMeetings ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {meetingsToShow.map(meeting => (
                      <div
                        key={meeting.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: '#F9FAFB',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F3F4F6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor:
                            meeting.type === 'Client Meeting' ? '#8B5CF6' :
                              meeting.type === 'Planning' ? '#EC4899' :
                                meeting.type === 'Demo' ? '#10B981' :
                                  meeting.type === 'Scrum' ? '#3B82F6' :
                                    meeting.type === 'Team Meeting' ? '#3B82F6' :
                                      '#F59E0B',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '14px'
                        }}>
                          {meeting.type === 'Client Meeting' ? '🤝' :
                            meeting.type === 'Planning' ? '📅' :
                              meeting.type === 'Demo' ? '🎬' :
                                meeting.type === 'Scrum' ? '👨‍💼' :
                                  meeting.type === 'Team Meeting' ? '👥' :
                                    '📅'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '4px',
                            color: '#111827'
                          }}>
                            {meeting.title}
                          </p>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            color: '#6B7280',
                            marginBottom: '4px'
                          }}>
                            <span>{formatMeetingDate(new Date(meeting.date))}</span>
                            <span>•</span>
                            <span>{formatMeetingTime(meeting.startTime)} - {formatMeetingTime(meeting.endTime)}</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              backgroundColor: meeting.status === 'scheduled' ? '#DBEAFE' :
                                meeting.status === 'completed' ? '#D1FAE5' : '#FEE2E2',
                              color: meeting.status === 'scheduled' ? '#1D4ED8' :
                                meeting.status === 'completed' ? '#059669' : '#DC2626',
                              borderRadius: '12px',
                              fontWeight: '500'
                            }}>
                              {meeting.status}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              backgroundColor: '#F3F4F6',
                              color: '#6B7280',
                              borderRadius: '12px',
                              fontWeight: '500'
                            }}>
                              {meeting.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {clientMeetings.length > 0 && (
                      <div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6B7280',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Client Meetings ({clientMeetings.length})
                        </div>
                        {clientMeetings.slice(0, 3).map(meeting => (
                          <div
                            key={meeting.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              padding: '12px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              cursor: 'pointer',
                              backgroundColor: '#F9FAFB',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#F3F4F6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#F9FAFB';
                            }}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: '#8B5CF6',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '14px'
                            }}>
                              🤝
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '4px',
                                color: '#111827'
                              }}>
                                {meeting.title}
                              </p>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '12px',
                                color: '#6B7280'
                              }}>
                                <span>{formatMeetingDate(new Date(meeting.date))}</span>
                                <span>•</span>
                                <span>{formatMeetingTime(meeting.startTime)} - {formatMeetingTime(meeting.endTime)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {teamMeetings.length > 0 && (
                      <div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6B7280',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Team Meetings ({teamMeetings.length})
                        </div>
                        {teamMeetings.slice(0, 2).map(meeting => (
                          <div
                            key={meeting.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              padding: '12px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              cursor: 'pointer',
                              backgroundColor: '#F0F9FF',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: '#3B82F6',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '14px'
                            }}>
                              👥
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '4px',
                                color: '#111827'
                              }}>
                                {meeting.title}
                              </p>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '12px',
                                color: '#6B7280'
                              }}>
                                <span>{formatMeetingDate(new Date(meeting.date))}</span>
                                <span>•</span>
                                <span>{formatMeetingTime(meeting.startTime)} - {formatMeetingTime(meeting.endTime)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {otherMeetings.length > 0 && (
                      <div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6B7280',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Other Meetings ({otherMeetings.length})
                        </div>
                        {otherMeetings.slice(0, 2).map(meeting => (
                          <div
                            key={meeting.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              padding: '12px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              cursor: 'pointer',
                              backgroundColor: '#FEF3C7',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: '#F59E0B',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '14px'
                            }}>
                              📅
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '4px',
                                color: '#111827'
                              }}>
                                {meeting.title}
                              </p>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '12px',
                                color: '#6B7280'
                              }}>
                                <span>{formatMeetingDate(new Date(meeting.date))}</span>
                                <span>•</span>
                                <span>{formatMeetingTime(meeting.startTime)} - {formatMeetingTime(meeting.endTime)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📝</span>
                  Upcoming Tasks ({upcomingEvents.length})
                </h4>
                <button
                  onClick={() => setShowAllTasks(!showAllTasks)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: showAllTasks ? '#3B82F6' : 'transparent',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: showAllTasks ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {showAllTasks ? 'Show Less' : 'View All'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleEditTask(event)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor:
                        getPriorityText(event.priority) === 'High' ? '#EF4444' :
                          getPriorityText(event.priority) === 'Medium' ? '#F59E0B' : '#10B981'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '2px',
                        color: '#111827'
                      }}>
                        {event.task}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#6B7280'
                      }}>
                        <span>{event.dueDate?.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{event.department}</span>
                        <span>•</span>
                        <span style={{
                          padding: '2px 6px',
                          backgroundColor:
                            getPriorityText(event.priority) === 'High' ? '#FEE2E2' :
                              getPriorityText(event.priority) === 'Medium' ? '#FEF3C7' : '#D1FAE5',
                          color:
                            getPriorityText(event.priority) === 'High' ? '#DC2626' :
                              getPriorityText(event.priority) === 'Medium' ? '#D97706' : '#059669',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          {getPriorityText(event.priority)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        position: 'relative'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6B7280'
          }}>
            {selectedFilter === 'All' ? 'Welcome! Here\'s what\'s happening.' :
              selectedFilter === 'Today' ? 'Today\'s overview' :
                selectedFilter === 'This Week' ? 'This week\'s activities' :
                  'Calendar view'}
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: '#F3F4F6',
            padding: '4px',
            borderRadius: '8px'
          }}>
            {['All', 'Today', 'This Week', 'Calendar'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  setShowAllTasks(false);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedFilter === filter ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: selectedFilter === filter ? '#111827' : '#6B7280',
                  cursor: 'pointer',
                  boxShadow: selectedFilter === filter ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  outline: 'none'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {user.initials}
            </button>

            {showUserDropdown && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                border: '1px solid #E5E7EB',
                minWidth: '280px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #F3F4F6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '18px'
                    }}>
                      {user.initials}
                    </div>
                    <div>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {user.name}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '8px'
                      }}>
                        {user.email}
                      </p>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        backgroundColor: '#F3F4F6',
                        color: '#6B7280',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  marginBottom: '8px'
                }}>
                  {stat.title}
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {stat.value}
                </p>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M18 12L12 18L6 12"
                    stroke={stat.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p style={{
              fontSize: '14px',
              color: stat.change.includes('+') ? '#10B981' : stat.change.includes('-') ? '#EF4444' : '#6B7280',
              marginTop: '12px'
            }}>
              {stat.change} from last period
            </p>
          </div>
        ))}
      </div>

      {selectedFilter === 'Calendar' ? (
        <CalendarView />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px'
        }}>
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB'
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
                  {selectedFilter === 'All' ? 'Recent Tasks' :
                    selectedFilter === 'Today' ? 'Today\'s Tasks' :
                      'This Week\'s Tasks'}
                </h2>
                <button
                  onClick={() => setShowAllTasks(!showAllTasks)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: showAllTasks ? '#3B82F6' : 'transparent',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: showAllTasks ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {showAllTasks ? 'Show Less' : 'View All'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredTasks.map((task, index) => (
                  <div key={task.id} style={{
                    padding: '20px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: index === 0 && !showAllTasks ? '#F0F9FF' : 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <p style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          {task.task}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor:
                                getPriorityText(task.priority) === 'High' ? '#EF4444' :
                                  getPriorityText(task.priority) === 'Medium' ? '#F59E0B' : '#10B981'
                            }}></div>
                            {getPriorityText(task.priority)} Priority
                          </span>
                          <span style={{ fontSize: '14px', color: '#6B7280' }}>
                            Due: {getDueDate(task)}
                          </span>
                          <span style={{
                            fontSize: '14px',
                            padding: '2px 8px',
                            backgroundColor:
                              task.status === 'completed' ? '#10B98120' :
                                task.status === 'in-progress' ? '#3B82F620' :
                                  '#F59E0B20',
                            color:
                              task.status === 'completed' ? '#10B981' :
                                task.status === 'in-progress' ? '#3B82F6' :
                                  '#F59E0B',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditTask(task)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#F3F4F6',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#374151',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: task.status === 'completed' ? '#6B7280' : '#10B981',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          {task.status === 'completed' ? 'Completed' : 'Complete'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>Progress</span>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{getProgress(task)}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${getProgress(task)}%`,
                          height: '100%',
                          backgroundColor: getProgress(task) > 70 ? '#10B981' : getProgress(task) > 30 ? '#3B82F6' : '#F59E0B',
                          borderRadius: '3px'
                        }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '24px'
              }}>
                Recent Activity
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {recentActivities.map((activity, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor:
                        activity.action === 'completed' ? '#D1FAE5' :
                          activity.action === 'uploaded' ? '#DBEAFE' :
                            activity.action === 'commented' ? '#FEF3C7' :
                              activity.action === 'assigned' ? '#E0E7FF' :
                                activity.action === 'started' ? '#FCE7F3' :
                                  activity.action === 'scheduled' ? '#FEF3C7' :
                                    activity.action === 'reminder' ? '#FEE2E2' :
                                      activity.action === 'auto-generated' ? '#E5E7EB' : '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {activity.action === 'completed' ? (
                          <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : activity.action === 'uploaded' ? (
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                            stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : activity.action === 'commented' ? (
                          <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11441 17.053 3.99479 18.5291 5.47086C20.0052 6.94694 20.8856 8.91565 21 11V11.5Z"
                            stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : activity.action === 'assigned' ? (
                          <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                            stroke="#8B5CF6" strokeWidth="2" />
                        ) : activity.action === 'started' ? (
                          <path d="M3 12L10.3 19.3L21 8.7" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
                        ) : (
                          <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                            stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        marginBottom: '2px',
                        lineHeight: '1.4'
                      }}>
                        <strong>{activity.user}</strong> {activity.action} {activity.task}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6B7280'
                      }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingTask && (
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
                Edit Task
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
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
                  value={editingTask.department}
                  onChange={(e) => setEditingTask({ ...editingTask, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {['Management', 'Sales', 'Operations', 'Marketing', 'Human Resources', 'Finance', 'Customer Service'].map(dept => (
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
                  value={editingTask.task}
                  onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
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
                  Created Date
                </label>
                <input
                  type="date"
                  value={editingTask.createdAt ? editingTask.createdAt.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    createdAt: e.target.value ? new Date(e.target.value) : new Date()
                  })}
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
                  Due Date
                </label>
                <input
                  type="date"
                  value={editingTask.dueDate ? editingTask.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    dueDate: e.target.value ? new Date(e.target.value) : null
                  })}
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
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'].map(priority => (
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
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as 'pending' | 'in-progress' | 'completed' })}
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
                onClick={handleSaveEdit}
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
                Update Task
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
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