export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  creditLimit: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  color: string;
  material: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  unit: string; // meters, yards, etc.
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: 'cash' | 'bank' | 'credit';
  saleDate: Date;
  dueDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export interface Purchase {
  id: string;
  supplierName: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: 'cash' | 'bank' | 'credit';
  purchaseDate: Date;
  dueDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export interface LedgerEntry {
  id: string;
  date: Date;
  type: 'sale' | 'purchase' | 'payment' | 'receipt' | 'adjustment';
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string; // sale/purchase ID or payment reference
  customerId?: string;
  customerName?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'cheque';
  paymentDate: Date;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export interface Receipt {
  id: string;
  supplierName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'cheque';
  paymentDate: Date;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  totalCustomers: number;
  totalProducts: number;
  totalReceivables: number;
  totalPayables: number;
  monthlySales: number;
  monthlyPurchases: number;
}

export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  customerId?: string;
  productId?: string;
  type?: 'sales' | 'purchases' | 'payments' | 'receipts';
} 