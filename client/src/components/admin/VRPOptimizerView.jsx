import React, { useState } from 'react';
import { Cpu, Zap, Route, Check, TrendingDown, Clock, ShieldAlert, Sparkles, Navigation, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../../services/i18n';

export default function VRPOptimizerView({
  onRunOptimization,
  optimizationResult,
  isLoading,
  currentLang,
  onSelectTruck
}) {
  const t = translations[currentLang] || translations.vi;
  const [trafficFactor, setTrafficFactor] = useState(1.2);
  const [avgSpeed, setAvgSpeed] = useState(26);

  const handleOptimize = async () => {
    try {
      const res = await onRunOptimization({
        trafficFactor: parseFloat(trafficFactor),
        avgSpeedKmH: parseInt(avgSpeed, 10)
      });
      // Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#3b82f6']
      });
    } catch (err) {
      console.error(err);
    }
  };

  const summary = optimizationResult?.summary;
  const routes = optimizationResult?.routes || [];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header & Epic info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-eco-500/20 text-eco-400 border border-eco-500/30">
              US11 / US12
            </span>
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <Cpu className="text-eco-400" size={20} />
              {t.us.us11_12}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Thuật toán VRP (Clarke-Wright Savings + 2-Opt) tối ưu hóa hàm mục tiêu <b>Min (Σ Khoảng cách + Σ Thời gian)</b> kết hợp dữ liệu giao thông thực tế.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOptimize}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-eco-500 via-teal-500 to-sky-500 hover:from-eco-400 hover:to-sky-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-eco-500/20 active:scale-95 transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>AI Đang Tính Toán VRP...</span>
            </>
          ) : (
            <>
              <Zap size={16} className="fill-slate-950" />
              <span>Chạy Tối Ưu Lộ Trình VRP</span>
            </>
          )}
        </button>
      </div>

      {/* Control Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>Hệ số điều chỉnh mật độ giao thông (Traffic Multiplier)</span>
            <span className="text-amber-400 font-mono font-bold">{trafficFactor}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="1.8"
            step="0.05"
            value={trafficFactor}
            onChange={(e) => setTrafficFactor(e.target.value)}
            className="w-full accent-eco-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>1.0x (Thông thoáng)</span>
            <span>1.4x (Giờ cao điểm)</span>
            <span>1.8x (Ùn tắc nghiêm trọng)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>Vận tốc di chuyển trung bình trong đô thị</span>
            <span className="text-sky-400 font-mono font-bold">{avgSpeed} km/h</span>
          </div>
          <input
            type="range"
            min="15"
            max="45"
            step="1"
            value={avgSpeed}
            onChange={(e) => setAvgSpeed(e.target.value)}
            className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>15 km/h (Kẹt xe trung tâm)</span>
            <span>30 km/h (Bình thường)</span>
            <span>45 km/h (Ngoại ô/Đêm)</span>
          </div>
        </div>
      </div>

      {/* Results KPIs */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-eco-500/10 text-eco-400 flex items-center justify-center font-bold">
              <Route size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Tổng cự ly tuyến</div>
              <div className="text-base font-extrabold text-slate-100 font-mono">
                {summary.totalDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Thời gian thu gom</div>
              <div className="text-base font-extrabold text-slate-100 font-mono">
                {summary.totalTimeMinutes} <span className="text-xs font-normal text-slate-400">phút</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <TrendingDown size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">CO₂ Giảm phát thải</div>
              <div className="text-base font-extrabold text-teal-400 font-mono">
                -{summary.co2SavedKg} <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Xe được điều phối</div>
              <div className="text-base font-extrabold text-indigo-400 font-mono">
                {summary.trucksUtilized} <span className="text-xs font-normal text-slate-400">xe</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimized Routes Details */}
      <div className="space-y-4">
        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center justify-between">
          <span>Danh sách kế hoạch chặng đường phân bổ cho tài xế</span>
          <span className="text-eco-400 text-xs font-mono">{routes.length} tuyến xe hoạt động</span>
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {routes.map((route, idx) => (
            <div
              key={route.routeId}
              onClick={() => onSelectTruck && onSelectTruck(route.truckId)}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-eco-500"></div>
                  <span className="font-extrabold text-sm text-slate-100">{route.truckPlate}</span>
                  <span className="text-xs text-slate-400">({route.driverName})</span>
                </div>
                <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {route.totalDistanceKm} km • {route.totalTimeMinutes}m
                </span>
              </div>

              {/* Payload progress bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Tải trọng gom</span>
                  <span className="font-mono text-slate-200">{route.totalLoadKg} / {route.truckCapacityKg} kg ({route.fillPercentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      route.fillPercentage > 90 ? 'bg-rose-500' : 'bg-eco-500'
                    }`}
                    style={{ width: `${Math.min(100, route.fillPercentage)}%` }}
                  ></div>
                </div>
              </div>

              {/* Waypoint Sequence Chips */}
              <div className="space-y-1 pt-1">
                <div className="text-[11px] text-slate-500">Trình tự điểm thu gom ({route.waypoints?.length - 2} điểm):</div>
                <div className="flex flex-wrap gap-1.5">
                  {route.waypoints?.slice(1, -1).map((wp, wIdx) => (
                    <span
                      key={wp.id + wIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1"
                    >
                      <span className="font-bold text-eco-400 font-mono">{wIdx + 1}.</span>
                      <span className="truncate max-w-[140px]">{wp.name}</span>
                      <span className="text-slate-500 font-mono">({wp.arrivalEta})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
