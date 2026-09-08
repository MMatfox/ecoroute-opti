import React, { useState } from 'react';
import { Trash2, Clock, MapPin, Phone, CheckCircle2, XCircle, AlertCircle, Sparkles, Building2, Home, Package } from 'lucide-react';
import { translations } from '../../services/i18n';

export default function CitizenPortal({
  currentUser,
  windowStatus,
  existingRequest,
  onSubmitRequest,
  currentLang,
  onRequestUpdated
}) {
  const t = translations[currentLang] || translations.vi;

  const [willDispose, setWillDispose] = useState(true);
  const [wasteAmountKg, setWasteAmountKg] = useState(existingRequest?.wasteAmountKg || 35);
  const [wasteType, setWasteType] = useState(existingRequest?.wasteType || 'GENERAL');
  const [preferredTime, setPreferredTime] = useState(existingRequest?.preferredTime || '10:00');
  const [address, setAddress] = useState(currentUser?.address || '88 Lê Lợi, P. Bến Thành, Quận 1');
  const [phone, setPhone] = useState(currentUser?.phone || '0934 567 890');
  const [notes, setNotes] = useState(existingRequest?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isWindowOpen = windowStatus?.isOpen ?? true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        id: existingRequest?.id || currentUser?.id ? `req_${currentUser.id}` : undefined,
        name: currentUser?.name || 'Hộ Dân Cư',
        type: currentUser?.role === 'COMMERCIAL' ? 'COMMERCIAL' : 'RESIDENTIAL',
        category: currentUser?.role === 'COMMERCIAL' ? 'HOTEL' : 'HOUSE',
        address,
        lat: currentUser?.lat || 10.772980,
        lng: currentUser?.lng || 106.699150,
        districtId: 'd1',
        wasteAmountKg: Number(wasteAmountKg),
        wasteType,
        preferredTime,
        willDispose,
        contactPhone: phone,
        notes
      };

      const res = await onSubmitRequest(payload);
      setFeedback({
        type: 'success',
        msg: res.message || 'Cập nhật trạng thái đổ rác thành công!'
      });

      if (onRequestUpdated) onRequestUpdated();
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: 'Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-eco-500/20 text-eco-400 border border-eco-500/30">
              US6
            </span>
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <Trash2 className="text-eco-400" size={20} />
              {t.us.us6}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Khai báo nhu cầu đổ rác, loại rác và khung giờ mong muốn để hệ thống AI sắp xếp lộ trình xe tối ưu.
          </p>
        </div>

        {/* Portal Window status badge */}
        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
          isWindowOpen ? 'bg-eco-500/10 text-eco-400 border-eco-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isWindowOpen ? 'bg-eco-400 animate-pulse' : 'bg-rose-500'}`}></span>
          <span>{isWindowOpen ? `Cổng mở: ${windowStatus?.openTime || '09:00'} - ${windowStatus?.closeTime || '14:00'}` : 'Cổng đăng ký đang đóng'}</span>
        </div>
      </div>

      {/* Broadcast Banner from Admin (US5 receiver) */}
      {windowStatus?.announcement && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-start gap-3">
          <Sparkles className="text-indigo-400 shrink-0 mt-0.5" size={16} />
          <div className="text-xs">
            <span className="font-bold text-indigo-300">Thông báo từ Quản trị viên: </span>
            <span className="text-slate-300">{windowStatus.announcement}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Opt-In / Opt-Out Decision (US6) */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm text-slate-200">Hôm nay bạn có nhu cầu đổ rác không?</div>
            <div className="text-xs text-slate-400">Chọn "Có" để xe thu gom đến lấy rác tại địa chỉ của bạn</div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setWillDispose(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                willDispose
                  ? 'bg-eco-500 text-slate-950 shadow-md shadow-eco-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 size={14} />
              Có đổ rác hôm nay
            </button>
            <button
              type="button"
              onClick={() => setWillDispose(false)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                !willDispose
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <XCircle size={14} />
              Không có rác
            </button>
          </div>
        </div>

        {willDispose && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Amount and Waste Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Package size={13} className="text-eco-400" />
                  Khối lượng ước tính (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={wasteAmountKg}
                    onChange={(e) => setWasteAmountKg(e.target.value)}
                    className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-eco-500"
                    required
                  />
                  <div className="flex gap-1.5">
                    {[20, 50, 150].map((quickVal) => (
                      <button
                        key={quickVal}
                        type="button"
                        onClick={() => setWasteAmountKg(quickVal)}
                        className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                      >
                        +{quickVal}kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Trash2 size={13} className="text-amber-400" />
                  Phân loại rác thải
                </label>
                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500"
                >
                  <option value="GENERAL">Rác sinh hoạt tổng hợp</option>
                  <option value="ORGANIC">Rác hữu cơ / Thức ăn thừa (Nhà hàng/Khách sạn)</option>
                  <option value="RECYCLABLE">Rác tái chế (Nhựa, Giấy, Kim loại)</option>
                  <option value="BULKY_RECYCLABLE">Rác cồng kềnh / Đồ gỗ đóng gói</option>
                </select>
              </div>
            </div>

            {/* Preferred Time & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-sky-400" />
                  Khung giờ mong muốn xe đến gom (Ví dụ: 10h)
                </label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-eco-500"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Phone size={13} className="text-teal-400" />
                  Số điện thoại người liên hệ
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-eco-500"
                  required
                />
              </div>
            </div>

            {/* Address & Note */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-rose-400" />
                Địa chỉ nhận thu gom rác
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-eco-500"
                required
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Ghi chú thêm cho tài xế (Vị trí để rác, lối vào tầng hầm, v.v.)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: 2 túi rác trước cổng nhà, hoặc rác gom tại khu loading bay"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-eco-500"
              />
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-eco-500/15 border border-eco-500/30 text-eco-400'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-eco-500/20 active:scale-95 transition disabled:opacity-50"
          >
            <CheckCircle2 size={15} />
            {isSubmitting ? 'Đang gửi cập nhật...' : 'Xác Nhận & Cập Nhật Trạng Thái'}
          </button>
        </div>
      </form>

    </div>
  );
}
