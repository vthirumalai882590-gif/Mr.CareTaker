/**
 * SpashtCare — Express Server Main Application
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import express from 'express';
import cors from 'cors';

import { getDb } from './db/index';
import casesRouter from './routes/cases';
import documentsRouter from './routes/documents';
import consentRouter from './routes/consent';
import whatsappRouter from './routes/whatsapp';
import aiRouter from './routes/ai';
import { startReminderScheduler } from './services/reminders/scheduler';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'https://mr-care-taker-client.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Ensure database is initialized & schema applied
getDb();

// Register API Routes
app.use('/api/cases', casesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/consent', consentRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/ai', aiRouter);

// Health checks
app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

app.get('/api/ping', (_req, res) => {
  res.status(200).send('pong');
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SpashtCare Server',
    timestamp: new Date().toISOString(),
    disclaimer: "SpashtCare reads and organizes what your doctor already prescribed. It does not diagnose."
  });
});

// Start scheduler
startReminderScheduler();

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SpashtCare Server listening on http://localhost:${PORT}`);
  console.log(`   API Endpoint: http://localhost:${PORT}/api/cases/case-001`);
  console.log(`====================================================`);
});
