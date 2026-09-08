import express from 'express';
export const authRouter = express.Router();

// Mock in-memory user registry
let users = [
  {
    id: 'usr_admin',
    username: 'admin',
    password: '123',
    role: 'ADMIN',
    name: 'Nguyễn Quản Trị (Dispatcher)',
    phone: '0901 000 001',
    district: 'Quận 1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 'usr_driver_1',
    username: 'driver1',
    password: '123',
    role: 'DRIVER',
    name: 'Nguyễn Văn Hùng',
    phone: '0908 111 222',
    assignedTruckId: 'TRUCK-01',
    district: 'Quận 1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'usr_driver_2',
    username: 'driver2',
    password: '123',
    role: 'DRIVER',
    name: 'Trần Minh Đức',
    phone: '0909 333 444',
    assignedTruckId: 'TRUCK-02',
    district: 'Quận 3',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'usr_resident_1',
    username: 'resident',
    password: '123',
    role: 'RESIDENT',
    name: 'Lê Văn Phước (Hộ Dân Cư)',
    phone: '0934 567 890',
    address: '88 Lê Lợi, P. Bến Thành, Quận 1',
    district: 'Quận 1',
    lat: 10.772980,
    lng: 106.699150,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'usr_hotel_1',
    username: 'hotel_rex',
    password: '123',
    role: 'COMMERCIAL',
    name: 'Khách sạn Rex Saigon',
    phone: '0901 234 567',
    address: '141 Nguyễn Huệ, P. Bến Nghé, Quận 1',
    district: 'Quận 1',
    lat: 10.775844,
    lng: 106.702417,
    avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150'
  }
];

// Login (US2)
authRouter.post('/login', (req, res) => {
  const { username, role } = req.body;
  let user = users.find(u => u.username === username);
  if (!user && role) {
    user = users.find(u => u.role === role);
  }
  if (!user) {
    user = users[0]; // fallback to admin
  }
  res.json({ success: true, user });
});

// Register (US1)
authRouter.post('/register', (req, res) => {
  const { username, name, role, phone, address, district, lat, lng } = req.body;
  const newUser = {
    id: `usr_${Date.now()}`,
    username: username || `user_${Date.now().toString().slice(-4)}`,
    role: role || 'RESIDENT',
    name: name || 'Người Dùng Mới',
    phone: phone || '0900 000 000',
    address: address || '100 Lê Duẩn, Quận 1',
    district: district || 'Quận 1',
    lat: lat || 10.7760,
    lng: lng || 106.7000
  };
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

// Update Profile (US4)
authRouter.put('/profile/:id', (req, res) => {
  const { id } = req.params;
  const userIdx = users.findIndex(u => u.id === id);
  if (userIdx !== -1) {
    users[userIdx] = { ...users[userIdx], ...req.body };
    return res.json({ success: true, user: users[userIdx] });
  }
  res.status(404).json({ error: 'User not found' });
});

// Get all users (US3 - Admin permissions list)
authRouter.get('/users', (req, res) => {
  res.json({ success: true, users });
});
