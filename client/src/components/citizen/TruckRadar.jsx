import React, { useState, useEffect } from 'react';
import { Radar, Navigation, Bell, Clock, MapPin, Truck, AlertTriangle, ShieldCheck } from 'lucide-react';
import { translations } from '../../services/i18n';
import { api } from '../../services/api';

export default function TruckRadar({ currentUser, currentLang }) {
  const t = translations[currentLang] || translations.vi;

  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Poll truck distance for citizen location every 3 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchRadar = async () => {
      try {
        const lat = currentUser?.lat || 10.772980;
        const lng = currentUser?.lng || 106.699150;
        const res = await api.trackForCitizen(lat, lng, currentUser?.id);
        if (isMounted && res.success) {
          setRadarData(res);
        }
      } catch (err) {
        console.error('Radar tracking error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRadar();
    const interval = setInterval(fetchRadar, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser]);

  const truck = radarData?.truck;
  const isApproaching = radarData?.isApproaching;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 relative overflow-hidden">
      
      {/* Ambient background glow if approaching */}
      {isApproaching && (
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-eco-500/10 blur-3xl pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
              US8
            </span>
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <Radar className="text-sky-400" size={20} />
              {t.us.us8}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi hành trình xe thu gom rác đang tiến lại gần khu vực của bạn theo thời gian thực.
          </p>
        </div>

        {/* Live scanning pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-sky-400">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          <span>RADAR LIVE SCAN</span>
        </div>
      </div>

      {/* Alert Banner when Truck is within Proximity */}
      {isApproaching ? (
        <div className="p-4 rounded-xl bg-gradient-to-r from-eco-500/20 via-teal-500/20 to-sky-500/20 border border-eco-500/40 text-slate-100 flex items-start gap-3 shadow-lg shadow-eco-500/10 animate-bounce-subtle">
          <div className="w-9 h-9 rounded-xl bg-eco-500 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md">
            <Bell size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-eco-400 flex items-center gap-2">
              <span>🔔 THÔNG BÁO: XE THU GOM ĐANG ĐẾN GẦN!</span>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              {radarData?.alertMessage}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
          <Clock size={16} className="text-slate-400 shrink-0" />
          <span>{radarData?.alertMessage || 'Đang xác định vị trí xe gần nhất...'}</span>
        </div>
      )}

      {/* Radar UI + Live Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Visual Animated Radar Dish */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-48 h-48 rounded-full border-2 border-slate-800 bg-slate-950/90 flex items-center justify-center overflow-hidden shadow-inner">
            
            {/* Concentric rings */}
            <div className="absolute w-36 h-36 rounded-full border border-slate-800/80"></div>
            <div className="absolute w-24 h-24 rounded-full border border-slate-800/60"></div>
            <div className="absolute w-12 h-12 rounded-full border border-slate-800/40"></div>
            <div className="absolute w-full h-[1px] bg-slate-800/50"></div>
            <div className="absolute h-full w-[1px] bg-slate-800/50"></div>

            {/* Rotating radar sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-sky-500/15 to-transparent rounded-full animate-spin-slow origin-center"></div>

            {/* User Center Pin */}
            <div className="relative z-10 w-6 h-6 rounded-full bg-eco-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-eco-500/50 border border-white">
              🏠
            </div>

            {/* Truck blip on radar */}
            {truck && (
              <div
                className="absolute z-20 w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center text-xs shadow-lg shadow-sky-500/50 border border-white transition-all duration-1000"
                style={{
                  top: `${Math.max(15, Math.min(80, 50 - (radarData?.distanceMeters || 600) / 30))}%`,
                  right: `${Math.max(15, Math.min(80, 50 + (radarData?.distanceMeters || 600) / 40))}%`
                }}
                title={`Xe ${truck.licensePlate}`}
              >
                🚛
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-3 font-mono">Bán kính quét: 1,500m</div>
        </div>

        {/* Telemetry Metrics */}
        <div className="md:col-span-7 space-y-3">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Navigation size={13} className="text-sky-400" />
                Khoảng cách đến bạn
              </div>
              <div className="text-2xl font-black text-slate-100 font-mono">
                {radarData?.distanceMeters || '--'} <span className="text-xs font-normal text-slate-400">mét</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">({radarData?.distanceKm || 0} km)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Clock size={13} className="text-eco-400" />
                Thời gian dự kiến (ETA)
              </div>
              <div className="text-2xl font-black text-eco-400 font-mono">
                ~{radarData?.etaMinutes || '--'} <span className="text-xs font-normal text-slate-400">phút</span>
              </div>
              <div className="text-[10px] text-eco-500">Chuẩn bị trước 5 phút</div>
            </div>
          </div>

          {/* Truck & Driver Info */}
          {truck && (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                    <Truck size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-200">{truck.licensePlate} ({truck.model})</div>
                    <div className="text-[11px] text-slate-400">Tài xế: {truck.driverName}</div>
                  </div>
                </div>

                <a
                  href={`tel:${truck.driverPhone}`}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  📞 {truck.driverPhone}
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                <span>Vận tốc di chuyển: <b>{truck.speedKmH} km/h</b></span>
                <span>Tải trọng thùng: <b>{Math.round((truck.currentLoadKg / truck.capacityKg) * 100)}%</b></span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
