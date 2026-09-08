import React, { useState, useEffect } from 'react';
import { Shield, Users, Truck, Sparkles, UserCheck, AlertCircle, Edit3, CheckCircle2 } from 'lucide-react';
import { translations } from '../../services/i18n';
import { api } from '../../services/api';

export default function AdminDashboard({
  currentUser,
  currentLang,
  fleet = [],
  registeredPoints = [],
  onOpenWindowManager,
  onOpenVRPOptimizer,
  onOpenAnalytics
}) {
  const t = translations[currentLang] || translations.vi;

  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [editRole, setEditRole] = useState('RESIDENT');
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.getUsers();
      if (res.success) {
        setUsersList(res.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId) => {
    try {
      await api.updateProfile(userId, { role: editRole });
      setUpdateMsg('Đã cập nhật phân quyền người dùng thành công!');
      setSelectedUserToEdit(null);
      fetchUsers();
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const totalWasteKg = registeredPoints.reduce((sum, p) => sum + (p.wasteAmountKg || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={onOpenWindowManager}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Yêu cầu thu gom hôm nay</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-eco-500/20 text-eco-400">US5/6</span>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono group-hover:text-eco-400 transition">
            {registeredPoints.length} <span className="text-xs font-normal text-slate-400">điểm</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Tổng khối lượng: <b className="text-eco-400">{totalWasteKg} kg</b>
          </div>
        </div>

        <div
          onClick={onOpenVRPOptimizer}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Đội xe đang vận hành</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400">US9</span>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono group-hover:text-sky-400 transition">
            {fleet.length} <span className="text-xs font-normal text-slate-400">camions</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Trạng thái GPS: <b className="text-sky-400">100% Online</b>
          </div>
        </div>

        <div
          onClick={onOpenVRPOptimizer}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Thuật toán tối ưu</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-400">US11/12</span>
          </div>
          <div className="text-xl font-extrabold text-teal-400 group-hover:text-teal-300 transition">
            VRP 2-Opt Active
          </div>
          <div className="text-xs text-slate-400">
            Mục tiêu: Min (Σ Dist + Σ Time)
          </div>
        </div>

        <div
          onClick={onOpenAnalytics}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Dự báo ngày mai</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">US10</span>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono group-hover:text-amber-300 transition">
            ~19.8 <span className="text-xs font-normal text-slate-400">tấn rác</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Đề xuất điều động: <b className="text-amber-400">7 xe</b>
          </div>
        </div>
      </div>

      {/* US3: User Permissions & Roles Management Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                US3
              </span>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Users className="text-indigo-400" size={18} />
                Quản Lý & Phân Quyền Người Dùng (Access Control & Permissions)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Admin quản lý và phân quyền tài khoản (Người dân, Doanh nghiệp dịch vụ, Tài xế, Quản trị viên) nhằm đảm bảo bảo mật hệ thống.
            </p>
          </div>

          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            {usersList.length} tài khoản trong hệ thống
          </div>
        </div>

        {updateMsg && (
          <div className="p-3 rounded-xl bg-eco-500/15 border border-eco-500/30 text-eco-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{updateMsg}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Người dùng / Đơn vị</th>
                <th className="py-2.5 px-3">Tài khoản</th>
                <th className="py-2.5 px-3">Số điện thoại</th>
                <th className="py-2.5 px-3">Vai trò hiện tại</th>
                <th className="py-2.5 px-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((u) => {
                const isEditing = selectedUserToEdit?.id === u.id;

                let roleBadge = 'bg-slate-800 text-slate-300 border-slate-700';
                if (u.role === 'ADMIN') roleBadge = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
                if (u.role === 'DRIVER') roleBadge = 'bg-sky-500/20 text-sky-400 border-sky-500/30';
                if (u.role === 'RESIDENT') roleBadge = 'bg-eco-500/20 text-eco-400 border-eco-500/30';
                if (u.role === 'COMMERCIAL') roleBadge = 'bg-amber-500/20 text-amber-400 border-amber-500/30';

                return (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.address || u.district || 'TP. Hồ Chí Minh'}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300">
                      @{u.username}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-400">
                      {u.phone}
                    </td>

                    <td className="py-3 px-3">
                      {isEditing ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                        >
                          <option value="ADMIN">ADMIN (Quản trị)</option>
                          <option value="DRIVER">DRIVER (Tài xế)</option>
                          <option value="RESIDENT">RESIDENT (Người dân)</option>
                          <option value="COMMERCIAL">COMMERCIAL (Khu dịch vụ)</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${roleBadge}`}>
                          {u.role}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRoleUpdate(u.id)}
                            className="px-2.5 py-1 rounded bg-eco-500 text-slate-950 font-bold text-[11px] hover:bg-eco-400"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setSelectedUserToEdit(null)}
                            className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedUserToEdit(u);
                            setEditRole(u.role);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Chỉnh sửa phân quyền"
                        >
                          <Edit3 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
