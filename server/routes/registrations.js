import express from 'express';
import { seedPoints, seedRegistrationWindow, seedDepot } from '../data/seedData.js';

export const registrationsRouter = express.Router();

let registrationWindow = { ...seedRegistrationWindow };
let registeredPoints = [...seedPoints];

// Get current registration window status (US5)
registrationsRouter.get('/window', (req, res) => {
  res.json({
    success: true,
    window: registrationWindow,
    depot: seedDepot,
    totalPointsCount: registeredPoints.length,
    totalWasteKg: registeredPoints.reduce((sum, p) => sum + (p.wasteAmountKg || 0), 0)
  });
});

// Admin updates registration window (US5: Open/Close, Set Hours, Broadcast)
registrationsRouter.post('/window/update', (req, res) => {
  const { isOpen, openTime, closeTime, announcement } = req.body;
  if (isOpen !== undefined) registrationWindow.isOpen = Boolean(isOpen);
  if (openTime) registrationWindow.openTime = openTime;
  if (closeTime) registrationWindow.closeTime = closeTime;
  if (announcement) registrationWindow.announcement = announcement;

  res.json({
    success: true,
    message: 'Cập nhật khung giờ đăng ký thành công!',
    window: registrationWindow
  });
});

// Get all registered disposal requests (US6, US10)
registrationsRouter.get('/requests', (req, res) => {
  res.json({
    success: true,
    requests: registeredPoints
  });
});

// Citizen updates / registers disposal request (US6)
registrationsRouter.post('/requests', (req, res) => {
  const {
    id,
    name,
    type,
    category,
    address,
    lat,
    lng,
    districtId,
    wasteAmountKg,
    wasteType,
    preferredTime,
    willDispose,
    contactPhone,
    notes
  } = req.body;

  if (willDispose === false) {
    // Citizen opts OUT of today's collection
    if (id) {
      registeredPoints = registeredPoints.filter(p => p.id !== id);
    }
    return res.json({
      success: true,
      message: 'Đã cập nhật: Bạn chọn KHÔNG đổ rác trong ngày hôm nay.',
      points: registeredPoints
    });
  }

  // Check if updating existing or adding new
  const existingIdx = id ? registeredPoints.findIndex(p => p.id === id) : -1;
  const newPoint = {
    id: id || `req_${Date.now()}`,
    name: name || 'Hộ Dân Cư Mới',
    type: type || 'RESIDENTIAL',
    category: category || 'HOUSE',
    address: address || 'Khu dân cư Quận 1',
    lat: lat || 10.7750 + (Math.random() * 0.01 - 0.005),
    lng: lng || 106.7000 + (Math.random() * 0.01 - 0.005),
    districtId: districtId || 'd1',
    wasteAmountKg: Number(wasteAmountKg) || 30,
    wasteType: wasteType || 'GENERAL',
    preferredTime: preferredTime || '10:00',
    status: 'CONFIRMED',
    timeWindow: {
      start: preferredTime || '09:30',
      end: '12:30'
    },
    contactPhone: contactPhone || '0900 000 000',
    notes: notes || 'Đăng ký mới qua ứng dụng EcoRoute Opti'
  };

  if (existingIdx !== -1) {
    registeredPoints[existingIdx] = { ...registeredPoints[existingIdx], ...newPoint };
  } else {
    registeredPoints.push(newPoint);
  }

  res.json({
    success: true,
    message: 'Đăng ký đổ rác thành công! Vị trí đã được thêm vào luồng tính toán VRP của AI.',
    point: newPoint,
    totalPoints: registeredPoints.length
  });
});

// Update stop status (e.g., Driver marks COLLECTED or SKIPPED)
registrationsRouter.patch('/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const point = registeredPoints.find(p => p.id === id);
  if (point) {
    point.status = status;
    return res.json({ success: true, point });
  }
  res.status(404).json({ error: 'Request not found' });
});

export function getRegisteredPoints() {
  return registeredPoints;
}
