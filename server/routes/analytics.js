import express from 'express';
import { seedDistricts } from '../data/seedData.js';
import { getRegisteredPoints } from './registrations.js';

export const analyticsRouter = express.Router();

// District Waste Volume Analytics & AI Fleet Forecast (US10)
analyticsRouter.get('/waste-summary', (req, res) => {
  const points = getRegisteredPoints();

  // Aggregate by district
  const districtStats = seedDistricts.map(d => {
    const districtPoints = points.filter(p => p.districtId === d.id);
    const todayRegisteredKg = districtPoints.reduce((sum, p) => sum + (p.wasteAmountKg || 0), 0);
    
    // Predicted tomorrow waste = avg * seasonal factor + variation
    const seasonalFactor = 1.05;
    const predictedTomorrowKg = Math.round(d.dailyAvgKg * seasonalFactor + (Math.random() * 200 - 100));
    
    // Recommended trucks to dispatch tomorrow (each truck ~2.5 - 3.5 tons)
    const recommendedTrucks = Math.ceil(predictedTomorrowKg / 2800);

    return {
      ...d,
      todayRequestsCount: districtPoints.length,
      todayRegisteredKg,
      predictedTomorrowKg,
      recommendedTrucks,
      trendPercentage: Number(((predictedTomorrowKg - d.dailyAvgKg) / d.dailyAvgKg * 100).toFixed(1))
    };
  });

  const totalTodayKg = districtStats.reduce((sum, d) => sum + d.todayRegisteredKg, 0);
  const totalPredictedTomorrowKg = districtStats.reduce((sum, d) => sum + d.predictedTomorrowKg, 0);
  const totalRecommendedFleet = districtStats.reduce((sum, d) => sum + d.recommendedTrucks, 0);

  // 30-Day Historical Trend simulation
  const historical30Days = Array.from({ length: 14 }, (_, i) => {
    const day = 14 - i;
    const d = new Date();
    d.setDate(d.getDate() - day);
    const baseKg = 18500;
    const variation = Math.sin(day) * 1800 + (Math.random() * 600);
    return {
      date: d.toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' }),
      totalKg: Math.round(baseKg + variation),
      trucksDeployed: Math.round((baseKg + variation) / 3000),
      onTimeRatePct: Math.round(92 + (Math.random() * 6))
    };
  });

  res.json({
    success: true,
    summary: {
      totalTodayKg,
      totalPredictedTomorrowKg,
      totalRecommendedFleet,
      avgCollectionEfficiencyPct: 96.4
    },
    districtStats,
    historical30Days
  });
});
