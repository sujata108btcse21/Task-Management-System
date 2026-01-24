'use client';

export interface Task {
  id: number;
  department: string;
  task: string;
  priority: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  dueDate: Date | null;
}

export interface Activity {
  id: number;
  user: string;
  action: string;
  task: string;
  taskId?: number;
  timestamp: Date;
  time?: string;
}

const STORAGE_KEYS = {
  TASKS: 'task_management_tasks_v2',
  ACTIVITIES: 'task_management_activities_v2',
  NEXT_TASK_ID: 'task_management_next_task_id',
  NEXT_ACTIVITY_ID: 'task_management_next_activity_id'
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          ...item,
          ...(item.createdAt && { createdAt: new Date(item.createdAt) }),
          ...(item.dueDate && { dueDate: item.dueDate ? new Date(item.dueDate) : null }),
          ...(item.timestamp && { timestamp: new Date(item.timestamp) })
        })) as T;
      }
      
      return parsed;
    }
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    localStorage.removeItem(key);
  }
  
  return defaultValue;
}

function saveToStorage(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    const serializableData = JSON.stringify(data, (_, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
    localStorage.setItem(key, serializableData);
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

function getNextId(key: string): number {
  if (typeof window === 'undefined') return 1;
  
  try {
    const nextId = localStorage.getItem(key);
    return nextId ? parseInt(nextId) : 1;
  } catch {
    return 1;
  }
}

function saveNextId(key: string, id: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, id.toString());
}

function getDefaultTasks(): Task[] {
  return [
    { 
      id: 1,
      department: 'Management', 
      task: 'Finalize the sales plan for new product marketing', 
      priority: 'P4',
      status: 'pending',
      createdAt: new Date('2024-01-15'),
      dueDate: new Date('2024-02-01')
    },
    { 
      id: 2,
      department: 'Sales', 
      task: 'Run sales Training program for sales representatives', 
      priority: 'P2',
      status: 'pending',
      createdAt: new Date('2024-01-10'),
      dueDate: new Date('2024-01-25')
    },
    { 
      id: 3,
      department: 'Operations', 
      task: 'Secure lease on new office space for expanded team', 
      priority: 'P3',
      status: 'completed',
      createdAt: new Date('2024-01-05'),
      dueDate: new Date('2024-01-20')
    },
    { 
      id: 4,
      department: 'Marketing', 
      task: 'Cost estimates for next year\'s marketing plan', 
      priority: 'P3',
      status: 'pending',
      createdAt: new Date('2024-01-18'),
      dueDate: new Date('2024-02-05')
    },
    { 
      id: 5,
      department: 'Human Resources', 
      task: 'Hire New Operations & Facilities Manager', 
      priority: 'P2',
      status: 'in-progress',
      createdAt: new Date('2024-01-12'),
      dueDate: new Date('2024-01-30')
    },
    { 
      id: 6,
      department: 'Management', 
      task: 'Prepare end of year report for board of directors', 
      priority: 'P3',
      status: 'pending',
      createdAt: new Date('2024-01-20'),
      dueDate: new Date('2024-01-31')
    },
    { 
      id: 7,
      department: 'Finance', 
      task: 'Cost projections for company acquisition & Impact on revenue', 
      priority: 'P6',
      status: 'pending',
      createdAt: new Date('2024-01-22'),
      dueDate: new Date('2024-02-10')
    },
    { 
      id: 8,
      department: 'Operations', 
      task: 'Secure lease On New Office Space For Expanded Team', 
      priority: 'P3',
      status: 'completed',
      createdAt: new Date('2024-01-03'),
      dueDate: new Date('2024-01-15')
    },
    { 
      id: 9,
      department: 'Marketing', 
      task: 'Create facebook Ad capaign for product launch', 
      priority: 'P5',
      status: 'in-progress',
      createdAt: new Date('2024-01-19'),
      dueDate: new Date('2024-01-28')
    },
    { 
      id: 10,
      department: 'Customer Service', 
      task: 'Prepare the sales reports for board of directors', 
      priority: 'P3',
      status: 'pending',
      createdAt: new Date('2024-01-21'),
      dueDate: new Date('2024-02-02')
    },
    { 
      id: 11,
      department: 'Customer Service', 
      task: 'On-board new user from Respogrid Networks company', 
      priority: 'P8',
      status: 'completed',
      createdAt: new Date('2024-01-08'),
      dueDate: new Date('2024-01-18')
    },
    { 
      id: 12,
      department: 'Management', 
      task: 'Prepare the meeting for annual product sales', 
      priority: 'P6',
      status: 'pending',
      createdAt: new Date('2024-01-17'),
      dueDate: new Date('2024-01-29')
    },
    { 
      id: 13,
      department: 'Finance', 
      task: 'Finalize the monthly salaries statement for sales man', 
      priority: 'P5',
      status: 'in-progress',
      createdAt: new Date('2024-01-16'),
      dueDate: new Date('2024-01-27')
    },
    { 
      id: 14,
      department: 'Human Resources', 
      task: 'Hire New Sales & Marketing Manager for main branch', 
      priority: 'P1',
      status: 'pending',
      createdAt: new Date('2024-01-23'),
      dueDate: new Date('2024-02-08')
    },
  ];
}

function getDefaultActivities(): Activity[] {
  return [
    {
      id: 1,
      user: 'Jacob Doe',
      action: 'created',
      task: 'Prepare end of year report for board of directors',
      taskId: 6,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      time: '2 hours ago'
    },
    {
      id: 2,
      user: 'System',
      action: 'completed',
      task: 'Secure lease on new office space for expanded team',
      taskId: 3,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      time: '5 hours ago'
    },
    {
      id: 3,
      user: 'Alex Johnson',
      action: 'started',
      task: 'Hire New Operations & Facilities Manager',
      taskId: 5,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      time: 'Yesterday'
    },
    {
      id: 4,
      user: 'Sarah Miller',
      action: 'updated',
      task: 'Create facebook Ad capaign for product launch',
      taskId: 9,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      time: '2 days ago'
    }
  ];
}

let tasks: Task[] = loadFromStorage(STORAGE_KEYS.TASKS, getDefaultTasks());
let activities: Activity[] = loadFromStorage(STORAGE_KEYS.ACTIVITIES, getDefaultActivities());

const nextTaskId = getNextId(STORAGE_KEYS.NEXT_TASK_ID) || Math.max(...tasks.map(t => t.id), 0) + 1;
const nextActivityId = getNextId(STORAGE_KEYS.NEXT_ACTIVITY_ID) || Math.max(...activities.map(a => a.id), 0) + 1;

export function getAllTasks(): Task[] {
  return [...tasks];
}

export function addTask(newTask: Omit<Task, 'id'>): Task {
  const id = nextTaskId;
  saveNextId(STORAGE_KEYS.NEXT_TASK_ID, id + 1);
  
  const taskWithId: Task = { 
    id, 
    createdAt: new Date(),
    dueDate: null,
    ...newTask 
  };
  tasks.push(taskWithId);
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
  
  addActivity({
    user: 'System',
    action: 'created',
    task: taskWithId.task,
    taskId: taskWithId.id
  });
  
  return taskWithId;
}

export function updateTask(taskId: number, updatedTask: Partial<Task>): Task | null {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    return tasks[index];
  }
  return null;
}

export function deleteTask(taskId: number): boolean {
  const task = tasks.find(t => t.id === taskId);
  tasks = tasks.filter(t => t.id !== taskId);
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
  
  if (task) {
    addActivity({
      user: 'System',
      action: 'deleted',
      task: task.task,
      taskId: task.id
    });
  }
  
  return true;
}

export function getTasksByDepartment(department: string): Task[] {
  return tasks.filter(t => t.department === department);
}

export function addActivity(newActivity: Omit<Activity, 'id' | 'timestamp' | 'time'>): Activity {
  const id = nextActivityId;
  saveNextId(STORAGE_KEYS.NEXT_ACTIVITY_ID, id + 1);
  
  const now = new Date();
  const activityWithId: Activity = { 
    id, 
    ...newActivity, 
    timestamp: now,
    time: formatTimeAgo(now)
  };
  activities.push(activityWithId);
  saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
  return activityWithId;
}

export function getRecentActivities(limit?: number): Activity[] {
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return limit ? sortedActivities.slice(0, limit) : sortedActivities;
}

export function getTasksCreatedToday(): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  return tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() >= today.getTime() && taskDate.getTime() < tomorrow.getTime();
  });
}

export function getTasksCreatedThisWeek(): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  return tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() >= startOfWeek.getTime() && taskDate.getTime() < endOfWeek.getTime();
  });
}

export function getTasksDueToday(): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() >= today.getTime() && dueDate.getTime() < tomorrow.getTime();
  });
}

export function getTasksDueThisWeek(): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() >= today.getTime() && dueDate.getTime() <= endOfWeek.getTime();
  });
}

function formatTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function resetToDefaults(): void {
  tasks = getDefaultTasks();
  activities = getDefaultActivities();
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
  saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
  saveNextId(STORAGE_KEYS.NEXT_TASK_ID, tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1);
  saveNextId(STORAGE_KEYS.NEXT_ACTIVITY_ID, activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1);
}

export function clearAllData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.NEXT_TASK_ID);
    localStorage.removeItem(STORAGE_KEYS.NEXT_ACTIVITY_ID);
  }
  tasks = getDefaultTasks();
  activities = getDefaultActivities();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
  });
}