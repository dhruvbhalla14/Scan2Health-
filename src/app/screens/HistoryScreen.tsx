import { useNavigate } from 'react-router';
import { History, CheckCircle, AlertCircle, XCircle, Search, Trash2 } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getProducts, deleteProduct, clearAllProducts } from '../services/storage';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function HistoryScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(getProducts());

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProduct(id);
    setProducts(getProducts());
    toast.success('Product removed from history');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all scan history?')) {
      clearAllProducts();
      setProducts([]);
      toast.success('History cleared');
    }
  };

  const getHealthScoreIcon = (score: string) => {
    switch (score) {
      case 'healthy':
        return { Icon: CheckCircle, color: 'text-[#4CAF50]', bg: 'bg-[#4CAF50]' };
      case 'moderate':
        return { Icon: AlertCircle, color: 'text-[#FFA726]', bg: 'bg-[#FFA726]' };
      case 'unhealthy':
        return { Icon: XCircle, color: 'text-[#EF5350]', bg: 'bg-[#EF5350]' };
      default:
        return { Icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-400' };
    }
  };

  const getHealthScoreLabel = (score: string) => {
    return score.charAt(0).toUpperCase() + score.slice(1);
  };

  const groupedByDate = filteredProducts.reduce((acc, product) => {
    const date = new Date(product.scannedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div className="min-h-screen bg-[#F8FBF8] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <History className="w-8 h-8 text-white" />
              <h1 className="text-3xl text-white">Scan History</h1>
            </div>
            {products.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-white/90 hover:text-white text-sm transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-white/90">All your scanned products</p>
        </motion.div>
      </div>

      {/* Search Bar */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="px-6 -mt-4 mb-6"
        >
          <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-[#4CAF50]/10">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <History className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl text-gray-600 mb-3">No scan history yet</h3>
          <p className="text-gray-500 mb-8">Your scanned products will appear here</p>
          <button
            onClick={() => navigate('/scanner')}
            className="bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Scan Your First Product
          </button>
        </motion.div>
      )}

      {/* History List */}
      {products.length > 0 && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products match your search</p>
        </div>
      )}

      {products.length > 0 && filteredProducts.length > 0 && (
        <div className="px-6 space-y-6">
          {Object.entries(groupedByDate).map(([date, dateProducts], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + groupIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
              <div className="space-y-3">
                {dateProducts.map((product, productIndex) => {
                  const scoreConfig = getHealthScoreIcon(product.healthScore);
                  const ScoreIcon = scoreConfig.Icon;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + productIndex * 0.05 }}
                      onClick={() => navigate(`/result/${product.id}`)}
                      className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all border border-gray-100 group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <ScoreIcon className={`w-4 h-4 ${scoreConfig.color}`} />
                          <span className="text-sm text-gray-600">
                            {getHealthScoreLabel(product.healthScore)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(product.scannedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteProduct(product.id, e)}
                        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className={`w-1 h-12 ${scoreConfig.bg} rounded-full`} />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="px-6 mt-6"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#4CAF50]/10">
            <h3 className="font-medium mb-4">Quick Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#4CAF50]">
                  {products.filter(p => p.healthScore === 'healthy').length}
                </p>
                <p className="text-xs text-gray-500">Healthy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FFA726]">
                  {products.filter(p => p.healthScore === 'moderate').length}
                </p>
                <p className="text-xs text-gray-500">Moderate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#EF5350]">
                  {products.filter(p => p.healthScore === 'unhealthy').length}
                </p>
                <p className="text-xs text-gray-500">Unhealthy</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}