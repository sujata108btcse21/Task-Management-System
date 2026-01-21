"use strict";
// In-memory database for development
// In production, replace with real database
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
class MemoryDB {
    constructor() {
        this.users = new Map();
        this.tasks = new Map();
        this.userTasks = new Map();
    }
    // User methods
    createUser(user) {
        const id = Date.now().toString();
        const now = new Date();
        const newUser = {
            ...user,
            id,
            createdAt: now,
            updatedAt: now
        };
        this.users.set(id, newUser);
        this.userTasks.set(id, new Set());
        return newUser;
    }
    findUserByEmail(email) {
        return Array.from(this.users.values()).find(user => user.email === email);
    }
    findUserById(id) {
        return this.users.get(id);
    }
    // Task methods
    createTask(task) {
        const id = Date.now().toString();
        const now = new Date();
        const newTask = {
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
    getTasksByUserId(userId, filters) {
        const userTaskIds = this.userTasks.get(userId);
        if (!userTaskIds)
            return [];
        const tasks = Array.from(userTaskIds)
            .map(taskId => this.tasks.get(taskId))
            .filter(Boolean);
        // Apply filters
        let filteredTasks = tasks;
        if (filters?.status) {
            filteredTasks = filteredTasks.filter(task => task.status === filters.status);
        }
        if (filters?.search) {
            filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(filters.search.toLowerCase()));
        }
        return filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    getTaskById(id) {
        return this.tasks.get(id);
    }
    updateTask(id, updates) {
        const task = this.tasks.get(id);
        if (!task)
            return null;
        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date()
        };
        this.tasks.set(id, updatedTask);
        return updatedTask;
    }
    deleteTask(id) {
        const task = this.tasks.get(id);
        if (!task)
            return false;
        // Remove from user's task list
        const userTasks = this.userTasks.get(task.userId);
        if (userTasks) {
            userTasks.delete(id);
        }
        return this.tasks.delete(id);
    }
    // Pagination helper
    paginate(array, page, limit) {
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
exports.db = new MemoryDB();
//# sourceMappingURL=memoryDB.js.map