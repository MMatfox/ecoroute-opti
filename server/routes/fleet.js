import express from 'express';
import { seedTrucks, seedDepot } from '../data/seedData.js';
import { trafficSimulator } from '../services/trafficSimulator.js';
import { getDistanceKm } from '../services/vrpEngine.js';

export const fleetRouter = express.Router();

let trucks = [...seedTrucks];
let activeRoutesCache = [];

export function setActiveRoutes(routes) {
  activeRoutesCache = routes;
}

// Get all fleet trucks & positions (US9)
fleetRouter.get('/trucks', (req, res) => {
  // Advance simulation step if active
  trucks = trafficSimulator.stepSimulation(trucks, activeRoutesCache);

  res.json({
    success: true,
    trucks,
    depot: seedDepot,
    trafficZones: trafficSimulator.getTrafficZones(),
    activeRoutes: activeRoutesCache
  });
});

// Update route validity / report traffic delay (US7)
fleetRouter.post('/trucks/:truckId/validity', (req, res) => {
  const { truckId } = req.params;
  const { isDelayed, delayReason, newEta, status } = req.body;

  const truck = trucks.find(t => t.id === truckId);
  if (!truck) {
    return res.status(404).json({ error: 'Truck not found' });
  }

  if (isDelayed !== undefined) truck.isDelayed = Boolean(isDelayed);
  if (delayReason) truck.delayReason = delayReason;
  if (newEta) truck.currentEta = newEta;
  if (status) truck.status = status;

  res.json({
    success: true,
    message: `Đã cập nhật trạng thái hiệu lực tuyến đường xe ${truck.licensePlate}`,
    truck
  });
});

// Citizen Truck Tracking & Proximity Radar (US8)
fleetRouter.get('/track-for-citizen', (req, res) => {
  const { lat, lng, requestId } = req.query;
  const citizenLat = parseFloat(lat) || 16.0602;
  const citizenLng = parseFloat(lng) || 108.2165;

  // Find the closest or assigned truck
  let closestTruck = null;
  let minDistance = Infinity;

  trucks.forEach(t => {
    const dist = getDistanceKm(t.lat, t.lng, citizenLat, citizenLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestTruck = t;
    }
  });

  const distMeters = Math.round(minDistance * 1000);
  const etaMinutes = Math.max(1, Math.round((minDistance / (closestTruck?.speedKmH || 25)) * 60));
  
  // Proximity alert trigger: within 500m or under 6 minutes
  const isApproaching = distMeters < 800 || etaMinutes <= 8;

  res.json({
    success: true,
    truck: closestTruck,
    distanceKm: Number(minDistance.toFixed(2)),
    distanceMeters: distMeters,
    etaMinutes: etaMinutes,
    isApproaching,
    alertMessage: isApproaching
      ? `🔔 Xe thu gom rác ${closestTruck?.licensePlate} (${closestTruck?.driverName}) đang cách bạn ${distMeters}m (dự kiến đến trong ~${etaMinutes} phút). Vui lòng chuẩn bị đem rác ra!`
      : `Xe thu gom đang hoạt động theo lịch trình. Dự kiến đến sau ${etaMinutes} phút.`
  });
});

// Simulation controls
fleetRouter.post('/simulation/control', (req, res) => {
  const { action, speed, newIncident } = req.body;

  if (action === 'PAUSE') trafficSimulator.isPaused = true;
  if (action === 'RESUME') trafficSimulator.isPaused = false;
  if (speed) trafficSimulator.simulationSpeed = Number(speed);
  if (newIncident) trafficSimulator.addTrafficIncident(newIncident);

  res.json({
    success: true,
    isPaused: trafficSimulator.isPaused,
    speed: trafficSimulator.simulationSpeed,
    trafficZones: trafficSimulator.getTrafficZones()
  });
});
