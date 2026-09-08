# 🌿 EcoRoute Opti &mdash; AI-Powered Waste Collection & VRP Optimization Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-10b981.svg)](https://leafletjs.com/)

**EcoRoute Opti** is an intelligent waste collection dispatch and mathematical routing platform. It implements **Vehicle Routing Problem (VRP)** optimization algorithms (*Clarke-Wright Savings Heuristic* + *2-Opt Local Search*) alongside real-time GPS fleet tracking, citizen proximity radar, and predictive AI analytics.

---

## 📌 Architecture Overview

```mermaid
graph TD
    subgraph Frontend [⚛️ Frontend React 18 + Vite + Tailwind]
        UI1[Citizen / Business Portal - Declaration & Truck Radar]
        UI2[Driver Cockpit - GPS Navigation, Validity & PDF Manifest]
        UI3[Admin Dashboard - Dispatching, Forecasts & VRP Optimizer]
        MAP[Interactive Leaflet.js Map with Real Street Geometry]
    end

    subgraph Backend [🟢 Backend Node.js + Express API]
        API_AUTH[/api/auth - Registration, Login, Role Permissions]
        API_DATA[/api/registrations - Time Window, Disposal Demands]
        API_FLEET[/api/fleet - Real-time GPS Truck Tracking & Delays]
        API_VRP[/api/vrp - VRP Engine Min Σ Distance + Σ Time]
        API_ANALYTICS[/api/analytics - District Waste Tonnage & Fleet Forecast]
    end

    Frontend <-->|REST API + Real-time Simulation Polling| Backend
```

---

## 🚀 Key Features & User Stories Coverage

### 🔐 Epic 1: Account & Role Management
- **US1 &ndash; Registration (`US1 - Đăng ký`)**: Multi-profile signup (Citizen, Commercial/Hotel/Restaurant, Driver, Admin).
- **US2 &ndash; Authentication (`US2 - Đăng nhập`)**: Session login with role-based dashboard switching.
- **US3 &ndash; Access Control & Permissions (`US3 - Phân quyền`)**: Admin view to manage and assign user permissions across districts.
- **US4 &ndash; Profile Management (`US4 - Chỉnh sửa hồ sơ`)**: Citizen & Driver address, phone, and district preference updates.

### 📡 Epic 2 - CN1: Real-Time Fleet Tracking & Input Data
- **US5 &ndash; Time Window Announcements (`US5 - Thông báo mở cổng`)**: Admin configures collection declaration hours (e.g., 09:00 - 14:00) with instant broadcast.
- **US6 &ndash; Waste Status Declaration (`US6 - Cập nhật trạng thái đổ rác`)**: Citizens declare waste volume (kg), type (organic, recyclable, bulky), and desired pickup time.
- **US7 &ndash; Route Validity & Delay Management (`US7 - Quản lý hiệu lực`)**: Drivers report congestion and postpone collection times with push alerts.
- **US8 &ndash; Truck Proximity Radar (`US8 - Tra cứu & Radar xe`)**: Live radar estimating distance (meters) and ETA, triggering take-out reminders (<800m).
- **US9 &ndash; Live City Fleet GPS Tracking (`US9 - Tracking xe`)**: Interactive OpenStreetMap tracking trucks moving along real street geometries.
- **US10 &ndash; Waste Data & AI Fleet Prediction (`US10 - Thu thập dữ liệu rác`)**: Daily district tonnage aggregation and tomorrow fleet deployment forecast.

### 🧠 Epic 2 - CN2: VRP Planning & Route Optimization
- **US11 &ndash; Turn-by-Turn Route Planning (`US11 - Soạn bản kế hoạch`)**: Sequenced stop schedule with arrival/departure ETAs.
- **US12 &ndash; Mathematical VRP Engine (`US12 - Tối ưu hóa VRP`)**: Solves $\min(\sum \text{Distance} + \sum \text{Time})$ under truck capacity and live traffic constraints.
- **US13 &ndash; PDF Route Manifest (`US13 - Xuất file PDF`)**: Printable driver manifest with stop checklist and signature blocks.

---

## 🛠️ Installation & Getting Started

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
npm run dev --prefix client # or cd client && npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

- **Frontend Application**: [`http://localhost:5173`](http://localhost:5173)
- **Backend API Explorer**: [`http://localhost:5000`](http://localhost:5000)

---

## 📁 Project Structure

```
.
├── client/
│   ├── index.html             # HTML entry point
│   ├── src/
│   │   ├── App.jsx            # Main React App & Role Routing
│   │   ├── main.jsx           # React DOM Mount
│   │   ├── index.css          # TailwindCSS & Animations
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation, Role Switcher & Sim controls
│   │   │   ├── LiveMap.jsx    # Real-time Leaflet map (Road Geometry)
│   │   │   ├── NotificationCenter.jsx # Live toast alerts
│   │   │   ├── admin/         # Admin Dashboard, Window & VRP Optimizer
│   │   │   ├── driver/        # Driver Cockpit & PDF Export
│   │   │   ├── citizen/       # Citizen Portal & Proximity Radar
│   │   │   └── auth/          # Authentication & Profile Modal
│   │   └── services/
│   │       ├── api.js         # HTTP API Client
│   │       └── i18n.js        # Multi-language dictionary (VI / FR / EN)
│   └── package.json
├── server/
│   ├── server.js              # Express Backend Server
│   ├── routes/                # API Routes (Auth, Fleet, Registrations, VRP, Analytics)
│   ├── services/              # VRP Engine & Traffic Simulator
│   └── data/                  # Seed dataset (Depot, Districts, Trucks, Collection Points)
├── package.json               # Root scripts
└── README.md
```

---

## 🌐 Multilingual Support
EcoRoute Opti supports 3 languages seamlessly:
- 🇻🇳 **Tiếng Việt** (Vietnamese)
- 🇬🇧 **English**
- 🇫🇷 **Français** (French)

---

## 📄 License
ISC License &copy; 2026 EcoRoute Opti.
