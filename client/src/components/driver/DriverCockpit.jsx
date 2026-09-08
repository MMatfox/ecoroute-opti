import React, { useState } from 'react';
import { Truck, Navigation, AlertTriangle, CheckCircle, Clock, MapPin, CheckCircle2, XCircle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import RouteManifestPDF from './RouteManifestPDF';
import { translations } from '../../services/i18n';

export default function DriverCockpit({
  currentTruck,
  activeRoute,
  depot,
  onUpdateStopStatus,
  onUpdateTruckValidity,
  currentLang
}) {
  const t = translations[currentLang] || translations.vi;

  const [isDelayed, setIsDelayed] = useState(currentTruck?.isDelayed || false);
  const [delayReason, setDelayReason] = useState(
    currentTruck?.delayReason || 'Đường đông ùn tắc - Xin dời giờ thu gom từ 17h qua 18h'
  );
  const [newEta, setNewEta] = useState(currentTruck?.currentEta || '18:00');
  const [isSavingValidity, setIsSavingValidity] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');

  const waypoints = activeRoute?.waypoints || [];

  const handleUpdateValidity = async (e) => {
    e.preventDefault();
    if (!currentTruck) return;
    setIsSavingValidity(true);
    setStatusFeedback('');

    try {
      await onUpdateTruckValidity(currentTruck.id, {
        isDelayed,
        delayReason: isDelayed ? delayReason : '',
        newEta: isDelayed ? newEta : currentTruck.originalEta,
        status: isDelayed ? 'DELAYED' : 'ACTIVE'
      });
      setStatusFeedback('Đã cập nhật hiệu lực tuyến đường và gửi thông báo dời giờ đến người dân!');
      setTimeout(() => setStatusFeedback(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingValidity(false);
    }
  };

  const handleToggleStop = async (stopId, newStatus) => {
    if (onUpdateStopStatus) {
      await onUpdateStopStatus(stopId, newStatus);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Truck & Route status */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                US7 / US9
              </span>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <Truck className="text-sky-400" size={20} />
                Buồng Lái Tài Xế & Quản Lý Tuyến Đường Thu Gom
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Xe <b>{currentTruck?.licensePlate || '51C-882.19'}</b> ({currentTruck?.driverName || 'Nguyễn Văn Hùng'}) • Tải trọng: {currentTruck?.currentLoadKg || 515} / {currentTruck?.capacityKg || 2500} kg
            </p>
          </div>

          {/* Action: Export PDF Button (US13) */}
          <div className="flex items-center gap-3">
            <RouteManifestPDF routeData={activeRoute} depot={depot} currentLang={currentLang} />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400">Vận tốc hiện tại</div>
            <div className="text-lg font-black text-slate-100 font-mono">
              {currentTruck?.speedKmH || 28} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400">Độ lấp đầy thùng xe</div>
            <div className="text-lg font-black text-eco-400 font-mono">
              {Math.round(((currentTruck?.currentLoadKg || 500) / (currentTruck?.capacityKg || 2500)) * 100)}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400">Điểm dừng kế tiếp</div>
            <div className="text-xs font-bold text-sky-400 truncate mt-1">
              {currentTruck?.nextStopName || 'Chung cư 42 Nguyễn Huệ'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400">Ước tính đến điểm kế</div>
            <div className="text-lg font-black text-amber-400 font-mono">
              ~{currentTruck?.etaToNextMins || 4} <span className="text-xs font-normal text-slate-400">phút</span>
            </div>
          </div>
        </div>
      </div>

      {/* US7: Route Validity & Delay Management Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            US7
          </span>
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={16} />
            {t.us.us7}
          </h4>
        </div>
        <p className="text-xs text-slate-400">
          Tài xế có thể đánh dấu tuyến đường còn hiệu lực hay hết hiệu lực, hoặc thông báo dời giờ do ùn tắc để đẩy thông báo đến toàn bộ người dân trên tuyến.
        </p>

        <form onSubmit={handleUpdateValidity} className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="font-semibold text-xs text-slate-200">Báo cáo tuyến đường bị chậm trễ / Hết hiệu lực</div>
              <div className="text-[11px] text-slate-400">Kích hoạt nếu gặp kẹt xe nghiêm trọng cần dời lịch thu gom</div>
            </div>
            <button
              type="button"
              onClick={() => setIsDelayed(!isDelayed)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                isDelayed ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDelayed ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isDelayed && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Lý do dời tuyến / Bất khả kháng
                </label>
                <input
                  type="text"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder="VD: Tuyến đường đông, kẹt xe cục bộ"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Giờ dời thu gom dự kiến mới (New ETA)
                </label>
                <input
                  type="time"
                  value={newEta}
                  onChange={(e) => setNewEta(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>
            </div>
          )}

          {statusFeedback && (
            <div className="p-3 rounded-xl bg-eco-500/15 border border-eco-500/30 text-eco-400 text-xs flex items-center gap-2">
              <CheckCircle size={16} />
              {statusFeedback}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingValidity}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <AlertTriangle size={14} />
              {isSavingValidity ? 'Đang cập nhật...' : 'Cập Nhật Hiệu Lực Tuyến'}
            </button>
          </div>
        </form>
      </div>

      {/* Stop Checkpoints List (Emargement & Progress) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <FileText className="text-teal-400" size={16} />
            Danh Sách Điểm Thu Gom & Émargement Điện Tử ({waypoints.length} chặng)
          </h4>
          <span className="text-xs text-slate-400 font-mono">Tuyến: {activeRoute?.routeId || 'ALPHA'}</span>
        </div>

        <div className="space-y-2.5">
          {waypoints.map((wp, idx) => {
            const isDepot = wp.type === 'DEPOT_START' || wp.type === 'DEPOT_END';
            const isCollected = wp.status === 'COLLECTED';

            return (
              <div
                key={wp.id + idx}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                  isCollected
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                    isDepot
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : isCollected
                      ? 'bg-eco-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isDepot ? '🏢' : idx}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">{wp.name}</span>
                      <span className="text-[11px] font-mono text-eco-400">({wp.arrivalEta})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{wp.address}</div>
                    {wp.wasteAmountKg && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Khối lượng: <b className="text-slate-300 font-mono">{wp.wasteAmountKg} kg</b> • Tải lũy kế: <b className="text-slate-300 font-mono">{wp.currentTruckLoadKg} kg</b>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!isDepot && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStop(wp.id, isCollected ? 'CONFIRMED' : 'COLLECTED')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isCollected
                          ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30'
                          : 'bg-eco-500 text-slate-950 hover:bg-eco-400'
                      }`}
                    >
                      <CheckCircle2 size={13} />
                      {isCollected ? 'Đã thu gom' : 'Xác nhận thu'}
                    </button>
                    <button
                      onClick={() => handleToggleStop(wp.id, 'SKIPPED')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                      title="Bỏ qua điểm này"
                    >
                      <XCircle size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
