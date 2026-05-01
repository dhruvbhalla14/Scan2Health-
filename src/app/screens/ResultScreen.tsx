import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Flame, Droplet, Beef, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { getProductById } from '../services/storage';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { getProductSuggestions, type AIProductSuggestion } from '../services/geminiApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export function ResultScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIProductSuggestion | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Debug: Log product info
  if (product) {
    console.log('Product loaded:', product.name);
    console.log('Harmful ingredients:', product.harmfulIngredients);
    console.log('Should show AI button:', product.harmfulIngredients.length > 0);
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Product not found</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 text-[#4CAF50]"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const getHealthScoreConfig = (score: string) => {
    switch (score) {
      case 'healthy':
        return {
          color: 'bg-[#4CAF50]',
          textColor: 'text-[#4CAF50]',
          icon: CheckCircle,
          label: 'Healthy',
          message: 'Great choice! This product is good for you.'
        };
      case 'moderate':
        return {
          color: 'bg-[#FFA726]',
          textColor: 'text-[#FFA726]',
          icon: AlertCircle,
          label: 'Moderate',
          message: 'Consume in moderation.'
        };
      case 'unhealthy':
        return {
          color: 'bg-[#EF5350]',
          textColor: 'text-[#EF5350]',
          icon: XCircle,
          label: 'Unhealthy',
          message: 'Consider healthier alternatives.'
        };
      default:
        return {
          color: 'bg-gray-400',
          textColor: 'text-gray-400',
          icon: AlertCircle,
          label: 'Unknown',
          message: ''
        };
    }
  };

  const scoreConfig = getHealthScoreConfig(product.healthScore);
  const ScoreIcon = scoreConfig.icon;

  const handleGetAISuggestions = async () => {
    setLoadingAI(true);
    setShowAISuggestions(true);

    try {
      const suggestions = await getProductSuggestions(
        product.name,
        product.harmfulIngredients
      );

      if (suggestions) {
        setAiSuggestions(suggestions);
      } else {
        toast.error('Failed to get AI suggestions');
        setShowAISuggestions(false);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions');
      setShowAISuggestions(false);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className={`${scoreConfig.color} px-6 pt-12 pb-6 relative`}>
        <button
          onClick={() => navigate('/home')}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <h1 className="text-xl mb-1">Scan Result</h1>
        </motion.div>
      </div>

      {/* Product Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="px-6 -mt-8"
      >
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <h2 className="text-xl font-medium text-center mb-1">{product.name}</h2>
          <p className="text-sm text-gray-500 text-center">Barcode: {product.barcode}</p>
        </div>
      </motion.div>

      {/* Health Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-6 mb-4"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`${scoreConfig.color} p-3 rounded-full`}>
                <ScoreIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Health Score</h3>
                <p className={`text-2xl font-bold ${scoreConfig.textColor}`}>
                  {scoreConfig.label}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">{scoreConfig.message}</p>
        </div>
      </motion.div>

      {/* Nutrition Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="px-6 mb-4"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-medium mb-4">Nutrition Highlights (per serving)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-2">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-xs text-gray-500">Calories</p>
              <p className="font-bold">{product.nutrition.calories}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-2">
                <Droplet className="w-6 h-6 text-pink-500" />
              </div>
              <p className="text-xs text-gray-500">Sugar</p>
              <p className="font-bold">{product.nutrition.sugar}g</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
                <Beef className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500">Protein</p>
              <p className="font-bold">{product.nutrition.protein}g</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ingredient Analysis - Column Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="px-6 mb-4"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-medium mb-4 text-center">Ingredient Analysis</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Good Ingredients Column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                <h4 className="text-sm font-medium text-gray-700">Good</h4>
              </div>
              <div className="space-y-2">
                {product.goodIngredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="bg-gradient-to-br from-[#4CAF50]/10 to-[#66BB6A]/10 border border-[#4CAF50]/20 rounded-xl p-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#4CAF50] rounded-full mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-gray-700 leading-relaxed">{ingredient}</p>
                    </div>
                  </motion.div>
                ))}
                {/* Fill empty slots */}
                {[...Array(Math.max(0, 3 - product.goodIngredients.length))].map((_, i) => (
                  <div key={`empty-good-${i}`} className="bg-gray-50 rounded-xl p-3 opacity-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <p className="text-xs text-gray-400">-</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Harmful Ingredients Column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-[#EF5350]" />
                <h4 className="text-sm font-medium text-gray-700">Bad</h4>
              </div>
              <div className="space-y-2">
                {product.harmfulIngredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="bg-gradient-to-br from-[#EF5350]/10 to-[#F44336]/10 border border-[#EF5350]/20 rounded-xl p-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#EF5350] rounded-full mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-gray-700 leading-relaxed">{ingredient}</p>
                    </div>
                  </motion.div>
                ))}
                {/* Fill empty slots */}
                {[...Array(Math.max(0, 3 - product.harmfulIngredients.length))].map((_, i) => (
                  <div key={`empty-bad-${i}`} className="bg-gray-50 rounded-xl p-3 opacity-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <p className="text-xs text-gray-400">-</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Suggestion Button - Show if product has harmful ingredients */}
      {product.harmfulIngredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="px-6 mb-4"
        >
          <button
            onClick={handleGetAISuggestions}
            disabled={loadingAI}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAI ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Getting AI Suggestions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Get AI Suggestions</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            AI-powered suggestions for healthier alternatives
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="px-6 mb-4"
      >
        <button
          onClick={() => navigate('/scanner')}
          className="w-full bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white py-4 rounded-xl shadow-md"
        >
          Scan Another Product
        </button>
      </motion.div>

      <BottomNav />

      {/* AI Suggestions Dialog */}
      <Dialog open={showAISuggestions} onOpenChange={setShowAISuggestions}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6 text-purple-500" />
              AI Recommendations
            </DialogTitle>
          </DialogHeader>

          {loadingAI ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              <p className="text-gray-500">Analyzing healthier alternatives...</p>
            </div>
          ) : aiSuggestions ? (
            <div className="space-y-6 py-4">
              {/* Better Products */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                  Better Alternatives
                </h3>
                <div className="space-y-2">
                  {aiSuggestions.betterProducts.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-[#4CAF50]/10 to-[#66BB6A]/10 border border-[#4CAF50]/20 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#4CAF50] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{product}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  Why These Are Better
                </h3>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {aiSuggestions.reasoning}
                  </p>
                </div>
              </div>

              {/* Health Tips */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Health Tips
                </h3>
                <div className="space-y-2">
                  {aiSuggestions.healthTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-3"
                    >
                      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* API Key Notice */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-xs text-purple-700">
                  💡 <strong>Note:</strong> Configure your Gemini API key in the code for real AI suggestions. Currently showing demo data.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>Unable to load suggestions. Please try again.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}