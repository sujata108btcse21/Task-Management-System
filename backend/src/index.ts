import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Simple in-memory storage
const users: any[] = [];
const tasks: any[] = [];

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User exists' });
  }
  
  const user = {
    id: Date.now().toString(),
    email,
    password,
    name,
    createdAt: new Date()
  };
  
  users.push(user);
  
  res.status(201).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
  });
});

// Task endpoints
app.get('/api/tasks', (req, res) => {
  const { userId, page = 1, limit = 10, status, search } = req.query;
  
  let filtered = tasks;
  
  if (userId) filtered = filtered.filter(t => t.userId === userId);
  if (status) filtered = filtered.filter(t => t.status === status);
  if (search) filtered = filtered.filter(t => t.title.includes(search));
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  
  res.json({
    success: true,
    tasks: filtered.slice(start, end),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum)
    }
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, status = 'TODO', userId } = req.body;
  
  if (!title || !userId) {
    return res.status(400).json({ error: 'Title and userId required' });
  }
  
  const task = {
    id: Date.now().toString(),
    title,
    description,
    status,
    userId,
    createdAt: new Date()
  };
  
  tasks.push(task);
  
  res.status(201).json({
    success: true,
    task
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
