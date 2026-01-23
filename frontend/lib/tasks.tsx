// Centralized task storage that both pages can access

export interface Task {
  id: number;
  department: string;
  task: string;
  priority: string;
  status: 'pending' | 'in-progress' | 'completed';
}

let tasks: Task[] = [
  { 
    id: 1,
    department: 'Management', 
    task: 'Finalize the sales plan for new product marketing', 
    priority: '4 ⬇ 2',
    status: 'pending'
  },
  { 
    id: 2,
    department: 'Sales', 
    task: 'Run sales Training program for sales representatives', 
    priority: '2 ⬇ 1',
    status: 'pending'
  },
  { 
    id: 3,
    department: 'Operations', 
    task: 'Secure lease on new office space for expanded team', 
    priority: '3 ⬇ 0',
    status: 'completed'
  },
  { 
    id: 4,
    department: 'Marketing', 
    task: 'Cost estimates for next year\'s marketing plan', 
    priority: '3 ⬇ 2',
    status: 'pending'
  },
  { 
    id: 5,
    department: 'Human Resources', 
    task: 'Hire New Operations & Facilities Manager', 
    priority: '2 ⬇ 4',
    status: 'in-progress'
  },
  { 
    id: 6,
    department: 'Management', 
    task: 'Prepare end of year report for board of directors', 
    priority: '3 ⬇ 1',
    status: 'pending'
  },
  { 
    id: 7,
    department: 'Finance', 
    task: 'Cost projections for company acquisition & Impact on revenue', 
    priority: '6 ⬇ 2',
    status: 'pending'
  },
  { 
    id: 8,
    department: 'Operations', 
    task: 'Secure lease On New Office Space For Expanded Team', 
    priority: '3 ⬇ 2',
    status: 'completed'
  },
  { 
    id: 9,
    department: 'Marketing', 
    task: 'Create facebook Ad capaign for product launch', 
    priority: '5 ⬇ 3',
    status: 'in-progress'
  },
  { 
    id: 10,
    department: 'Customer Service', 
    task: 'Prepare the sales reports for board of directors', 
    priority: '3 ⬇ 1',
    status: 'pending'
  },
  { 
    id: 11,
    department: 'Customer Service', 
    task: 'On-board new user from Respogrid Networks company', 
    priority: '8 ⬇ 3',
    status: 'completed'
  },
  { 
    id: 12,
    department: 'Management', 
    task: 'Prepare the meeting for annual product sales', 
    priority: '6 ⬇ 3',
    status: 'pending'
  },
  { 
    id: 13,
    department: 'Finance', 
    task: 'Finalize the monthly salaries statement for sales man', 
    priority: '5 ⬇ 3',
    status: 'in-progress'
  },
  { 
    id: 14,
    department: 'Human Resources', 
    task: 'Hire New Sales & Marketing Manager for main branch', 
    priority: '1 ⬇ 3',
    status: 'pending'
  },
];

// Get all tasks
export function getAllTasks(): Task[] {
  return [...tasks];
}

// Add new task
export function addTask(newTask: Omit<Task, 'id'>): Task {
  const id = Math.max(...tasks.map(t => t.id), 0) + 1;
  const taskWithId: Task = { id, ...newTask };
  tasks.push(taskWithId);
  return taskWithId;
}

// Update task
export function updateTask(taskId: number, updatedTask: Partial<Task>): Task | null {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    return tasks[index];
  }
  return null;
}

// Delete task
export function deleteTask(taskId: number): boolean {
  tasks = tasks.filter(t => t.id !== taskId);
  return true;
}

// Get tasks by department
export function getTasksByDepartment(department: string): Task[] {
  return tasks.filter(t => t.department === department);
}