import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Trash2, ShoppingCart } from 'lucide-react';
import { Sale, Customer, Product } from '../types';
import { saleStorage, customerStorage, productStorage } from '../utils/storage';
import { formatCurrency, generateId, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    paidAmount: 0,
    paymentMethod: 'cash' as const,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, customersData, productsData] = await Promise.all([
        saleStorage.getAll(),
        customerStorage.getAll(),
        productStorage.getAll()
      ]);
      setSales(salesData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || formData.items.length === 0) {
      toast.error('Customer and items are required');
      return;
    }

    try {
      const customer = customers.find(c => c.id === formData.customerId);
      if (!customer) {
        toast.error('Customer not found');
        return;
      }

      const saleItems = formData.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          id: generateId(),
          productId: item.productId,
          productName: product?.name || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          unit: product?.unit || 'meters'
        };
      });

      const totalAmount = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const remainingAmount = Math.max(0, totalAmount - formData.paidAmount);

      const sale: Sale = {
        id: generateId(),
        customerId: formData.customerId,
        customerName: customer.name,
        items: saleItems,
        totalAmount,
        paidAmount: formData.paidAmount,
        remainingAmount,
        paymentMethod: formData.paymentMethod,
        saleDate: new Date(),
        notes: formData.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await saleStorage.save(sale);
      
      // Update customer balance
      customer.currentBalance += remainingAmount;
      await customerStorage.save(customer);
      
      // Update product stock
      for (const item of saleItems) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          await productStorage.updateStock(item.productId, -item.quantity);
        }
      }

      await loadData();
      setShowForm(false);
      resetForm();
      toast.success('Sale created successfully');
    } catch (error) {
      toast.error('Error creating sale');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill unit price when product is selected
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unitPrice = product.price;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await saleStorage.delete(id);
        await loadData();
        toast.success('Sale deleted successfully');
      } catch (error) {
        toast.error('Error deleting sale');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
      paidAmount: 0,
      paymentMethod: 'cash',
      notes: ''
    });
  };

  const filteredSales = sales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600 font-urdu">فروخت</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Sale</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Sale Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">New Sale</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer *
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                    className="input-field"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Items *</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-primary-600 hover:text-primary-800 text-sm"
                  >
                    + Add Item
                  </button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 mb-2">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.color} ({product.stockQuantity} {product.unit})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="input-field"
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      className="input-field"
                      min="0"
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </span>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-danger-600 hover:text-danger-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))}
                    className="input-field bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({...formData, paidAmount: Number(e.target.value)})}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Sale
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Sale ID</th>
              <th className="table-header-cell">Customer</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Total Amount</th>
              <th className="table-header-cell">Paid Amount</th>
              <th className="table-header-cell">Remaining</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="table-row">
                <td className="table-cell font-mono text-sm">{sale.id}</td>
                <td className="table-cell">
                  <div className="font-medium text-gray-900">{sale.customerName}</div>
                  <div className="text-sm text-gray-500">{sale.items.length} items</div>
                </td>
                <td className="table-cell">{formatDate(sale.saleDate)}</td>
                <td className="table-cell font-medium">{formatCurrency(sale.totalAmount)}</td>
                <td className="table-cell">{formatCurrency(sale.paidAmount)}</td>
                <td className="table-cell">
                  <span className={`font-medium ${
                    sale.remainingAmount > 0 ? 'text-danger-600' : 'text-success-600'
                  }`}>
                    {formatCurrency(sale.remainingAmount)}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-800">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-danger-600 hover:text-danger-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No sales found</p>
        </div>
      )}
    </div>
  );
};

export default Sales; 