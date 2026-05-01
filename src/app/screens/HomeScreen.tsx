import { useNavigate } from 'react-router';
import { ScanBarcode, Clock, Sparkles, Info } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getProducts } from '../services/storage';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function HomeScreen() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(getProducts());
  const recentScans = products.slice(0, 3);

  useEffect(() => {
    // Refresh products when screen is focused
    const handleFocus = () => {
      setProducts(getProducts());
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const getHealthScoreColor = (score: string) => {
    switch (score) {
      case 'healthy':
        return 'bg-[#4CAF50] text-white';
      case 'moderate':
        return 'bg-[#FFA726] text-white';
      case 'unhealthy':
        return 'bg-[#EF5350] text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const getHealthScoreLabel = (score: string) => {
    return score.charAt(0).toUpperCase() + score.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FBF8] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] px-6 pt-12 pb-12 rounded-b-[2rem] shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-white" />
            <h1 className="text-3xl text-white">Scan2Health</h1>
          </div>
          <p className="text-white/90 text-base">Scan. Know. Eat Better.</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8">
        {/* Scan Button Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-[#4CAF50]/10"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#4CAF50]/10 to-[#66BB6A]/20 rounded-full mb-4">
              <ScanBarcode className="w-12 h-12 text-[#4CAF50]" />
            </div>
            <h2 className="text-2xl mb-2">Scan a Food Product</h2>
            <p className="text-gray-500">Point your camera at the barcode</p>
          </div>
          <button
            onClick={() => navigate('/scanner')}
            className="w-full bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Scanning
          </button>
        </motion.div>

        {/* Scanning Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Scanning Tips</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Try popular products like Coca-Cola (barcode: <span className="font-mono bg-blue-100 px-1 rounded">5449000000996</span>), 
                Nutella (barcode: <span className="font-mono bg-blue-100 px-1 rounded">3017620422003</span>), 
                or scan any food product from your pantry!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl">Recent Scans</h3>
              </div>
              <button
                onClick={() => navigate('/history')}
                className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentScans.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  onClick={() => navigate(`/result/${product.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] border border-gray-100"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate mb-1">{product.name}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(product.scannedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-medium ${getHealthScoreColor(
                      product.healthScore
                    )}`}
                  >
                    {getHealthScoreLabel(product.healthScore)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {recentScans.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <ScanBarcode className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl text-gray-600 mb-2">No scans yet</h3>
            <p className="text-gray-500">Scan your first product to get started!</p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}