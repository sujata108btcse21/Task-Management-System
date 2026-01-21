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
declare class MemoryDB {
    private users;
    private tasks;
    private userTasks;
    createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User;
    findUserByEmail(email: string): User | undefined;
    findUserById(id: string): User | undefined;
    createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task;
    getTasksByUserId(userId: string, filters?: {
        status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
        search?: string;
    }): Task[];
    getTaskById(id: string): Task | undefined;
    updateTask(id: string, updates: Partial<Task>): Task | null;
    deleteTask(id: string): boolean;
    paginate<T>(array: T[], page: number, limit: number): {
        data: T[];
        total: number;
        totalPages: number;
    };
}
export declare const db: MemoryDB;
export {};
