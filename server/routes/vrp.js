import express from 'express';
import { solveVRP } from '../services/vrpEngine.js';
import { seedDepot, seedTrucks } from '../data/seedData.js';
import { getRegisteredPoints } from './registrations.js';
import { setActiveRoutes } from './fleet.js';
import { trafficSimulator } from '../services/trafficSimulator.js';

export const vrpRouter = express.Router();

let lastOptimizationResult = null;

// Run VRP Optimization (US11, US12)
vrpRouter.post('/optimize', async (req, res) => {
  const { trafficFactor, avgSpeedKmH, customTrucks } = req.body;
  
  const points = getRegisteredPoints().filter(p => p.status !== 'SKIPPED');
  const trucks = customTrucks && customTrucks.length > 0 ? customTrucks : seedTrucks;
  const trafficZones = trafficSimulator.getTrafficZones();

  const optimization = await solveVRP(seedDepot, points, trucks, {
    trafficFactor: trafficFactor || 1.15,
    avgSpeedKmH: avgSpeedKmH || 26,
    trafficZones
  });

  lastOptimizationResult = optimization;
  setActiveRoutes(optimization.routes);

  res.json({
    success: true,
    message: `Tối ưu hóa VRP thành công! Đã lên kế hoạch cho ${optimization.routes.length} tuyến xe.`,
    data: optimization
  });
});

// Get latest active optimized plan (US11)
vrpRouter.get('/current-plan', async (req, res) => {
  if (!lastOptimizationResult) {
    // Run initial baseline optimization
    const points = getRegisteredPoints();
    lastOptimizationResult = await solveVRP(seedDepot, points, seedTrucks, {
      trafficZones: trafficSimulator.getTrafficZones()
    });
    setActiveRoutes(lastOptimizationResult.routes);
  }

  res.json({
    success: true,
    data: lastOptimizationResult
  });
});

// Get Driver Specific Route Manifest (US13)
vrpRouter.get('/manifest/:truckId', async (req, res) => {
  const { truckId } = req.params;
  if (!lastOptimizationResult) {
    const points = getRegisteredPoints();
    lastOptimizationResult = await solveVRP(seedDepot, points, seedTrucks);
    setActiveRoutes(lastOptimizationResult.routes);
  }

  const truckRoute = lastOptimizationResult.routes.find(r => r.truckId === truckId) || lastOptimizationResult.routes[0];
  
  if (!truckRoute) {
    return res.status(404).json({ error: 'Route not found for this truck' });
  }

  res.json({
    success: true,
    route: truckRoute,
    depot: seedDepot,
    generatedAt: new Date().toISOString()
  });
});
