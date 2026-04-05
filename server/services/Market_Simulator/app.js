import express from 'express';
import { RedisRepository } from './repository/redis.repository.js';
import { MarketSimulationService } from './services/marketsimulation.service.js';

const app = express();
const port = 3000;

// Dependency Injection Setup
const redisRepo = new RedisRepository();
const marketService = new MarketSimulationService(redisRepo);

// Start simulation immediately
marketService.start();

app.get('/status', (req, res) => {
  res.json({ status: 'Simulator is running' });
});

app.listen(port, () => {
  console.log(`Service listening at http://localhost:${port}`);
});