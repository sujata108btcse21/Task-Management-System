"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTaskStatus = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const memoryDB_1 = require("../db/memoryDB");
const getTasks = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { page = '1', limit = '10', search = '', status } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        // Get tasks with filters
        const allTasks = memoryDB_1.db.getTasksByUserId(userId, {
            status: status,
            search: search
        });
        // Apply pagination
        const { data: tasks, total, totalPages } = memoryDB_1.db.paginate(allTasks, pageNum, limitNum);
        res.json({
            success: true,
            tasks,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const task = memoryDB_1.db.getTaskById(id);
        if (!task || task.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.json({
            success: true,
            task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { title, description, status = 'TODO' } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }
        const task = memoryDB_1.db.createTask({
            title,
            description: description || null,
            status,
            userId,
        });
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const updateTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { title, description, status } = req.body;
        // Check if task exists and belongs to user
        const existingTask = memoryDB_1.db.getTaskById(id);
        if (!existingTask || existingTask.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        const task = memoryDB_1.db.updateTask(id, {
            ...(title && { title }),
            ...(description !== undefined && { description }),
            ...(status && { status }),
        });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.json({
            success: true,
            message: 'Task updated successfully',
            task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        // Check if task exists and belongs to user
        const existingTask = memoryDB_1.db.getTaskById(id);
        if (!existingTask || existingTask.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        const deleted = memoryDB_1.db.deleteTask(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.json({
            success: true,
            message: 'Task deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
const toggleTaskStatus = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const task = memoryDB_1.db.getTaskById(id);
        if (!task || task.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        // Cycle through statuses: TODO → IN_PROGRESS → DONE → TODO
        const statusOrder = ['TODO', 'IN_PROGRESS', 'DONE'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        const updatedTask = memoryDB_1.db.updateTask(id, { status: nextStatus });
        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.json({
            success: true,
            message: 'Task status updated',
            task: updatedTask,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleTaskStatus = toggleTaskStatus;
//# sourceMappingURL=task.controller.js.map