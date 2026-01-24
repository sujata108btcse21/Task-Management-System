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
import { getUserData } from '../../lib/user';
import { useRouter } from 'next/navigation';
import './styles.css';

export default function DashboardPage() {
  const router = useRouter();
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
  const [currentDate, setCurrentDate] = useState(new Date());

  const [user, setUser] = useState(() => getUserData());

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated || isAuthenticated !== 'true') {
      router.push('/');
      return;
    }

    setUser(getUserData());

    const loadedTasks = getAllTasks();
    setTasks(loadedTasks);

    const loadedMeetings = getAllMeetings();
    setMeetings(loadedMeetings);

    const recentActivities = getRecentActivities(4);
    setActivities(recentActivities);
  }, [router]);

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

  const CalendarView = () => {
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
          onClick={() => {
            console.log(`Clicked on day ${day}`, {
              meetings: dayMeetings,
              tasks: dayTasks
            });
          }}
        >
          <div className="calendar-day-number">
            {day}
          </div>

          {scheduledMeetings.length > 0 && (
            <div className="calendar-meeting-indicator scheduled">
              <span>📅</span>
              <span>{scheduledMeetings.length} meeting{scheduledMeetings.length > 1 ? 's' : ''}</span>
            </div>
          )}

          {completedMeetings.length > 0 && (
            <div className="calendar-meeting-indicator completed">
              <span>✓</span>
              <span>{completedMeetings.length} completed</span>
            </div>
          )}

          {cancelledMeetings.length > 0 && (
            <div className="calendar-meeting-indicator cancelled">
              <span>✗</span>
              <span>{cancelledMeetings.length} cancelled</span>
            </div>
          )}

          {dayDeadlines.length > 0 && (
            <div className="calendar-deadline-indicator">
              <span>⏰</span>
              <span>{dayDeadlines.length} deadline{dayDeadlines.length > 1 ? 's' : ''}</span>
            </div>
          )}

          {dayMeetings.slice(0, 1).map(meeting => (
            <div
              key={meeting.id}
              className="calendar-meeting-item"
              style={{
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
              className="calendar-task-item"
              style={{
                backgroundColor:
                  task.status === 'completed' ? '#10B981' :
                    task.priority.includes('1') || task.priority.includes('2') ? '#EF4444' :
                      task.priority.includes('3') || task.priority.includes('4') ? '#F59E0B' :
                        '#6B7280'
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
            <div className="calendar-more-items">
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
      <div className="calendar-view">
        <div className="calendar-header">
          <h3>
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="calendar-navigation">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="calendar-nav-button"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="calendar-today-button"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="calendar-nav-button"
            >
              Next
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          {days}
        </div>

        <div className="calendar-events-section">
          <div className="calendar-events-grid">
            <div>
              <div className="calendar-section-header">
                <h4>
                  <span>📅</span>
                  Upcoming Meetings ({upcomingMeetings.length})
                </h4>
                <button
                  onClick={() => setShowAllMeetings(!showAllMeetings)}
                  className={`view-all-button ${showAllMeetings ? 'active' : ''}`}
                >
                  {showAllMeetings ? 'Show Less' : 'View All'}
                </button>
              </div>

              <div className="meetings-list">
                {showAllMeetings ? (
                  <div className="meetings-grid">
                    {meetingsToShow.map(meeting => (
                      <div
                        key={meeting.id}
                        className="meeting-card full-view"
                      >
                        <div
                          className="meeting-icon"
                          style={{
                            backgroundColor:
                              meeting.type === 'Client Meeting' ? '#8B5CF6' :
                                meeting.type === 'Planning' ? '#EC4899' :
                                  meeting.type === 'Demo' ? '#10B981' :
                                    meeting.type === 'Scrum' ? '#3B82F6' :
                                      meeting.type === 'Team Meeting' ? '#3B82F6' :
                                        '#F59E0B'
                          }}
                        >
                          {meeting.type === 'Client Meeting' ? '🤝' :
                            meeting.type === 'Planning' ? '📅' :
                              meeting.type === 'Demo' ? '🎬' :
                                meeting.type === 'Scrum' ? '👨‍💼' :
                                  meeting.type === 'Team Meeting' ? '👥' :
                                    '📅'}
                        </div>
                        <div className="meeting-details">
                          <p className="meeting-title">
                            {meeting.title}
                          </p>
                          <div className="meeting-time">
                            <span>{formatMeetingDate(new Date(meeting.date))}</span>
                            <span>•</span>
                            <span>{formatMeetingTime(meeting.startTime)} - {formatMeetingTime(meeting.endTime)}</span>
                          </div>
                          <div className="meeting-tags">
                            <span className={`meeting-status ${meeting.status}`}>
                              {meeting.status}
                            </span>
                            <span className="meeting-duration">
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
                        <div className="meeting-category-title">
                          Client Meetings ({clientMeetings.length})
                        </div>
                        {clientMeetings.slice(0, 3).map(meeting => (
                          <div
                            key={meeting.id}
                            className="meeting-card client"
                          >
                            <div className="meeting-icon" style={{ backgroundColor: '#8B5CF6' }}>
                              🤝
                            </div>
                            <div className="meeting-details">
                              <p className="meeting-title">
                                {meeting.title}
                              </p>
                              <div className="meeting-time">
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
                        <div className="meeting-category-title">
                          Team Meetings ({teamMeetings.length})
                        </div>
                        {teamMeetings.slice(0, 2).map(meeting => (
                          <div
                            key={meeting.id}
                            className="meeting-card team"
                          >
                            <div className="meeting-icon" style={{ backgroundColor: '#3B82F6' }}>
                              👥
                            </div>
                            <div className="meeting-details">
                              <p className="meeting-title">
                                {meeting.title}
                              </p>
                              <div className="meeting-time">
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
                        <div className="meeting-category-title">
                          Other Meetings ({otherMeetings.length})
                        </div>
                        {otherMeetings.slice(0, 2).map(meeting => (
                          <div
                            key={meeting.id}
                            className="meeting-card other"
                          >
                            <div className="meeting-icon" style={{ backgroundColor: '#F59E0B' }}>
                              📅
                            </div>
                            <div className="meeting-details">
                              <p className="meeting-title">
                                {meeting.title}
                              </p>
                              <div className="meeting-time">
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
              <div className="calendar-section-header">
                <h4>
                  <span>📝</span>
                  Upcoming Tasks ({upcomingEvents.length})
                </h4>
                <button
                  onClick={() => setShowAllTasks(!showAllTasks)}
                  className={`view-all-button ${showAllTasks ? 'active' : ''}`}
                >
                  {showAllTasks ? 'Show Less' : 'View All'}
                </button>
              </div>
              <div className="upcoming-tasks-list">
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="upcoming-task-item"
                    onClick={() => handleEditTask(event)}
                  >
                    <div
                      className="task-priority-dot"
                      style={{
                        backgroundColor:
                          getPriorityText(event.priority) === 'High' ? '#EF4444' :
                            getPriorityText(event.priority) === 'Medium' ? '#F59E0B' : '#10B981'
                      }}
                    ></div>
                    <div className="task-details">
                      <p className="task-name">
                        {event.task}
                      </p>
                      <div className="task-meta">
                        <span>{event.dueDate?.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{event.department}</span>
                        <span>•</span>
                        <span className={`priority-tag ${getPriorityText(event.priority).toLowerCase()}`}>
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Dashboard
          </h1>
          <p className="dashboard-subtitle">
            {selectedFilter === 'All' ? 'Welcome! Here\'s what\'s happening.' :
              selectedFilter === 'Today' ? 'Today\'s overview' :
                selectedFilter === 'This Week' ? 'This week\'s activities' :
                  'Calendar view'}
          </p>
        </div>

        <div className="header-controls">
          <div className="filter-tabs">
            {['All', 'Today', 'This Week', 'Calendar'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  setShowAllTasks(false);
                }}
                className={`filter-tab ${selectedFilter === filter ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="user-dropdown-container" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="user-avatar-button"
            >
              {user.initials}
            </button>

            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="user-profile">
                  <div className="user-avatar-large">
                    {user.initials}
                  </div>
                  <div>
                    <p className="user-name">
                      {user.name}
                    </p>
                    <p className="user-email">
                      {user.email}
                    </p>
                    <span className="user-role">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div>
                <p className="stat-title">
                  {stat.title}
                </p>
                <p className="stat-value">
                  {stat.value}
                </p>
              </div>
              <div
                className="stat-icon"
                style={{ backgroundColor: `${stat.color}15` }}
              >
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
            <p className={`stat-change ${stat.change.includes('+') ? 'positive' : stat.change.includes('-') ? 'negative' : ''}`}>
              {stat.change} from last period
            </p>
          </div>
        ))}
      </div>

      {selectedFilter === 'Calendar' ? (
        <CalendarView />
      ) : (
        <div className="dashboard-content">
          <div className="tasks-section">
            <div className="tasks-container">
              <div className="section-header">
                <h2>
                  {selectedFilter === 'All' ? 'Recent Tasks' :
                    selectedFilter === 'Today' ? 'Today\'s Tasks' :
                      'This Week\'s Tasks'}
                </h2>
                <button
                  onClick={() => setShowAllTasks(!showAllTasks)}
                  className={`view-all-button ${showAllTasks ? 'active' : ''}`}
                >
                  {showAllTasks ? 'Show Less' : 'View All'}
                </button>
              </div>

              <div className="tasks-list">
                {filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`task-item ${index === 0 && !showAllTasks ? 'highlighted' : ''}`}
                  >
                    <div className="task-header">
                      <div>
                        <p className="task-title">
                          {task.task}
                        </p>
                        <div className="task-meta-info">
                          <span className="priority-info">
                            <div
                              className="priority-dot"
                              style={{
                                backgroundColor:
                                  getPriorityText(task.priority) === 'High' ? '#EF4444' :
                                    getPriorityText(task.priority) === 'Medium' ? '#F59E0B' : '#10B981'
                              }}
                            ></div>
                            {getPriorityText(task.priority)} Priority
                          </span>
                          <span className="due-date">
                            Due: {getDueDate(task)}
                          </span>
                          <span className={`status-badge ${task.status}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="task-actions">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className={`complete-button ${task.status === 'completed' ? 'completed' : ''}`}
                        >
                          {task.status === 'completed' ? 'Completed' : 'Complete'}
                        </button>
                      </div>
                    </div>

                    <div className="task-progress">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span>{getProgress(task)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${getProgress(task)}%`,
                            backgroundColor: getProgress(task) > 70 ? '#10B981' : getProgress(task) > 30 ? '#3B82F6' : '#F59E0B'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="activities-section">
            <div className="activities-container">
              <h2>
                Recent Activity
              </h2>

              <div className="activities-list">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div
                      className="activity-icon"
                      style={{
                        backgroundColor:
                          activity.action === 'completed' ? '#D1FAE5' :
                            activity.action === 'uploaded' ? '#DBEAFE' :
                              activity.action === 'commented' ? '#FEF3C7' :
                                activity.action === 'assigned' ? '#E0E7FF' :
                                  activity.action === 'started' ? '#FCE7F3' :
                                    activity.action === 'scheduled' ? '#FEF3C7' :
                                      activity.action === 'reminder' ? '#FEE2E2' :
                                        activity.action === 'auto-generated' ? '#E5E7EB' : '#F3F4F6'
                      }}
                    >
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

                    <div className="activity-details">
                      <p className="activity-description">
                        <strong>{activity.user}</strong> {activity.action} {activity.task}
                      </p>
                      <p className="activity-time">
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
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>
                Edit Task
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
                }}
                className="modal-close-button"
              >
                ×
              </button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>
                  Department
                </label>
                <select
                  value={editingTask.department}
                  onChange={(e) => setEditingTask({ ...editingTask, department: e.target.value })}
                >
                  {['Management', 'Sales', 'Operations', 'Marketing', 'Human Resources', 'Finance', 'Customer Service'].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Task Description
                </label>
                <textarea
                  value={editingTask.task}
                  onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                  placeholder="Enter task description..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>
                  Created Date
                </label>
                <input
                  type="date"
                  value={editingTask.createdAt ? editingTask.createdAt.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    createdAt: e.target.value ? new Date(e.target.value) : new Date()
                  })}
                />
              </div>

              <div className="form-group">
                <label>
                  Due Date
                </label>
                <input
                  type="date"
                  value={editingTask.dueDate ? editingTask.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    dueDate: e.target.value ? new Date(e.target.value) : null
                  })}
                />
              </div>

              <div className="form-group">
                <label>
                  Priority
                </label>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                >
                  {['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'].map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Status
                </label>
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as 'pending' | 'in-progress' | 'completed' })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={handleSaveEdit}
                className="save-button"
              >
                Update Task
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
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