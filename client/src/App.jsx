import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LiveMap from './components/LiveMap';
import WindowManager from './components/admin/WindowManager';
import VRPOptimizerView from './components/admin/VRPOptimizerView';
import WasteAnalytics from './components/admin/WasteAnalytics';
import AdminDashboard from './components/admin/AdminDashboard';
import DriverCockpit from './components/driver/DriverCockpit';
import CitizenPortal from './components/citizen/CitizenPortal';
import TruckRadar from './components/citizen/TruckRadar';
import AuthModal from './components/auth/AuthModal';
import NotificationCenter from './components/NotificationCenter';
import { api } from './services/api';
import { translations } from './services/i18n';
import { Shield, Truck, User, Hotel, Layers, BarChart3, Clock, Cpu, FileDown, Sparkles, Navigation, AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState('vi');
  const [currentRole, setCurrentRole] = useState('ADMIN'); // ADMIN, DRIVER, RESIDENT, COMMERCIAL
  const [activeAdminTab, setActiveAdminTab] = useState('OVERVIEW'); // OVERVIEW, WINDOW, VRP, ANALYTICS

  // Auth User state (US1-US4) - Da Nang City
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_admin',
    username: 'admin',
    role: 'ADMIN',
    name: 'Nguyễn Quản Trị (Dispatcher)',
    phone: '0901 000 001',
    district: 'Quận Hải Châu',
    address: 'Trụ sở Điều hành EcoRoute Opti, Q. Hải Châu, Đà Nẵng',
    lat: 16.0544,
    lng: 108.2022
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('LOGIN');

  // Real-time backend data
  const [fleet, setFleet] = useState([]);
  const [depot, setDepot] = useState(null);
  const [trafficZones, setTrafficZones] = useState([]);
  const [registeredPoints, setRegisteredPoints] = useState([]);
  const [windowStatus, setWindowStatus] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedTruckId, setSelectedTruckId] = useState('TRUCK-01');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Simulation controls state
  const [simState, setSimState] = useState({
    isPaused: false,
    speed: 1
  });

  const t = translations[currentLang] || translations.vi;

  // Initial Load
  const fetchAllData = useCallback(async () => {
    try {
      const [windowRes, fleetRes, reqsRes, planRes, analyticsRes] = await Promise.all([
        api.getWindow(),
        api.getFleet(),
        api.getRequests(),
        api.getCurrentPlan(),
        api.getWasteSummary()
      ]);

      if (windowRes.success) {
        setWindowStatus(windowRes.window);
        setDepot(windowRes.depot);
      }
      if (fleetRes.success) {
        setFleet(fleetRes.trucks);
        setTrafficZones(fleetRes.trafficZones || []);
      }
      if (reqsRes.success) {
        setRegisteredPoints(reqsRes.requests);
      }
      if (planRes.success) {
        setOptimizationResult(planRes.data);
      }
      if (analyticsRes.success) {
        setAnalyticsData(analyticsRes);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Realtime Polling for Live Truck GPS movement
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fleetRes = await api.getFleet();
        if (fleetRes.success) {
          setFleet(fleetRes.trucks);
          setTrafficZones(fleetRes.trafficZones || []);
        }
      } catch (err) {
        // silent catch
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Handle Role Change
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    // Switch default user mock
    if (newRole === 'ADMIN') {
      setCurrentUser({
        id: 'usr_admin',
        username: 'admin',
        role: 'ADMIN',
        name: 'Nguyễn Quản Trị (Dispatcher)',
        phone: '0901 000 001',
        district: 'Quận Hải Châu',
        address: 'Trung tâm Điều phối EcoRoute Opti Đà Nẵng'
      });
    } else if (newRole === 'DRIVER') {
      setCurrentUser({
        id: 'usr_driver_1',
        username: 'driver1',
        role: 'DRIVER',
        name: 'Nguyễn Văn Hùng',
        phone: '0908 111 222',
        assignedTruckId: 'TRUCK-01',
        district: 'Quận Hải Châu'
      });
      setSelectedTruckId('TRUCK-01');
    } else if (newRole === 'RESIDENT') {
      setCurrentUser({
        id: 'usr_resident_1',
        username: 'resident',
        role: 'RESIDENT',
        name: 'Lê Văn Phước (Hộ Dân Cư)',
        phone: '0934 567 890',
        address: '88 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng',
        district: 'Quận Hải Châu',
        lat: 16.0602,
        lng: 108.2165
      });
    } else if (newRole === 'COMMERCIAL') {
      setCurrentUser({
        id: 'usr_hotel_1',
        username: 'hotel_novotel',
        role: 'COMMERCIAL',
        name: 'Khách sạn Novotel Danang Premier',
        phone: '0901 234 567',
        address: '36 Bạch Đằng, P. Thạch Thang, Q. Hải Châu, Đà Nẵng',
        district: 'Quận Hải Châu',
        lat: 16.0772,
        lng: 108.2241
      });
    }
  };

  // Actions
  const handleToggleSim = async () => {
    const nextPaused = !simState.isPaused;
    setSimState((prev) => ({ ...prev, isPaused: nextPaused }));
    await api.controlSimulation({ action: nextPaused ? 'PAUSE' : 'RESUME' });
  };

  const handleSetSimSpeed = async (spd) => {
    setSimState((prev) => ({ ...prev, speed: spd }));
    await api.controlSimulation({ speed: spd });
  };

  const handleInjectTraffic = async () => {
    const newIncident = {
      name: `Ùn tắc phát sinh: Đường Bạch Đằng (${new Date().toLocaleTimeString('vi-VN')})`,
      lat: 16.0700 + (Math.random() * 0.005 - 0.0025),
      lng: 108.2235 + (Math.random() * 0.005 - 0.0025),
      severity: 'HEAVY',
      delayMins: 20
    };
    const res = await api.controlSimulation({ newIncident });
    if (res.success) {
      setTrafficZones(res.trafficZones);
    }
  };

  const handleUpdateWindow = async (data) => {
    const res = await api.updateWindow(data);
    if (res.success) {
      setWindowStatus(res.window);
    }
    return res;
  };

  const handleSubmitDisposalRequest = async (data) => {
    const res = await api.submitRequest(data);
    const reqs = await api.getRequests();
    if (reqs.success) setRegisteredPoints(reqs.requests);
    return res;
  };

  const handleUpdateStopStatus = async (stopId, status) => {
    await api.updateStopStatus(stopId, status);
    const reqs = await api.getRequests();
    if (reqs.success) setRegisteredPoints(reqs.requests);
  };

  const handleUpdateTruckValidity = async (truckId, data) => {
    const res = await api.updateTruckValidity(truckId, data);
    const fleetRes = await api.getFleet();
    if (fleetRes.success) setFleet(fleetRes.trucks);
    return res;
  };

  const handleRunOptimization = async (options) => {
    setIsOptimizing(true);
    try {
      const res = await api.optimizeVRP(options);
      if (res.success) {
        setOptimizationResult(res.data);
      }
      return res;
    } finally {
      setIsOptimizing(false);
    }
  };

  const activeDriverTruck = fleet.find((t) => t.id === (currentUser?.assignedTruckId || selectedTruckId)) || fleet[0];
  const activeDriverRoute = optimizationResult?.routes?.find((r) => r.truckId === activeDriverTruck?.id) || optimizationResult?.routes?.[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-eco-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        simState={simState}
        onToggleSim={handleToggleSim}
        onSetSimSpeed={handleSetSimSpeed}
        onInjectTraffic={handleInjectTraffic}
        windowStatus={windowStatus}
      />

      {/* Role Context Bar & User Profile Quick Action */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Đang hoạt động với vai trò:</span>
            <span className="font-extrabold text-eco-400 px-2 py-0.5 rounded-lg bg-eco-500/10 border border-eco-500/20">
              {currentRole === 'ADMIN' ? '🛡️ Quản trị viên (Admin)' : currentRole === 'DRIVER' ? '🚛 Tài xế thu gom (Driver)' : currentRole === 'COMMERCIAL' ? '🏨 Khu dịch vụ / Khách sạn' : '🏠 Hộ dân cư (Citizen)'}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 font-medium hidden sm:inline">{currentUser?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthModalMode('PROFILE');
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            >
              <User size={13} />
              <span>Hồ sơ cá nhân (US4)</span>
            </button>

            <button
              onClick={() => {
                setAuthModalMode('LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              Đổi tài khoản (US1/2)
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Real-Time Interactive Map (US9 Tracking) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                US9
              </span>
              <h2 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Navigation size={15} className="text-sky-400" />
                {t.us.us9}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {fleet.length} xe GPS trực tuyến • {registeredPoints.length} điểm thu gom
            </span>
          </div>

          <LiveMap
            trucks={fleet}
            points={registeredPoints}
            depot={depot}
            routes={optimizationResult?.routes || []}
            trafficZones={trafficZones}
            selectedTruckId={selectedTruckId}
            highlightCitizenPos={currentRole === 'RESIDENT' || currentRole === 'COMMERCIAL' ? currentUser : null}
            height="460px"
          />
        </section>

        {/* ADMIN VIEW */}
        {currentRole === 'ADMIN' && (
          <section className="space-y-6">
            {/* Admin Subtabs navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
              {[
                { id: 'OVERVIEW', label: 'Tổng Quan & Phân Quyền (US3)', icon: Shield },
                { id: 'WINDOW', label: 'Mở Cổng Đăng Ký (US5)', icon: Clock },
                { id: 'VRP', label: 'Tối Ưu Tuyến Đường VRP (US11/12)', icon: Cpu },
                { id: 'ANALYTICS', label: 'Thống Kê & Dự Báo Đội Xe (US10)', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeAdminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAdminTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-eco-500 text-slate-950 shadow-md shadow-eco-500/20'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeAdminTab === 'OVERVIEW' && (
              <AdminDashboard
                currentUser={currentUser}
                currentLang={currentLang}
                fleet={fleet}
                registeredPoints={registeredPoints}
                onOpenWindowManager={() => setActiveAdminTab('WINDOW')}
                onOpenVRPOptimizer={() => setActiveAdminTab('VRP')}
                onOpenAnalytics={() => setActiveAdminTab('ANALYTICS')}
              />
            )}

            {activeAdminTab === 'WINDOW' && (
              <WindowManager
                windowData={windowStatus}
                onUpdateWindow={handleUpdateWindow}
                currentLang={currentLang}
              />
            )}

            {activeAdminTab === 'VRP' && (
              <VRPOptimizerView
                onRunOptimization={handleRunOptimization}
                optimizationResult={optimizationResult}
                isLoading={isOptimizing}
                currentLang={currentLang}
                onSelectTruck={setSelectedTruckId}
              />
            )}

            {activeAdminTab === 'ANALYTICS' && (
              <WasteAnalytics
                analyticsData={analyticsData}
                currentLang={currentLang}
              />
            )}
          </section>
        )}

        {/* DRIVER VIEW (US7, US9, US13) */}
        {currentRole === 'DRIVER' && (
          <section className="space-y-6">
            <DriverCockpit
              currentTruck={activeDriverTruck}
              activeRoute={activeDriverRoute}
              depot={depot}
              onUpdateStopStatus={handleUpdateStopStatus}
              onUpdateTruckValidity={handleUpdateTruckValidity}
              currentLang={currentLang}
            />
          </section>
        )}

        {/* CITIZEN & COMMERCIAL VIEW (US6, US8) */}
        {(currentRole === 'RESIDENT' || currentRole === 'COMMERCIAL') && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <CitizenPortal
                currentUser={currentUser}
                windowStatus={windowStatus}
                existingRequest={registeredPoints.find((p) => p.contactPhone === currentUser?.phone)}
                onSubmitRequest={handleSubmitDisposalRequest}
                currentLang={currentLang}
                onRequestUpdated={fetchAllData}
              />
            </div>

            <div className="lg:col-span-5">
              <TruckRadar
                currentUser={currentUser}
                currentLang={currentLang}
              />
            </div>
          </section>
        )}

      </main>

      {/* Floating Real-Time Notification Center */}
      <NotificationCenter
        windowStatus={windowStatus}
        delayedTrucks={fleet.filter((t) => t.isDelayed)}
        currentRole={currentRole}
      />

      {/* Auth Modal (US1, US2, US4) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authModalMode}
        currentUser={currentUser}
        onClose={() => setIsAuthModalOpen(false)}
        onUserAuthenticated={(u) => {
          setCurrentUser(u);
          setCurrentRole(u.role);
        }}
        currentLang={currentLang}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌿 EcoRoute Opti Platform • Thuật toán VRP & Định tuyến thu gom rác thông minh</span>
          <span className="font-mono text-slate-600">Fullstack Node.js + Express + React + Leaflet</span>
        </div>
      </footer>

    </div>
  );
}
