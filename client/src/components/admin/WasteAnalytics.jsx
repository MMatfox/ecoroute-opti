import React from 'react';
import { BarChart3, TrendingUp, Truck, Sparkles, Building2, Calendar, Scale } from 'lucide-react';
import { translations } from '../../services/i18n';

export default function WasteAnalytics({ analyticsData, currentLang }) {
  const t = translations[currentLang] || translations.vi;

  const summary = analyticsData?.summary || {
    totalTodayKg: 1395,
    totalPredictedTomorrowKg: 19800,
    totalRecommendedFleet: 7,
    avgCollectionEfficiencyPct: 96.4
  };

  const districtStats = analyticsData?.districtStats || [];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              US10
            </span>
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <BarChart3 className="text-amber-400" size={20} />
              {t.us.us10}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tổng hợp dữ liệu rác thải các khu phố/phường hàng ngày và AI dự đoán quy mô điều động xe thu gom ngày mai.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
          <Sparkles size={14} />
          <span>AI Predictive Model v2.4</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Scale size={14} className="text-eco-400" />
            Lượng rác hôm nay đã tiếp nhận
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {summary.totalTodayKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-eco-400 font-medium">8 điểm thu gom đang mở</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-amber-400" />
            AI Dự báo tổng lượng rác ngày mai
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {summary.totalPredictedTomorrowKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-slate-400">Tăng ~+5.2% so với trung bình tuần</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Truck size={14} className="text-sky-400" />
            Đề xuất điều động xe ngày mai
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            {summary.totalRecommendedFleet} <span className="text-xs font-normal text-slate-400">xe thu gom</span>
          </div>
          <div className="text-[11px] text-sky-400 font-medium">Đảm bảo &gt;95% hiệu suất tải trọng</div>
        </div>
      </div>

      {/* District breakdown table */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
          Phân bổ rác thải & Dự đoán theo Phường / Quận
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Khu vực / Quận</th>
                <th className="py-2.5 px-3">Hôm nay (Đã nhận)</th>
                <th className="py-2.5 px-3">Trung bình ngày</th>
                <th className="py-2.5 px-3">AI Dự báo ngày mai</th>
                <th className="py-2.5 px-3">Xu hướng</th>
                <th className="py-2.5 px-3 text-right">Đề xuất xe điều động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {districtStats.map((d) => (
                <tr key={d.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-3 font-sans font-semibold text-slate-200 flex items-center gap-2">
                    <Building2 size={14} className="text-slate-500" />
                    {d.name}
                  </td>
                  <td className="py-3 px-3 text-eco-400 font-bold">
                    {d.todayRegisteredKg} kg
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {d.dailyAvgKg.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-3 text-amber-300 font-bold">
                    {d.predictedTomorrowKg.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.trendPercentage >= 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-eco-500/10 text-eco-400'
                    }`}>
                      {d.trendPercentage >= 0 ? `+${d.trendPercentage}%` : `${d.trendPercentage}%`}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                      🚛 {d.recommendedTrucks} xe
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
