import express from 'express';
import { AnalyticsRedisRepository } from './repository/analytics.redis.repository.js';
import { AnalyticsService } from './services/analytics.service.js';

const app = express();
const port = 3000;

// Dependency Injection Setup
const redisRepo = new AnalyticsRedisRepository();
const analyticsService = new AnalyticsService(redisRepo);

// Start analytics service
analyticsService.start();

app.get('/status', (req, res) => {
  res.json({ status: 'Analytics Engine is running' });
});

app.listen(port, () => {
  console.log(`Service listening at http://localhost:${port}`);
});