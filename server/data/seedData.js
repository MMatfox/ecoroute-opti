// Initial seed dataset for EcoRoute Opti

export const seedDistricts = [
  { id: 'd1', name: 'Quận 1 - Bến Nghé / Bến Thành', city: 'TP. Hồ Chí Minh', dailyAvgKg: 4200, activeHouseholds: 320 },
  { id: 'd2', name: 'Quận 3 - Võ Thị Sáu / Đa Kao', city: 'TP. Hồ Chí Minh', dailyAvgKg: 3100, activeHouseholds: 240 },
  { id: 'd3', name: 'Quận 5 - Chợ Lớn / An Đông', city: 'TP. Hồ Chí Minh', dailyAvgKg: 3800, activeHouseholds: 290 },
  { id: 'd4', name: 'Quận Bình Thạnh - Thị Nghè / Hàng Xanh', city: 'TP. Hồ Chí Minh', dailyAvgKg: 5100, activeHouseholds: 410 },
  { id: 'd5', name: 'Quận 7 - Tân Phong / Phú Mỹ Hưng', city: 'TP. Hồ Chí Minh', dailyAvgKg: 2900, activeHouseholds: 210 }
];

// Depot (Waste Treatment & Dispatch Center)
export const seedDepot = {
  id: 'depot_main',
  name: 'Trạm Trung Chuyển & Xử Lý Rác Trung Tâm (EcoDepot)',
  lat: 10.776889,
  lng: 106.700806,
  address: 'Khu Công Nghiệp & Xử Lý Đô Thị, Quận 1',
  type: 'DEPOT'
};

// Seed Collection Points (Citizens, Restaurants, Hotels, Residential Zones)
export const seedPoints = [
  {
    id: 'req_101',
    name: 'Khách sạn Rex Saigon (Khu dịch vụ)',
    type: 'COMMERCIAL',
    category: 'HOTEL',
    address: '141 Nguyễn Huệ, P. Bến Nghé, Quận 1',
    lat: 10.775844,
    lng: 106.702417,
    districtId: 'd1',
    wasteAmountKg: 180,
    wasteType: 'ORGANIC_GENERAL',
    preferredTime: '09:30',
    status: 'CONFIRMED', // CONFIRMED, COLLECTED, SKIPPED
    timeWindow: { start: '09:00', end: '11:00' },
    contactPhone: '0901 234 567',
    notes: 'Rác hữu cơ nhà hàng & rác tái chế'
  },
  {
    id: 'req_102',
    name: 'Chung cư 42 Nguyễn Huệ (Hộ dân cư)',
    type: 'RESIDENTIAL',
    category: 'APARTMENT',
    address: '42 Nguyễn Huệ, P. Bến Nghé, Quận 1',
    lat: 10.774512,
    lng: 106.704289,
    districtId: 'd1',
    wasteAmountKg: 95,
    wasteType: 'RECYCLABLE',
    preferredTime: '10:00',
    status: 'CONFIRMED',
    timeWindow: { start: '09:30', end: '11:30' },
    contactPhone: '0912 345 678',
    notes: 'Gom tại sảnh tầng B1'
  },
  {
    id: 'req_103',
    name: 'Nhà hàng Ngon Restaurant (Khu dịch vụ)',
    type: 'COMMERCIAL',
    category: 'RESTAURANT',
    address: '160 Pasteur, P. Bến Nghé, Quận 1',
    lat: 10.778125,
    lng: 106.698711,
    districtId: 'd1',
    wasteAmountKg: 240,
    wasteType: 'ORGANIC',
    preferredTime: '10:30',
    status: 'CONFIRMED',
    timeWindow: { start: '10:00', end: '12:00' },
    contactPhone: '0923 456 789',
    notes: 'Thực phẩm thừa cần chuyển thùng chuyên dụng'
  },
  {
    id: 'req_104',
    name: 'Hộ gia đình Lê Văn Phước',
    type: 'RESIDENTIAL',
    category: 'HOUSE',
    address: '88 Lê Lợi, P. Bến Thành, Quận 1',
    lat: 10.772980,
    lng: 106.699150,
    districtId: 'd1',
    wasteAmountKg: 40,
    wasteType: 'GENERAL',
    preferredTime: '11:00',
    status: 'CONFIRMED',
    timeWindow: { start: '10:30', end: '12:30' },
    contactPhone: '0934 567 890',
    notes: '2 túi rác sinh hoạt trước cửa'
  },
  {
    id: 'req_105',
    name: 'Trung tâm Thương mại Vincom Center',
    type: 'COMMERCIAL',
    category: 'MALL',
    address: '72 Lê Thánh Tôn, P. Bến Nghé, Quận 1',
    lat: 10.778210,
    lng: 106.702110,
    districtId: 'd1',
    wasteAmountKg: 350,
    wasteType: 'BULKY_RECYCLABLE',
    preferredTime: '11:30',
    status: 'CONFIRMED',
    timeWindow: { start: '11:00', end: '13:00' },
    contactPhone: '0945 678 901',
    notes: 'Khu vực loading bay sau tòa nhà'
  },
  {
    id: 'req_106',
    name: 'Khu biệt thự Pasteur Villa',
    type: 'RESIDENTIAL',
    category: 'RESIDENTIAL_AREA',
    address: '220 Pasteur, P. Võ Thị Sáu, Quận 3',
    lat: 10.785420,
    lng: 106.693110,
    districtId: 'd2',
    wasteAmountKg: 130,
    wasteType: 'GARDEN_ORGANIC',
    preferredTime: '13:00',
    status: 'CONFIRMED',
    timeWindow: { start: '12:30', end: '14:30' },
    contactPhone: '0956 789 012',
    notes: 'Lá cây cắt tỉa và rác sinh hoạt'
  },
  {
    id: 'req_107',
    name: 'Khách sạn Novotel Saigon Centre',
    type: 'COMMERCIAL',
    category: 'HOTEL',
    address: '167 Hai Bà Trưng, P. 6, Quận 3',
    lat: 10.783150,
    lng: 106.696800,
    districtId: 'd2',
    wasteAmountKg: 210,
    wasteType: 'GENERAL',
    preferredTime: '13:30',
    status: 'CONFIRMED',
    timeWindow: { start: '13:00', end: '15:00' },
    contactPhone: '0967 890 123',
    notes: 'Khu kỹ thuật rác tầng hầm'
  },
  {
    id: 'req_108',
    name: 'Hộ kinh doanh Trà Sữa Phúc Long',
    type: 'COMMERCIAL',
    category: 'RESTAURANT',
    address: '325 Lý Tự Trọng, P. Bến Thành, Quận 1',
    lat: 10.771200,
    lng: 106.694800,
    districtId: 'd1',
    wasteAmountKg: 85,
    wasteType: 'PLASTIC_RECYCLABLE',
    preferredTime: '14:00',
    status: 'CONFIRMED',
    timeWindow: { start: '13:30', end: '15:30' },
    contactPhone: '0978 901 234',
    notes: 'Ly nhựa & bao bì đóng kiện'
  }
];

// Truck Fleet Seed
export const seedTrucks = [
  {
    id: 'TRUCK-01',
    licensePlate: '51C-882.19',
    driverName: 'Nguyễn Văn Hùng',
    driverPhone: '0908 111 222',
    model: 'Hino Dutro 4.5 Tấn',
    capacityKg: 2500,
    currentLoadKg: 515,
    status: 'ACTIVE', // ACTIVE, IDLE, MAINTENANCE, DELAYED
    speedKmH: 28,
    lat: 10.7765,
    lng: 106.7012,
    routeId: 'ROUTE_ALPHA',
    assignedStops: ['req_101', 'req_102', 'req_105', 'req_103'],
    currentStopIndex: 1,
    isDelayed: false,
    delayReason: '',
    originalEta: '10:15',
    currentEta: '10:15',
    fuelLevel: 84
  },
  {
    id: 'TRUCK-02',
    licensePlate: '51D-479.55',
    driverName: 'Trần Minh Đức',
    driverPhone: '0909 333 444',
    model: 'Isuzu Forward 6.0 Tấn',
    capacityKg: 3500,
    currentLoadKg: 465,
    status: 'ACTIVE',
    speedKmH: 24,
    lat: 10.7812,
    lng: 106.6954,
    routeId: 'ROUTE_BETA',
    assignedStops: ['req_104', 'req_108', 'req_106', 'req_107'],
    currentStopIndex: 0,
    isDelayed: true,
    delayReason: 'Ùn tắc cục bộ đường Pasteur - Dời thu gom sang 14:30',
    originalEta: '13:30',
    currentEta: '14:30',
    fuelLevel: 72
  }
];

// Registration Time Window Seed (US5)
export const seedRegistrationWindow = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '14:00',
  collectionDate: new Date().toISOString().split('T')[0],
  announcement: 'Hệ thống đang mở cổng tiếp nhận nhu cầu thu gom rác hôm nay từ 09:00 đến 14:00. Vui lòng cập nhật trạng thái của bạn để AI tối ưu hóa lộ trình xe!',
  totalRegistrationsToday: 8,
  totalWeightExpectedKg: 1395
};
