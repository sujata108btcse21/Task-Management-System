interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

class MemoryDB {
  private users: Map<string, User> = new Map();
  private tasks: Map<string, Task> = new Map();
  private userTasks: Map<string, Set<string>> = new Map();

  // User methods
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = Date.now().toString();
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, newUser);
    this.userTasks.set(id, new Set());
    return newUser;
  }

  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  // Task methods
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const id = Date.now().toString();
    const now = new Date();
    const newTask: Task = {
      ...task,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.tasks.set(id, newTask);
    
    // Add to user's task list
    const userTasks = this.userTasks.get(task.userId);
    if (userTasks) {
      userTasks.add(id);
    }
    
    return newTask;
  }

  getTasksByUserId(userId: string, filters?: {
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    search?: string;
  }): Task[] {
    const userTaskIds = this.userTasks.get(userId);
    if (!userTaskIds) return [];

    const tasks = Array.from(userTaskIds)
      .map(taskId => this.tasks.get(taskId))
      .filter(Boolean) as Task[];

    // Apply filters
    let filteredTasks = tasks;
    
    if (filters?.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    if (filters?.search) {
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    return filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date()
    };
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;

    // Remove from user's task list
    const userTasks = this.userTasks.get(task.userId);
    if (userTasks) {
      userTasks.delete(id);
    }

    return this.tasks.delete(id);
  }

  // Pagination helper
  paginate<T>(array: T[], page: number, limit: number): { data: T[]; total: number; totalPages: number } {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = array.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: array.slice(startIndex, endIndex),
      total,
      totalPages
    };
  }
}

export const db = new MemoryDB();
