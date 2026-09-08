import React, { useState } from 'react';
import { User, Shield, Truck, Hotel, Home, X, CheckCircle2, Lock, Phone, MapPin, Edit3 } from 'lucide-react';
import { translations } from '../../services/i18n';
import { api } from '../../services/api';

export default function AuthModal({
  isOpen,
  mode = 'LOGIN', // 'LOGIN' (US2), 'REGISTER' (US1), 'PROFILE' (US4)
  currentUser,
  onClose,
  onUserAuthenticated,
  currentLang
}) {
  const t = translations[currentLang] || translations.vi;

  const [activeTab, setActiveTab] = useState(mode);
  const [role, setRole] = useState(currentUser?.role || 'RESIDENT');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Quận 1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (activeTab === 'LOGIN') {
        const res = await api.login(username || 'admin', role);
        if (res.success) {
          onUserAuthenticated(res.user);
          onClose();
        }
      } else if (activeTab === 'REGISTER') {
        const res = await api.register({
          username,
          name,
          role,
          phone,
          address,
          district
        });
        if (res.success) {
          setSuccessMsg('Đăng ký tài khoản thành công!');
          setTimeout(() => {
            onUserAuthenticated(res.user);
            onClose();
          }, 1000);
        }
      } else if (activeTab === 'PROFILE') {
        const res = await api.updateProfile(currentUser.id, {
          name,
          phone,
          address,
          district
        });
        if (res.success) {
          setSuccessMsg('Đã cập nhật thông tin cá nhân thành công (US4)!');
          setTimeout(() => {
            onUserAuthenticated(res.user);
            onClose();
          }, 1200);
        }
      }
    } catch (err) {
      setErrorMsg('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        {/* Modal Navigation Tabs (US1, US2, US4) */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('LOGIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'LOGIN'
                ? 'bg-eco-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            US2 - Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REGISTER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'REGISTER'
                ? 'bg-eco-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            US1 - Đăng Ký Tài Khoản
          </button>
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('PROFILE');
                setName(currentUser.name);
                setPhone(currentUser.phone);
                setAddress(currentUser.address || '');
                setDistrict(currentUser.district || 'Quận 1');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'PROFILE'
                  ? 'bg-eco-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              US4 - Sửa Hồ Sơ
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* US1/US2: Role Selection Pill Picker */}
          {activeTab !== 'PROFILE' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Chọn Loại Người Dùng / Vai Trò Hệ Thống:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'RESIDENT', label: 'Hộ Dân Cư', icon: Home, color: 'hover:border-eco-500' },
                  { id: 'COMMERCIAL', label: 'Khu Dịch Vụ / Khách Sạn', icon: Hotel, color: 'hover:border-amber-500' },
                  { id: 'DRIVER', label: 'Tài Xế Thu Gom', icon: Truck, color: 'hover:border-sky-500' },
                  { id: 'ADMIN', label: 'Quản Trị Viên', icon: Shield, color: 'hover:border-indigo-500' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition text-left ${
                        isSelected
                          ? 'bg-slate-800 border-eco-500 text-eco-400 shadow-sm'
                          : `bg-slate-950/60 border-slate-800 text-slate-400 ${item.color}`
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fields for LOGIN */}
          {activeTab === 'LOGIN' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tên đăng nhập</label>
                <input
                  type="text"
                  placeholder="admin, driver1, resident..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500"
                />
              </div>
            </div>
          )}

          {/* Fields for REGISTER or PROFILE */}
          {(activeTab === 'REGISTER' || activeTab === 'PROFILE') && (
            <div className="space-y-3">
              {activeTab === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tên đăng nhập mới</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="VD: citizen_nguyen..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Họ và tên / Tên đơn vị</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Lê Văn Phước / KS Novotel Danang"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Quận / Huyện</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500"
                  >
                    <option value="Quận Hải Châu">Quận Hải Châu</option>
                    <option value="Quận Sơn Trà">Quận Sơn Trà</option>
                    <option value="Quận Ngũ Hành Sơn">Quận Ngũ Hành Sơn</option>
                    <option value="Quận Thanh Khê">Quận Thanh Khê</option>
                    <option value="Quận Cẩm Lệ">Quận Cẩm Lệ</option>
                    <option value="Quận Liên Chiểu">Quận Liên Chiểu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Địa chỉ cụ thể</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="VD: 88 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-eco-500"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-eco-500/15 border border-eco-500/30 text-eco-400 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-eco-500/20 active:scale-95 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Đang xử lý...' : activeTab === 'LOGIN' ? 'Đăng Nhập' : activeTab === 'REGISTER' ? 'Đăng Ký Tài Khoản' : 'Lưu Thay Đổi (US4)'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
