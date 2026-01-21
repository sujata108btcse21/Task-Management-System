import { Request, Response, NextFunction } from 'express';
import { db } from '../db/memoryDB';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { 
      page = '1', 
      limit = '10', 
      search = '', 
      status 
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Get tasks with filters
    const allTasks = db.getTasksByUserId(userId, {
      status: status as 'TODO' | 'IN_PROGRESS' | 'DONE',
      search: search as string
    });

    // Apply pagination
    const { data: tasks, total, totalPages } = db.paginate(allTasks, pageNum, limitNum);

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
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const task = db.getTaskById(id);

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
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { title, description, status = 'TODO' } = req.body;

    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title is required' 
      });
    }

    const task = db.createTask({
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
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Check if task exists and belongs to user
    const existingTask = db.getTaskById(id);
    if (!existingTask || existingTask.userId !== userId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    const task = db.updateTask(id, {
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
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if task exists and belongs to user
    const existingTask = db.getTaskById(id);
    if (!existingTask || existingTask.userId !== userId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    const deleted = db.deleteTask(id);

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
  } catch (error) {
    next(error);
  }
};

export const toggleTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const task = db.getTaskById(id);
    if (!task || task.userId !== userId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Cycle through statuses: TODO → IN_PROGRESS → DONE → TODO
    const statusOrder = ['TODO', 'IN_PROGRESS', 'DONE'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length] as 'TODO' | 'IN_PROGRESS' | 'DONE';

    const updatedTask = db.updateTask(id, { status: nextStatus });

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
  } catch (error) {
    next(error);
  }
};
