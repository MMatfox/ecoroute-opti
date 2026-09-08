// Trilingual Internationalization (Vietnamese, French, English)

export const translations = {
  vi: {
    appTitle: 'EcoRoute Opti',
    appSubtitle: 'Nền tảng Tối ưu Lộ trình Thu gom Rác Thông minh (VRP & AI)',
    roles: {
      ADMIN: 'Quản Trị Viên (Admin)',
      DRIVER: 'Tài Xế Thu Gom (Driver)',
      RESIDENT: 'Hộ Dân Cư (Citizen)',
      COMMERCIAL: 'Khu Dịch Vụ / Khách Sạn / Nhà Hàng'
    },
    nav: {
      dashboard: 'Bảng Điều Khiển',
      liveMap: 'Bản Đồ Trực Tuyến',
      windowManager: 'Cổng Đăng Ký',
      vrpOptimizer: 'Tối Ưu VRP',
      analytics: 'Dự Báo & Thống Kê',
      driverCockpit: 'Buồng Lái & Lộ Trình',
      citizenPortal: 'Đăng Ký Đổ Rác & Radar',
      exportPdf: 'Xuất File PDF'
    },
    simulation: {
      title: 'Mô phỏng Thời Gian Thực',
      running: 'Đang chạy',
      paused: 'Tạm dừng',
      speed: 'Tốc độ',
      addTraffic: 'Tạo ùn tắc giao thông',
      trafficAdded: 'Đã phát sinh điểm ùn tắc trên tuyến đường!'
    },
    us: {
      us1_4: 'Epic 1: Quản lý tài khoản & Phân quyền',
      us5: 'US5 - Thông báo mở/đóng cổng đăng ký đổ rác',
      us6: 'US6 - Cập nhật trạng thái đổ rác của người dân',
      us7: 'US7 - Quản lý hiệu lực & Báo cáo chậm trễ',
      us8: 'US8 - Tra cứu lộ trình & Radar xe thu gom',
      us9: 'US9 - Tracking trực tiếp các xe trong thành phố',
      us10: 'US10 - Thu thập dữ liệu rác & Dự báo đội xe',
      us11_12: 'US11/US12 - Soạn kế hoạch & Tối ưu hóa VRP (Min Σ Khoảng cách + Thời gian)',
      us13: 'US13 - Xuất file PDF kế hoạch tuyến đường'
    },
    common: {
      save: 'Lưu thay đổi',
      cancel: 'Hủy',
      loading: 'Đang xử lý...',
      status: 'Trạng thái',
      active: 'Hoạt động',
      inactive: 'Ngưng',
      confirmed: 'Đã tiếp nhận',
      collected: 'Đã thu gom',
      skipped: 'Bỏ qua / Không đổ',
      delayed: 'Bị trễ chuyến',
      truck: 'Xe thu gom',
      distance: 'Khoảng cách',
      duration: 'Thời gian',
      capacity: 'Sức chứa',
      load: 'Tải trọng hiện tại',
      co2Saved: 'CO₂ giảm thải',
      district: 'Quận / Khu vực',
      address: 'Địa chỉ',
      phone: 'Điện thoại',
      preferredTime: 'Giờ mong muốn'
    }
  },
  fr: {
    appTitle: 'EcoRoute Opti',
    appSubtitle: 'Plateforme IA d\'Optimisation des Tournées de Déchets (VRP & Temps Réel)',
    roles: {
      ADMIN: 'Administrateur / Dispatcher',
      DRIVER: 'Chauffeur Benne',
      RESIDENT: 'Résident / Citoyen',
      COMMERCIAL: 'Commerces / Hôtels / Restaurants'
    },
    nav: {
      dashboard: 'Tableau de Bord',
      liveMap: 'Carte en Direct',
      windowManager: 'Fenêtre de Dépôt',
      vrpOptimizer: 'Optimiseur VRP',
      analytics: 'Analyses & Prévisions',
      driverCockpit: 'Cockpit Chauffeur',
      citizenPortal: 'Espace Citoyen & Radar',
      exportPdf: 'Export PDF'
    },
    simulation: {
      title: 'Simulation Temps Réel',
      running: 'En cours',
      paused: 'En pause',
      speed: 'Vitesse',
      addTraffic: 'Simuler un bouchon',
      trafficAdded: 'Incident de circulation généré sur le parcours !'
    },
    us: {
      us1_4: 'Epic 1 : Gestion des Comptes & Rôles',
      us5: 'US5 - Contrôle de la fenêtre de déclaration',
      us6: 'US6 - Déclaration du statut de dépôt de déchet',
      us7: 'US7 - Gestion de la validité & Signalement de retard',
      us8: 'US8 - Radar d\'approche & Suivi du camion',
      us9: 'US9 - Tracking GPS en direct de la flotte',
      us10: 'US10 - Agrégation des tonnages & Prévision de flotte',
      us11_12: 'US11/US12 - Planification & Moteur VRP (Min Σ Distance + Temps)',
      us13: 'US13 - Téléchargement de la feuille de route PDF'
    },
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      loading: 'Chargement...',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
      confirmed: 'Confirmé',
      collected: 'Collecté',
      skipped: 'Ignoré / Pas de déchet',
      delayed: 'Retardé',
      truck: 'Camion benne',
      distance: 'Distance',
      duration: 'Durée',
      capacity: 'Capacité',
      load: 'Charge actuelle',
      co2Saved: 'CO₂ économisé',
      district: 'Quartier / District',
      address: 'Adresse',
      phone: 'Téléphone',
      preferredTime: 'Heure souhaitée'
    }
  },
  en: {
    appTitle: 'EcoRoute Opti',
    appSubtitle: 'Intelligent Waste Collection & Route Optimization Platform (VRP & AI)',
    roles: {
      ADMIN: 'Administrator (Dispatcher)',
      DRIVER: 'Garbage Truck Driver',
      RESIDENT: 'Resident / Citizen',
      COMMERCIAL: 'Commercial / Hotel / Restaurant'
    },
    nav: {
      dashboard: 'Dashboard',
      liveMap: 'Live Map',
      windowManager: 'Registration Window',
      vrpOptimizer: 'VRP Optimizer',
      analytics: 'Analytics & Forecasts',
      driverCockpit: 'Driver Cockpit',
      citizenPortal: 'Citizen Hub & Radar',
      exportPdf: 'Export PDF'
    },
    simulation: {
      title: 'Real-time Simulation',
      running: 'Running',
      paused: 'Paused',
      speed: 'Speed',
      addTraffic: 'Inject Traffic Jam',
      trafficAdded: 'Traffic incident simulated on active road!'
    },
    us: {
      us1_4: 'Epic 1: Account & Role Management',
      us5: 'US5 - Waste Registration Window Broadcast',
      us6: 'US6 - Citizen Disposal Status Registration',
      us7: 'US7 - Route Validity & Delay Management',
      us8: 'US8 - Live Truck Radar & Citizen ETA',
      us9: 'US9 - City Fleet Real-Time Tracking',
      us10: 'US10 - Daily Waste Aggregation & Fleet Prediction',
      us11_12: 'US11/US12 - Route Planning & VRP Engine (Min Σ Distance + Time)',
      us13: 'US13 - Export Route Manifest PDF'
    },
    common: {
      save: 'Save Changes',
      cancel: 'Cancel',
      loading: 'Loading...',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      confirmed: 'Confirmed',
      collected: 'Collected',
      skipped: 'Skipped',
      delayed: 'Delayed',
      truck: 'Truck',
      distance: 'Distance',
      duration: 'Duration',
      capacity: 'Capacity',
      load: 'Current Load',
      co2Saved: 'CO₂ Saved',
      district: 'District',
      address: 'Address',
      phone: 'Phone',
      preferredTime: 'Preferred Time'
    }
  }
};
