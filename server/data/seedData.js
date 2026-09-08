// Initial seed dataset for EcoRoute Opti - Da Nang City (TP. Đà Nẵng)

export const seedDistricts = [
  { id: 'd1', name: 'Quận Hải Châu - Trung tâm & Bạch Đằng', city: 'TP. Đà Nẵng', dailyAvgKg: 4600, activeHouseholds: 360 },
  { id: 'd2', name: 'Quận Sơn Trà - Bãi biển Mỹ Khê & Bán đảo', city: 'TP. Đà Nẵng', dailyAvgKg: 3900, activeHouseholds: 290 },
  { id: 'd3', name: 'Quận Ngũ Hành Sơn - Dãy Resort & Khách sạn', city: 'TP. Đà Nẵng', dailyAvgKg: 3400, activeHouseholds: 250 },
  { id: 'd4', name: 'Quận Thanh Khê - Điện Biên Phủ & Biển', city: 'TP. Đà Nẵng', dailyAvgKg: 4200, activeHouseholds: 330 },
  { id: 'd5', name: 'Quận Cẩm Lệ - Khu đô thị sinh thái Hòa Xuân', dailyAvgKg: 3100, city: 'TP. Đà Nẵng', activeHouseholds: 220 }
];

// Depot (Waste Treatment & Dispatch Center - Đà Nẵng)
export const seedDepot = {
  id: 'depot_main',
  name: 'Trạm Trung Chuyển & Xử Lý Rác Đà Nẵng (EcoDepot Da Nang)',
  lat: 16.0544,
  lng: 108.2022,
  address: 'Khu Liên Hợp Xử Lý & Trung Chuyển, Q. Cẩm Lệ / Hải Châu, TP. Đà Nẵng',
  type: 'DEPOT'
};

// Seed Collection Points (Citizens, Restaurants, Hotels, Residential Zones in Da Nang)
export const seedPoints = [
  {
    id: 'req_101',
    name: 'Khách sạn Novotel Danang Premier (Khu dịch vụ)',
    type: 'COMMERCIAL',
    category: 'HOTEL',
    address: '36 Bạch Đằng, P. Thạch Thang, Q. Hải Châu, Đà Nẵng',
    lat: 16.0772,
    lng: 108.2241,
    districtId: 'd1',
    wasteAmountKg: 210,
    wasteType: 'ORGANIC_GENERAL',
    preferredTime: '09:30',
    status: 'CONFIRMED',
    timeWindow: { start: '09:00', end: '11:00' },
    contactPhone: '0901 234 567',
    notes: 'Khu vực loading bay sau khách sạn bên đường Bạch Đằng'
  },
  {
    id: 'req_102',
    name: 'Chung cư Bạch Đằng Complex (Hộ dân cư)',
    type: 'RESIDENTIAL',
    category: 'APARTMENT',
    address: '50 Bạch Đằng, P. Hải Châu 1, Q. Hải Châu, Đà Nẵng',
    lat: 16.0735,
    lng: 108.2238,
    districtId: 'd1',
    wasteAmountKg: 110,
    wasteType: 'RECYCLABLE',
    preferredTime: '10:00',
    status: 'CONFIRMED',
    timeWindow: { start: '09:30', end: '11:30' },
    contactPhone: '0912 345 678',
    notes: 'Thu gom tại sảnh kỹ thuật tầng hầm B1'
  },
  {
    id: 'req_103',
    name: 'Nhà hàng Hải Sản Bé Mặn (Khu dịch vụ)',
    type: 'COMMERCIAL',
    category: 'RESTAURANT',
    address: 'Lô 11 Võ Nguyên Giáp, P. Mân Thái, Q. Sơn Trà, Đà Nẵng',
    lat: 16.0698,
    lng: 108.2465,
    districtId: 'd2',
    wasteAmountKg: 280,
    wasteType: 'ORGANIC',
    preferredTime: '10:30',
    status: 'CONFIRMED',
    timeWindow: { start: '10:00', end: '12:00' },
    contactPhone: '0923 456 789',
    notes: 'Thực phẩm hữu cơ và vỏ hải sản thùng chuyên dụng'
  },
  {
    id: 'req_104',
    name: 'Hộ gia đình Lê Văn Phước',
    type: 'RESIDENTIAL',
    category: 'HOUSE',
    address: '88 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng',
    lat: 16.0602,
    lng: 108.2165,
    districtId: 'd1',
    wasteAmountKg: 45,
    wasteType: 'GENERAL',
    preferredTime: '11:00',
    status: 'CONFIRMED',
    timeWindow: { start: '10:30', end: '12:30' },
    contactPhone: '0934 567 890',
    notes: '2 túi rác sinh hoạt trước cửa nhà'
  },
  {
    id: 'req_105',
    name: 'Trung tâm Thương mại Vincom Plaza Đà Nẵng',
    type: 'COMMERCIAL',
    category: 'MALL',
    address: '910A Ngô Quyền, P. An Hải Bắc, Q. Sơn Trà, Đà Nẵng',
    lat: 16.0718,
    lng: 108.2335,
    districtId: 'd2',
    wasteAmountKg: 380,
    wasteType: 'BULKY_RECYCLABLE',
    preferredTime: '11:30',
    status: 'CONFIRMED',
    timeWindow: { start: '11:00', end: '13:00' },
    contactPhone: '0945 678 901',
    notes: 'Khu vực gom rác tập trung phía sau tòa nhà'
  },
  {
    id: 'req_106',
    name: 'Khu biệt thự Đảo Xanh (Cầu Trần Thị Lý)',
    type: 'RESIDENTIAL',
    category: 'RESIDENTIAL_AREA',
    address: 'Khu biệt thự Đảo Xanh, P. Hòa Cường Bắc, Q. Hải Châu, Đà Nẵng',
    lat: 16.0495,
    lng: 108.2245,
    districtId: 'd1',
    wasteAmountKg: 140,
    wasteType: 'GARDEN_ORGANIC',
    preferredTime: '13:00',
    status: 'CONFIRMED',
    timeWindow: { start: '12:30', end: '14:30' },
    contactPhone: '0956 789 012',
    notes: 'Lá cây cắt tỉa sân vườn và rác hữu cơ'
  },
  {
    id: 'req_107',
    name: 'Khách sạn Furama Resort Danang',
    type: 'COMMERCIAL',
    category: 'HOTEL',
    address: '105 Võ Nguyên Giáp, P. Khuê Mỹ, Q. Ngũ Hành Sơn, Đà Nẵng',
    lat: 16.0398,
    lng: 108.2472,
    districtId: 'd3',
    wasteAmountKg: 240,
    wasteType: 'GENERAL',
    preferredTime: '13:30',
    status: 'CONFIRMED',
    timeWindow: { start: '13:00', end: '15:00' },
    contactPhone: '0967 890 123',
    notes: 'Cổng kỹ thuật dịch vụ bãi xe phía nam'
  },
  {
    id: 'req_108',
    name: 'Hộ kinh doanh Trà Sữa Phúc Long Đà Nẵng',
    type: 'COMMERCIAL',
    category: 'RESTAURANT',
    address: '59 Nguyễn Văn Linh, P. Phước Ninh, Q. Hải Châu, Đà Nẵng',
    lat: 16.0615,
    lng: 108.2185,
    districtId: 'd1',
    wasteAmountKg: 90,
    wasteType: 'PLASTIC_RECYCLABLE',
    preferredTime: '14:00',
    status: 'CONFIRMED',
    timeWindow: { start: '13:30', end: '15:30' },
    contactPhone: '0978 901 234',
    notes: 'Ly nhựa & bao bì carton đóng kiện'
  }
];

// Truck Fleet Seed (Đà Nẵng license plates)
export const seedTrucks = [
  {
    id: 'TRUCK-01',
    licensePlate: '43C-882.19',
    driverName: 'Nguyễn Văn Hùng',
    driverPhone: '0908 111 222',
    model: 'Hino Dutro 4.5 Tấn',
    capacityKg: 2500,
    currentLoadKg: 545,
    status: 'ACTIVE',
    speedKmH: 28,
    lat: 16.0685,
    lng: 108.2230,
    routeId: 'ROUTE_ALPHA',
    assignedStops: ['req_101', 'req_102', 'req_105', 'req_103'],
    currentStopIndex: 1,
    isDelayed: false,
    delayReason: '',
    originalEta: '10:15',
    currentEta: '10:15',
    fuelLevel: 86
  },
  {
    id: 'TRUCK-02',
    licensePlate: '43D-479.55',
    driverName: 'Trần Minh Đức',
    driverPhone: '0909 333 444',
    model: 'Isuzu Forward 6.0 Tấn',
    capacityKg: 3500,
    currentLoadKg: 515,
    status: 'ACTIVE',
    speedKmH: 25,
    lat: 16.0590,
    lng: 108.2380,
    routeId: 'ROUTE_BETA',
    assignedStops: ['req_104', 'req_108', 'req_106', 'req_107'],
    currentStopIndex: 0,
    isDelayed: true,
    delayReason: 'Ùn tắc cục bộ đường Nguyễn Văn Linh - Dời thu gom sang 14:30',
    originalEta: '13:30',
    currentEta: '14:30',
    fuelLevel: 74
  }
];

// Registration Time Window Seed (US5)
export const seedRegistrationWindow = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '14:00',
  collectionDate: new Date().toISOString().split('T')[0],
  announcement: 'Hệ thống đang mở cổng tiếp nhận nhu cầu thu gom rác hôm nay tại TP. Đà Nẵng từ 09:00 đến 14:00. Vui lòng cập nhật trạng thái của bạn để AI tối ưu hóa lộ trình xe!',
  totalRegistrationsToday: 8,
  totalWeightExpectedKg: 1495
};
