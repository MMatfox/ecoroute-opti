import React, { useState } from 'react';
import { Clock, Send, CheckCircle2, XCircle, BellRing, Sparkles } from 'lucide-react';
import { translations } from '../../services/i18n';

export default function WindowManager({ windowData, onUpdateWindow, currentLang }) {
  const t = translations[currentLang] || translations.vi;
  const [isOpen, setIsOpen] = useState(windowData?.isOpen ?? true);
  const [openTime, setOpenTime] = useState(windowData?.openTime || '09:00');
  const [closeTime, setCloseTime] = useState(windowData?.closeTime || '14:00');
  const [announcement, setAnnouncement] = useState(
    windowData?.announcement || 'Thông báo: 9h mở cổng đăng ký đổ rác và 14h đóng cổng tiếp nhận.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await onUpdateWindow({
        isOpen,
        openTime,
        closeTime,
        announcement
      });
      setSuccessMsg('Đã phát thông báo mở/đóng cổng đăng ký thành công đến toàn thành phố!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              US5
            </span>
            <h3 className="font-bold text-lg text-slate-100">
              {t.us.us5}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quản trị viên thiết lập khung giờ và đẩy thông báo đăng ký đổ rác cho người dân & khu dịch vụ
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
          isOpen
            ? 'bg-eco-500/10 text-eco-400 border-eco-500/30'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-eco-400 animate-pulse' : 'bg-rose-500'}`}></span>
          {isOpen ? 'CỔNG ĐĂNG KÝ ĐANG MỞ' : 'CỔNG ĐĂNG KÝ ĐÃ ĐÓNG'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <div className="font-semibold text-sm text-slate-200">Trạng thái Cổng Đăng Ký</div>
            <div className="text-xs text-slate-400">Cho phép hộ dân và doanh nghiệp gửi yêu cầu thu gom</div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
              isOpen ? 'bg-eco-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOpen ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Time Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Clock size={13} className="text-eco-400" />
              Giờ mở cổng tiếp nhận
            </label>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-eco-500 font-mono"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Clock size={13} className="text-rose-400" />
              Giờ đóng cổng chốt số liệu VRP
            </label>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-eco-500 font-mono"
            />
          </div>
        </div>

        {/* Broadcast Message */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
            <BellRing size={13} className="text-amber-400" />
            Nội dung thông báo phát thanh (Broadcast Notification)
          </label>
          <textarea
            rows={2}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500 resize-none"
            placeholder="Nhập thông báo gửi đến app người dân..."
          />
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-eco-500/15 border border-eco-500/30 text-eco-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-eco-500/20 transition active:scale-95 disabled:opacity-50"
          >
            <Send size={14} />
            {isSaving ? 'Đang phát thông báo...' : 'Cập nhật & Đẩy Thông Báo'}
          </button>
        </div>
      </form>
    </div>
  );
}
