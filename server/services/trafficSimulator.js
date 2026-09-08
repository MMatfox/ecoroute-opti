import { getDistanceKm } from './vrpEngine.js';

class TrafficSimulator {
  constructor() {
    this.trafficZones = [
      { id: 'zone_dragonbridge', name: 'Cầu Rồng & Nút giao Nguyễn Văn Linh (Hải Châu)', lat: 16.0612, lng: 108.2215, severity: 'MODERATE', delayMins: 15, radiusKm: 0.65 },
      { id: 'zone_dienbienphu', name: 'Ngã ba Huế & Hầm chui Điện Biên Phủ (Thanh Khê)', lat: 16.0645, lng: 108.1885, severity: 'HEAVY', delayMins: 25, radiusKm: 0.85 }
    ];
    this.simulationSpeed = 1; // multiplier
    this.isPaused = false;
  }

  getTrafficZones() {
    return this.trafficZones;
  }

  addTrafficIncident(zone) {
    const newZone = {
      id: `zone_${Date.now()}`,
      name: zone.name || 'Điểm ùn tắc phát sinh tại Đà Nẵng',
      lat: zone.lat || 16.0650,
      lng: zone.lng || 108.2200,
      severity: zone.severity || 'HEAVY',
      delayMins: zone.delayMins || 20,
      radiusKm: zone.radiusKm || 0.65
    };
    this.trafficZones.push(newZone);
    return newZone;
  }

  removeTrafficIncident(zoneId) {
    this.trafficZones = this.trafficZones.filter(z => z.id !== zoneId);
    return this.trafficZones;
  }

  // Update truck positions along their road geometry
  stepSimulation(trucks, activeRoutes) {
    if (this.isPaused) return trucks;

    return trucks.map(truck => {
      const route = activeRoutes.find(r => r.truckId === truck.id);
      if (!route) return truck;

      const roadPoints = route.roadGeometry && route.roadGeometry.length > 2
        ? route.roadGeometry
        : (route.waypoints || []).map(wp => [wp.lat, wp.lng]);

      if (roadPoints.length < 2) return truck;

      // Track index along road points
      let roadIdx = truck.roadPointIndex || 0;
      
      // Advance step along road points based on speed multiplier
      const stepIncrement = Math.max(1, Math.round(1 * (this.simulationSpeed || 1)));
      roadIdx += stepIncrement;

      if (roadIdx >= roadPoints.length - 1) {
        roadIdx = 0; // Loop collection tour
      }

      const currentPoint = roadPoints[roadIdx];
      truck.roadPointIndex = roadIdx;
      truck.lat = currentPoint[0];
      truck.lng = currentPoint[1];

      // Find closest upcoming stop waypoint
      if (route.waypoints && route.waypoints.length > 0) {
        let nextWaypoint = null;
        let minWpDist = Infinity;
        
        for (let i = 1; i < route.waypoints.length; i++) {
          const wp = route.waypoints[i];
          const dist = getDistanceKm(truck.lat, truck.lng, wp.lat, wp.lng);
          if (dist > 0.05 && dist < minWpDist) {
            minWpDist = dist;
            nextWaypoint = wp;
          }
        }

        if (nextWaypoint) {
          truck.nextStopName = nextWaypoint.name;
          truck.distToNextKm = Number(minWpDist.toFixed(2));
          truck.etaToNextMins = Math.max(1, Math.round((minWpDist / (truck.speedKmH || 24)) * 60));
        }
      }

      // Check for traffic congestion proximity
      let isInCongestion = false;
      for (const z of this.trafficZones) {
        if (getDistanceKm(truck.lat, truck.lng, z.lat, z.lng) < (z.radiusKm || 0.6)) {
          isInCongestion = true;
          break;
        }
      }

      const baseSpeed = isInCongestion ? 12 : 28;
      truck.speedKmH = Math.round(baseSpeed + (Math.random() * 4 - 2));

      return truck;
    });
  }
}

export const trafficSimulator = new TrafficSimulator();
