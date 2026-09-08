import React from 'react';
import { Play, Pause, FastForward, AlertTriangle, Shield, Truck, User, Globe, Sparkles, Navigation } from 'lucide-react';
import { translations } from '../services/i18n';

export default function Navbar({
  currentRole,
  onRoleChange,
  currentLang,
  onLangChange,
  activeTab,
  onTabChange,
  simState,
  onToggleSim,
  onSetSimSpeed,
  onInjectTraffic,
  windowStatus
}) {
  const t = translations[currentLang] || translations.vi;

  const roleList = [
    { id: 'ADMIN', label: t.roles.ADMIN, icon: Shield, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { id: 'DRIVER', label: t.roles.DRIVER, icon: Truck, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { id: 'RESIDENT', label: t.roles.RESIDENT, icon: User, color: 'text-eco-400 bg-eco-500/10 border-eco-500/30' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 to-teal-400 flex items-center justify-center shadow-lg shadow-eco-500/20 text-white font-black text-xl">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-eco-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                  EcoRoute Opti
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-eco-500/15 text-eco-400 border border-eco-500/30">
                  AI VRP 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Simulation Controller Bar (Center) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mr-2">
              <span className={`w-2 h-2 rounded-full ${simState.isPaused ? 'bg-amber-400' : 'bg-eco-400 animate-pulse'}`}></span>
              <span className="font-medium">{simState.isPaused ? t.simulation.paused : t.simulation.running}</span>
            </div>

            <button
              onClick={onToggleSim}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                simState.isPaused
                  ? 'bg-eco-500 text-slate-950 hover:bg-eco-400 shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={simState.isPaused ? 'Tiếp tục mô phỏng' : 'Tạm dừng'}
            >
              {simState.isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>

            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSetSimSpeed(speed)}
                  className={`px-2 py-0.5 rounded ${
                    simState.speed === speed
                      ? 'bg-eco-500/20 text-eco-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={onInjectTraffic}
              className="ml-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 flex items-center gap-1 transition"
              title="Simuler un embouteillage"
            >
              <AlertTriangle size={13} />
              <span className="hidden xl:inline">{t.simulation.addTraffic}</span>
            </button>
          </div>

          {/* Right controls: Role Selector & Language */}
          <div className="flex items-center gap-3">
            
            {/* Role Switcher (US3) */}
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
              {roleList.map((r) => {
                const Icon = r.icon;
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => onRoleChange(r.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? `${r.color} shadow-sm`
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="hidden md:inline">{r.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
              {['vi', 'fr', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLangChange(lang)}
                  className={`px-2 py-1 rounded-lg uppercase font-bold transition ${
                    currentLang === lang
                      ? 'bg-slate-800 text-eco-400 border border-slate-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
