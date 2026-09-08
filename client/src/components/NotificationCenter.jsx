import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Sparkles, CheckCircle2, Clock, X, Navigation } from 'lucide-react';

export default function NotificationCenter({
  windowStatus,
  delayedTrucks = [],
  radarData = null,
  currentRole
}) {
  const [dismissed, setDismissed] = useState({});

  const notifications = [];

  // 1. Window Opening Broadcast (US5)
  if (windowStatus?.announcement && !dismissed['window_announcement']) {
    notifications.push({
      id: 'window_announcement',
      type: 'INFO',
      title: 'Thông Báo Khung Giờ Đăng Ký (US5)',
      message: windowStatus.announcement,
      icon: Sparkles,
      color: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
    });
  }

  // 2. Driver Traffic Delays (US7)
  delayedTrucks.forEach((truck) => {
    if (truck.isDelayed && !dismissed[`delay_${truck.id}`]) {
      notifications.push({
        id: `delay_${truck.id}`,
        type: 'DELAY',
        title: `Cảnh Báo Lộ Trình: Xe ${truck.licensePlate} Dời Giờ Thu Gom (US7)`,
        message: `${truck.delayReason || 'Ùn tắc giao thông'} -> Lịch thu gom mới: ${truck.currentEta || '18:00'}`,
        icon: AlertTriangle,
        color: 'bg-amber-500/15 border-amber-500/30 text-amber-400'
      });
    }
  });

  // 3. Proximity Radar Alert for Resident (US8)
  if ((currentRole === 'RESIDENT' || currentRole === 'COMMERCIAL') && radarData?.isApproaching && !dismissed['radar_alert']) {
    notifications.push({
      id: 'radar_alert',
      type: 'PROXIMITY',
      title: 'Xe Thu Gom Đang Đến Gần Bạn (US8)',
      message: radarData.alertMessage,
      icon: Navigation,
      color: 'bg-eco-500/20 border-eco-500/40 text-eco-400'
    });
  }

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-none">
      {notifications.map((n) => {
        const Icon = n.icon;
        return (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all animate-in slide-in-from-bottom-5 duration-300 ${n.color}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Icon size={18} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-100">{n.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>

              <button
                onClick={() => setDismissed((prev) => ({ ...prev, [n.id]: true }))}
                className="p-1 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
