import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { registrationsRouter } from './routes/registrations.js';
import { fleetRouter } from './routes/fleet.js';
import { vrpRouter } from './routes/vrp.js';
import { analyticsRouter } from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/fleet', fleetRouter);
app.use('/api/vrp', vrpRouter);
app.use('/api/analytics', analyticsRouter);

// Health check & Bilingual API Explorer (EN / VI)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EcoRoute Opti - API Engine</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            background: #090e1a;
            color: #f1f5f9;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
          }
          .container {
            width: 100%;
            max-width: 720px;
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1.25rem;
            border-bottom: 1px solid #1e293b;
          }
          .title-group {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, #10b981, #06b6d4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
          }
          h1 {
            font-size: 1.35rem;
            font-weight: 800;
            background: linear-gradient(to right, #34d399, #38bdf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .lang-switcher {
            display: flex;
            background: #020617;
            padding: 4px;
            border-radius: 10px;
            border: 1px solid #1e293b;
            gap: 4px;
          }
          .lang-btn {
            background: transparent;
            border: none;
            color: #64748b;
            font-weight: 700;
            font-size: 12px;
            padding: 6px 14px;
            border-radius: 7px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .lang-btn.active {
            background: #1e293b;
            color: #34d399;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          }
          .desc {
            color: #94a3b8;
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 1.5rem;
          }
          .frontend-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: #022c22;
            font-weight: 800;
            font-size: 13px;
            padding: 10px 18px;
            border-radius: 10px;
            text-decoration: none;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
            transition: transform 0.15s, opacity 0.15s;
            margin-bottom: 1.75rem;
          }
          .frontend-btn:hover {
            transform: translateY(-1px);
            opacity: 0.95;
          }
          h3 {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            font-weight: 700;
            margin-bottom: 0.75rem;
          }
          .endpoints-grid {
            display: grid;
            gap: 8px;
          }
          .endpoint-item {
            background: #0a0f1d;
            border: 1px solid #1e293b;
            border-radius: 10px;
            padding: 10px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            text-decoration: none;
            transition: border-color 0.2s, background 0.2s;
          }
          .endpoint-item:hover {
            border-color: #334155;
            background: #0f172a;
          }
          .endpoint-left {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: #38bdf8;
          }
          .method-badge {
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 5px;
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }
          .method-post {
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border-color: rgba(245, 158, 11, 0.3);
          }
          .endpoint-desc {
            font-size: 12px;
            color: #94a3b8;
          }
          .footer-status {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #1e293b;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11px;
            color: #64748b;
            font-family: 'JetBrains Mono', monospace;
          }
          .status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #34d399;
          }
          .dot {
            width: 7px;
            height: 7px;
            background: #34d399;
            border-radius: 50%;
            box-shadow: 0 0 8px #34d399;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title-group">
              <div class="logo">🌿</div>
              <div>
                <h1 id="app-title">EcoRoute Opti &mdash; Backend API Engine</h1>
                <div style="font-size: 11px; color: #64748b; font-family: 'JetBrains Mono', monospace;">Express REST Server &bull; Port 5000</div>
              </div>
            </div>

            <!-- Language Switcher (EN / VI) -->
            <div class="lang-switcher">
              <button class="lang-btn active" id="btn-en" onclick="setLang('en')">🇬🇧 English</button>
              <button class="lang-btn" id="btn-vi" onclick="setLang('vi')">🇻🇳 Tiếng Việt</button>
            </div>
          </div>

          <p class="desc" id="app-desc">
            This is the core backend microservice powering waste routing calculations, real-time GPS fleet tracking, and mathematical VRP heuristics.
          </p>

          <a href="http://localhost:5173" target="_blank" class="frontend-btn" id="btn-frontend">
            <span>🚀 Open Interactive Web UI (localhost:5173)</span> &rarr;
          </a>

          <h3 id="endpoints-header">REST API Endpoints</h3>
          <div class="endpoints-grid">
            
            <a href="/api/health" class="endpoint-item">
              <div class="endpoint-left">
                <span class="method-badge">GET</span>
                <span>/api/health</span>
              </div>
              <span class="endpoint-desc" id="desc-health">Server health status & timestamp</span>
            </a>

            <a href="/api/fleet/trucks" class="endpoint-item">
              <div class="endpoint-left">
                <span class="method-badge">GET</span>
                <span>/api/fleet/trucks</span>
              </div>
              <span class="endpoint-desc" id="desc-fleet">Live truck GPS coordinates & speed</span>
            </a>

            <a href="/api/registrations/window" class="endpoint-item">
              <div class="endpoint-left">
                <span class="method-badge">GET</span>
                <span>/api/registrations/window</span>
              </div>
              <span class="endpoint-desc" id="desc-window">Waste declaration time window (US5)</span>
            </a>

            <a href="/api/registrations/requests" class="endpoint-item">
              <div class="endpoint-left">
                <span class="method-badge">GET</span>
                <span>/api/registrations/requests</span>
              </div>
              <span class="endpoint-desc" id="desc-requests">Citizen & commercial disposal demands (US6)</span>
            </a>

            <a href="/api/vrp/current-plan" class="endpoint-item">
              <div class="endpoint-left">
                <span class="method-badge">GET</span>
                <span>/api/vrp/current-plan</span>
              </div>
              <span class="endpoint-desc" id="desc-vrp">Optimized routes: Min(Σ Distance + Σ Time)</span>
            </a>

            <a href="/api/analytics/waste-summary" class="endpoint-item">
              <div class="endpoint-left">
                <span class="method-badge">GET</span>
                <span>/api/analytics/waste-summary</span>
              </div>
              <span class="endpoint-desc" id="desc-analytics">District waste volume & AI fleet prediction (US10)</span>
            </a>

          </div>

          <div class="footer-status">
            <div class="status-indicator">
              <span class="dot"></span>
              <span id="lbl-status">SYSTEM ONLINE</span>
            </div>
            <div>VRP Engine v2.4 &bull; Node.js</div>
          </div>
        </div>

        <script>
          const i18n = {
            en: {
              title: "EcoRoute Opti — Backend API Engine",
              desc: "This is the core backend microservice powering waste routing calculations, real-time GPS fleet tracking, and mathematical VRP heuristics.",
              frontendBtn: "🚀 Open Interactive Web UI (localhost:5173) →",
              endpointsHeader: "REST API Endpoints",
              health: "Server health status & timestamp",
              fleet: "Live truck GPS coordinates & speed",
              window: "Waste declaration time window (US5)",
              requests: "Citizen & commercial disposal demands (US6)",
              vrp: "Optimized routes: Min(Σ Distance + Σ Time)",
              analytics: "District waste volume & AI fleet prediction (US10)",
              status: "SYSTEM ONLINE"
            },
            vi: {
              title: "EcoRoute Opti — Máy Chủ API & Thuật Toán VRP",
              desc: "Đây là máy chủ xử lý dữ liệu trung tâm phụ trách tính toán định tuyến thu gom rác, tracking GPS đội xe thời gian thực và giải thuật tối ưu VRP.",
              frontendBtn: "🚀 Mở Giao Diện Web Trực Quan (localhost:5173) →",
              endpointsHeader: "Danh Sách Cổng API REST",
              health: "Kiểm tra trạng thái máy chủ & thời gian",
              fleet: "Tọa độ GPS đội xe trực tiếp & vận tốc",
              window: "Khung giờ mở/đóng cổng đăng ký (US5)",
              requests: "Nhu cầu đổ rác của người dân & dịch vụ (US6)",
              vrp: "Lộ trình tối ưu hóa: Min(Σ Khoảng cách + Σ Thời gian)",
              analytics: "Thống kê lượng rác & AI dự báo đội xe (US10)",
              status: "HỆ THỐNG ĐANG HOẠT ĐỘNG"
            }
          };

          function setLang(lang) {
            document.getElementById('btn-en').classList.toggle('active', lang === 'en');
            document.getElementById('btn-vi').classList.toggle('active', lang === 'vi');
            
            const t = i18n[lang];
            document.getElementById('app-title').textContent = t.title;
            document.getElementById('app-desc').textContent = t.desc;
            document.getElementById('btn-frontend').innerHTML = '<span>' + t.frontendBtn + '</span>';
            document.getElementById('endpoints-header').textContent = t.endpointsHeader;
            document.getElementById('desc-health').textContent = t.health;
            document.getElementById('desc-fleet').textContent = t.fleet;
            document.getElementById('desc-window').textContent = t.window;
            document.getElementById('desc-requests').textContent = t.requests;
            document.getElementById('desc-vrp').textContent = t.vrp;
            document.getElementById('desc-analytics').textContent = t.analytics;
            document.getElementById('lbl-status').textContent = t.status;
          }
        </script>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'EcoRoute Opti - Waste Collection AI Platform',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🌿 EcoRoute Opti Backend Server running on http://localhost:${PORT}`);
});
