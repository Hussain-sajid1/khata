import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  BookOpen, 
  BarChart3, 
  Settings,
  Store
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      icon: Home,
      label: 'Dashboard',
      urduLabel: 'ڈیش بورڈ'
    },
    {
      path: '/customers',
      icon: Users,
      label: 'Customers',
      urduLabel: 'گاہک'
    },
    {
      path: '/products',
      icon: Package,
      label: 'Products',
      urduLabel: 'پروڈکٹس'
    },
    {
      path: '/sales',
      icon: ShoppingCart,
      label: 'Sales',
      urduLabel: 'فروخت'
    },
    {
      path: '/purchases',
      icon: Truck,
      label: 'Purchases',
      urduLabel: 'خریداری'
    },
    {
      path: '/ledger',
      icon: BookOpen,
      label: 'Ledger',
      urduLabel: 'لیجر'
    },
    {
      path: '/reports',
      icon: BarChart3,
      label: 'Reports',
      urduLabel: 'رپورٹس'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      urduLabel: 'ترتیبات'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">DAWOOD AB</h1>
            <p className="text-sm text-gray-600 font-urdu">کالیکشنز</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 font-urdu">{item.urduLabel}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">Ledger System</p>
          <p className="text-xs text-gray-400 font-urdu">لیجر سسٹم</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 