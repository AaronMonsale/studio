export type Transaction = {
  id: string;
  date: string;
  customerName: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  staffName: string;
};

export type StaffProfile = {
  id: string;
  name: string;
  pin: string;
};

export type EmployeeAccount = {
  id: string;
  accountName: string;
  staff: StaffProfile[];
};

export type OrderItem = {
  name: string;
  quantity: number;
};

export type Order = {
    id: string;
    table: number;
    items: OrderItem[];
    status: 'New' | 'Preparing' | 'Ready';
    timestamp: string;
};

export type SalesData = {
    name: string;
    total: number;
};

export type UserSession = {
  isLoggedIn: boolean;
  userType: 'admin' | 'staff' | 'kitchen';
  name: string;
  id: string;
};
