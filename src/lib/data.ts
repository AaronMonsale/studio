import type { EmployeeAccount, Order, RevenueData, SalesData, StaffProfile, Transaction } from './types';

// For demo purposes, admin credentials can be "stored" here.
// In a real app, this should come from a secure source and be hashed.
export const ADMIN_CREDENTIALS = {
  email: 'admin@swiftpos.com',
  password: 'admin',
  name: 'Admin User',
  id: 'admin-01'
};

export const KITCHEN_CREDENTIALS = {
    password: 'kitchen',
    name: 'Kitchen Display',
    id: 'kds-01'
}

export const staffProfiles: StaffProfile[] = [
    { id: 'staff-101', name: 'Jane Doe', pin: '1234' },
    { id: 'staff-102', name: 'John Smith', pin: '5678' },
    { id: 'staff-201', name: 'Emily White', pin: '1111' },
    { id: 'staff-202', name: 'Michael Brown', pin: '2222' },
];


export const employeeAccounts: EmployeeAccount[] = [
    {
        id: 'emp-acc-1',
        accountName: 'Morning Shift Team',
        staff: [staffProfiles[0], staffProfiles[1]]
    },
    {
        id: 'emp-acc-2',
        accountName: 'Evening Shift Team',
        staff: [staffProfiles[2], staffProfiles[3]]
    }
];

export const transactions: Transaction[] = [
  { id: 'TXN745', date: '2024-07-22T10:30:00Z', customerName: 'Alex Johnson', amount: 45.50, status: 'Completed', staffName: 'Jane Doe' },
  { id: 'TXN746', date: '2024-07-22T10:35:00Z', customerName: 'Maria Garcia', amount: 22.00, status: 'Completed', staffName: 'Jane Doe' },
  { id: 'TXN747', date: '2024-07-22T11:05:00Z', customerName: 'David Smith', amount: 89.90, status: 'Completed', staffName: 'John Smith' },
  { id: 'TXN748', date: '2024-07-22T11:15:00Z', customerName: 'Sophie Williams', amount: 12.75, status: 'Completed', staffName: 'John Smith' },
  { id: 'TXN749', date: '2024-07-22T12:00:00Z', customerName: 'Chen Wei', amount: 33.20, status: 'Completed', staffName: 'Jane Doe' },
  { id: 'TXN750', date: '2024-07-22T12:45:00Z', customerName: 'Fatima Al-Sayed', amount: 55.00, status: 'Completed', staffName: 'John Smith' },
  { id: 'TXN751', date: '2024-07-23T09:20:00Z', customerName: 'Chris Lee', amount: 19.80, status: 'Completed', staffName: 'Emily White' },
  { id: 'TXN752', date: '2024-07-23T09:45:00Z', customerName: 'Olivia Martinez', amount: 76.15, status: 'Completed', staffName: 'Michael Brown' },
  { id: 'TXN753', date: '2024-07-23T10:10:00Z', customerName: 'Ben Carter', amount: 7.50, status: 'Pending', staffName: 'Emily White' },
  { id: 'TXN754', date: '2024-07-23T10:50:00Z', customerName: 'Isabella Rossi', amount: 42.90, status: 'Completed', staffName: 'Michael Brown' },
];

export const salesData: SalesData[] = [
    { name: 'Mon', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Tue', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Wed', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Thu', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Fri', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Sat', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Sun', total: Math.floor(Math.random() * 5000) + 1000 },
];

export const kitchenOrders: Order[] = [
    {
        id: 'ORD-001',
        table: 5,
        items: [
            { name: 'Classic Burger', quantity: 2 },
            { name: 'Fries', quantity: 1 },
            { name: 'Coke', quantity: 2 },
        ],
        status: 'New',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
        id: 'ORD-002',
        table: 12,
        items: [
            { name: 'Caesar Salad', quantity: 1 },
            { name: 'Iced Tea', quantity: 1 },
        ],
        status: 'Preparing',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        id: 'ORD-003',
        table: 8,
        items: [
            { name: 'Margherita Pizza', quantity: 1 },
        ],
        status: 'New',
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    },
    {
        id: 'ORD-004',
        table: 3,
        items: [
            { name: 'Steak Frites', quantity: 1 },
            { name: 'Red Wine', quantity: 1 },
        ],
        status: 'Ready',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
];

// Revenue data for charts
export const dailyRevenue: RevenueData[] = Array.from({ length: 24 }, (_, i) => ({
  name: `${i}:00`,
  revenue: Math.floor(Math.random() * 200) + 50,
}));

export const weeklyRevenue: RevenueData[] = [
  { name: 'Mon', revenue: Math.floor(Math.random() * 3000) + 1000 },
  { name: 'Tue', revenue: Math.floor(Math.random() * 3000) + 1000 },
  { name: 'Wed', revenue: Math.floor(Math.random() * 3000) + 1000 },
  { name: 'Thu', revenue: Math.floor(Math.random() * 3000) + 1000 },
  { name: 'Fri', revenue: Math.floor(Math.random() * 3000) + 1000 },
  { name: 'Sat', revenue: Math.floor(Math.random() * 3000) + 1000 },
  { name: 'Sun', revenue: Math.floor(Math.random() * 3000) + 1000 },
];

export const monthlyRevenue: RevenueData[] = Array.from({ length: 30 }, (_, i) => ({
  name: `Day ${i + 1}`,
  revenue: Math.floor(Math.random() * 5000) + 2000,
}));

export const annualRevenue: RevenueData[] = [
  { name: 'Jan', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Feb', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Mar', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Apr', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'May', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Jun', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Jul', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Aug', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Sep', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Oct', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Nov', revenue: Math.floor(Math.random() * 50000) + 20000 },
  { name: 'Dec', revenue: Math.floor(Math.random() * 50000) + 20000 },
];

// Helper functions to interact with data
export const findStaffByPin = (pin: string): StaffProfile | undefined => {
    return staffProfiles.find(staff => staff.pin === pin);
};
