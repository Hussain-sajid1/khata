import localforage from 'localforage';
import { 
  Customer, 
  Product, 
  Sale, 
  Purchase, 
  LedgerEntry, 
  Payment, 
  Receipt 
} from '../types';

// Configure localforage
localforage.config({
  name: 'dawood-ab-collections-ledger',
  storeName: 'ledger_data'
});

// Storage keys
const STORAGE_KEYS = {
  CUSTOMERS: 'customers',
  PRODUCTS: 'products',
  SALES: 'sales',
  PURCHASES: 'purchases',
  LEDGER_ENTRIES: 'ledger_entries',
  PAYMENTS: 'payments',
  RECEIPTS: 'receipts',
  SETTINGS: 'settings'
};

// Generic storage functions
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      return await localforage.getItem(key);
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await localforage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting data for key ${key}:`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await localforage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await localforage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

// Customer storage functions
export const customerStorage = {
  async getAll(): Promise<Customer[]> {
    const customers = await storage.get<Customer[]>(STORAGE_KEYS.CUSTOMERS);
    return customers || [];
  },

  async save(customer: Customer): Promise<void> {
    const customers = await this.getAll();
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    
    await storage.set(STORAGE_KEYS.CUSTOMERS, customers);
  },

  async delete(id: string): Promise<void> {
    const customers = await this.getAll();
    const filtered = customers.filter(c => c.id !== id);
    await storage.set(STORAGE_KEYS.CUSTOMERS, filtered);
  },

  async getById(id: string): Promise<Customer | null> {
    const customers = await this.getAll();
    return customers.find(c => c.id === id) || null;
  }
};

// Product storage functions
export const productStorage = {
  async getAll(): Promise<Product[]> {
    const products = await storage.get<Product[]>(STORAGE_KEYS.PRODUCTS);
    return products || [];
  },

  async save(product: Product): Promise<void> {
    const products = await this.getAll();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    
    await storage.set(STORAGE_KEYS.PRODUCTS, products);
  },

  async delete(id: string): Promise<void> {
    const products = await this.getAll();
    const filtered = products.filter(p => p.id !== id);
    await storage.set(STORAGE_KEYS.PRODUCTS, filtered);
  },

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find(p => p.id === id) || null;
  },

  async updateStock(id: string, quantity: number): Promise<void> {
    const products = await this.getAll();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex >= 0) {
      products[productIndex].stockQuantity += quantity;
      products[productIndex].updatedAt = new Date();
      await storage.set(STORAGE_KEYS.PRODUCTS, products);
    }
  }
};

// Sale storage functions
export const saleStorage = {
  async getAll(): Promise<Sale[]> {
    const sales = await storage.get<Sale[]>(STORAGE_KEYS.SALES);
    return sales || [];
  },

  async save(sale: Sale): Promise<void> {
    const sales = await this.getAll();
    const existingIndex = sales.findIndex(s => s.id === sale.id);
    
    if (existingIndex >= 0) {
      sales[existingIndex] = sale;
    } else {
      sales.push(sale);
    }
    
    await storage.set(STORAGE_KEYS.SALES, sales);
  },

  async delete(id: string): Promise<void> {
    const sales = await this.getAll();
    const filtered = sales.filter(s => s.id !== id);
    await storage.set(STORAGE_KEYS.SALES, filtered);
  },

  async getById(id: string): Promise<Sale | null> {
    const sales = await this.getAll();
    return sales.find(s => s.id === id) || null;
  }
};

// Purchase storage functions
export const purchaseStorage = {
  async getAll(): Promise<Purchase[]> {
    const purchases = await storage.get<Purchase[]>(STORAGE_KEYS.PURCHASES);
    return purchases || [];
  },

  async save(purchase: Purchase): Promise<void> {
    const purchases = await this.getAll();
    const existingIndex = purchases.findIndex(p => p.id === purchase.id);
    
    if (existingIndex >= 0) {
      purchases[existingIndex] = purchase;
    } else {
      purchases.push(purchase);
    }
    
    await storage.set(STORAGE_KEYS.PURCHASES, purchases);
  },

  async delete(id: string): Promise<void> {
    const purchases = await this.getAll();
    const filtered = purchases.filter(p => p.id !== id);
    await storage.set(STORAGE_KEYS.PURCHASES, filtered);
  },

  async getById(id: string): Promise<Purchase | null> {
    const purchases = await this.getAll();
    return purchases.find(p => p.id === id) || null;
  }
};

// Ledger storage functions
export const ledgerStorage = {
  async getAll(): Promise<LedgerEntry[]> {
    const entries = await storage.get<LedgerEntry[]>(STORAGE_KEYS.LEDGER_ENTRIES);
    return entries || [];
  },

  async save(entry: LedgerEntry): Promise<void> {
    const entries = await this.getAll();
    entries.push(entry);
    await storage.set(STORAGE_KEYS.LEDGER_ENTRIES, entries);
  },

  async getByCustomer(customerId: string): Promise<LedgerEntry[]> {
    const entries = await this.getAll();
    return entries.filter(e => e.customerId === customerId);
  }
};

// Payment storage functions
export const paymentStorage = {
  async getAll(): Promise<Payment[]> {
    const payments = await storage.get<Payment[]>(STORAGE_KEYS.PAYMENTS);
    return payments || [];
  },

  async save(payment: Payment): Promise<void> {
    const payments = await this.getAll();
    payments.push(payment);
    await storage.set(STORAGE_KEYS.PAYMENTS, payments);
  }
};

// Receipt storage functions
export const receiptStorage = {
  async getAll(): Promise<Receipt[]> {
    const receipts = await storage.get<Receipt[]>(STORAGE_KEYS.RECEIPTS);
    return receipts || [];
  },

  async save(receipt: Receipt): Promise<void> {
    const receipts = await this.getAll();
    receipts.push(receipt);
    await storage.set(STORAGE_KEYS.RECEIPTS, receipts);
  }
};

// Settings storage functions
export const settingsStorage = {
  async get(): Promise<any> {
    const settings = await storage.get(STORAGE_KEYS.SETTINGS);
    return settings || {
      storeName: 'DAWOOD AB COLLECTIONS',
      currency: 'PKR',
      language: 'en',
      theme: 'light'
    };
  },

  async save(settings: any): Promise<void> {
    await storage.set(STORAGE_KEYS.SETTINGS, settings);
  }
}; 