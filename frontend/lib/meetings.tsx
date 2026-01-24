// lib/meetings.ts
export interface Meeting {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: string;
  participants: string[];
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Use localStorage to persist meetings
const STORAGE_KEY = 'meetings_data';

const getDefaultMeetings = (): Meeting[] => {
  return [
    {
      id: 1,
      title: 'Daily Scrum',
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      startTime: '09:00',
      endTime: '09:30',
      duration: '0:30',
      participants: ['John', 'Sarah', 'Mike'],
      type: 'Scrum',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Client Presentation',
      date: new Date(),
      startTime: '14:00',
      endTime: '15:30',
      duration: '1:30',
      participants: ['Client ABC', 'Sarah', 'Marketing Team'],
      type: 'Client Meeting',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Sprint Planning',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      startTime: '10:00',
      endTime: '12:00',
      duration: '2:00',
      participants: ['Dev Team', 'Product Owner'],
      type: 'Planning',
      status: 'scheduled'
    },
    {
      id: 4,
      title: 'Team Retrospective',
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      startTime: '16:00',
      endTime: '17:00',
      duration: '1:00',
      participants: ['Entire Team'],
      type: 'Retrospective',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Product Demo',
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      startTime: '11:00',
      endTime: '12:00',
      duration: '1:00',
      participants: ['Stakeholders', 'Management'],
      type: 'Demo',
      status: 'scheduled'
    }
  ];
};

export const getAllMeetings = (): Meeting[] => {
  if (typeof window === 'undefined') {
    return getDefaultMeetings();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((meeting: any) => ({
        ...meeting,
        date: new Date(meeting.date)
      }));
    }
  } catch (error) {
    console.error('Error loading meetings from storage:', error);
  }
  
  // Initialize with default meetings if nothing in storage
  const defaultMeetings = getDefaultMeetings();
  saveMeetings(defaultMeetings);
  return defaultMeetings;
};

export const saveMeetings = (meetings: Meeting[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Convert to plain objects for storage
    const meetingsToStore = meetings.map(meeting => ({
      ...meeting,
      date: meeting.date.toISOString()
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetingsToStore));
  } catch (error) {
    console.error('Error saving meetings:', error);
  }
};

export const addMeeting = (meeting: Omit<Meeting, 'id'>): Meeting => {
  const meetings = getAllMeetings();
  const newId = meetings.length > 0 ? Math.max(...meetings.map(m => m.id)) + 1 : 1;
  const newMeeting: Meeting = {
    ...meeting,
    id: newId
  };
  
  const updatedMeetings = [...meetings, newMeeting];
  saveMeetings(updatedMeetings);
  return newMeeting;
};

export const updateMeeting = (id: number, updates: Partial<Meeting>): Meeting | null => {
  const meetings = getAllMeetings();
  const index = meetings.findIndex(m => m.id === id);
  
  if (index === -1) return null;
  
  const updatedMeeting = { ...meetings[index], ...updates };
  const updatedMeetings = [...meetings];
  updatedMeetings[index] = updatedMeeting;
  
  saveMeetings(updatedMeetings);
  return updatedMeeting;
};

export const deleteMeeting = (id: number): boolean => {
  const meetings = getAllMeetings();
  const filteredMeetings = meetings.filter(m => m.id !== id);
  
  if (filteredMeetings.length === meetings.length) return false;
  
  saveMeetings(filteredMeetings);
  return true;
};

export const getMeetingsForDate = (date: Date): Meeting[] => {
  const meetings = getAllMeetings();
  return meetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    return meetingDate.toDateString() === date.toDateString();
  });
};

export const getUpcomingMeetings = (days: number = 7): Meeting[] => {
  const meetings = getAllMeetings();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  
  return meetings
    .filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate >= today && meetingDate <= futureDate && meeting.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const formatMeetingTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
};

export const formatMeetingDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Helper function to calculate duration
export const calculateDuration = (start: string, end: string): string => {
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);

  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};