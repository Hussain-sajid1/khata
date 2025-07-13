import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar
} from 'lucide-react';
import { formatCurrency, getCurrentMonthYear, getMonthName } from '../utils/helpers';
import { DashboardStats } from '../types';
import { 
  customerStorage, 
  productStorage, 
  saleStorage, 
  purchaseStorage 
} from '../utils/storage';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalPurchases: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalReceivables: 0,
    totalPayables: 0,
    monthlySales: 0,
    monthlyPurchases: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [customers, products, sales, purchases] = await Promise.all([
        customerStorage.getAll(),
        productStorage.getAll(),
        saleStorage.getAll(),
        purchaseStorage.getAll()
      ]);

      const currentMonth = getCurrentMonthYear();
      const monthlySales = sales.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate.getMonth() + 1 === currentMonth.month && 
               saleDate.getFullYear() === currentMonth.year;
      });

      const monthlyPurchases = purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.purchaseDate);
        return purchaseDate.getMonth() + 1 === currentMonth.month && 
               purchaseDate.getFullYear() === currentMonth.year;
      });

      const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
      const totalReceivables = sales.reduce((sum, sale) => sum + sale.remainingAmount, 0);
      const totalPayables = purchases.reduce((sum, purchase) => sum + purchase.remainingAmount, 0);

      setStats({
        totalSales,
        totalPurchases,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalReceivables,
        totalPayables,
        monthlySales: monthlySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        monthlyPurchases: monthlyPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Sales',
      value: formatCurrency(stats.totalSales),
      icon: ShoppingCart,
      color: 'bg-success-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Purchases',
      value: formatCurrency(stats.totalPurchases),
      icon: Truck,
      color: 'bg-warning-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'bg-primary-500',
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'bg-purple-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Receivables',
      value: formatCurrency(stats.totalReceivables),
      icon: TrendingUp,
      color: 'bg-danger-500',
      change: '+15%',
      changeType: 'negative'
    },
    {
      title: 'Payables',
      value: formatCurrency(stats.totalPayables),
      icon: TrendingDown,
      color: 'bg-orange-500',
      change: '+10%',
      changeType: 'negative'
    }
  ];

  const quickActions = [
    {
      title: 'New Sale',
      description: 'Create a new sale invoice',
      icon: ShoppingCart,
      color: 'bg-success-100 text-success-600',
      href: '/sales'
    },
    {
      title: 'New Purchase',
      description: 'Record a new purchase',
      icon: Truck,
      color: 'bg-warning-100 text-warning-600',
      href: '/purchases'
    },
    {
      title: 'Add Customer',
      description: 'Register a new customer',
      icon: Users,
      color: 'bg-primary-100 text-primary-600',
      href: '/customers'
    },
    {
      title: 'Add Product',
      description: 'Add a new product',
      icon: Package,
      color: 'bg-purple-100 text-purple-600',
      href: '/products'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 font-urdu">ڈیش بورڈ</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{getMonthName(getCurrentMonthYear().month)} {getCurrentMonthYear().year}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
                    )}
                    <span className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-success-600">
                {formatCurrency(stats.monthlySales)}
              </p>
              <p className="text-sm text-gray-600">This month's total sales</p>
            </div>
            <DollarSign className="w-12 h-12 text-success-200" />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Purchases</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-warning-600">
                {formatCurrency(stats.monthlyPurchases)}
              </p>
              <p className="text-sm text-gray-600">This month's total purchases</p>
            </div>
            <Truck className="w-12 h-12 text-warning-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.href}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 