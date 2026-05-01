import { User, Settings, Heart, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';
import { useState } from 'react';
import { getPreferences, savePreferences, getProducts } from '../services/storage';
import { toast } from 'sonner';

export function ProfileScreen() {
  const [preferences, setPreferences] = useState(getPreferences());
  const products = getProducts();

  const handleToggleRestriction = (restriction: string) => {
    const updated = preferences.dietaryRestrictions.includes(restriction)
      ? preferences.dietaryRestrictions.filter(r => r !== restriction)
      : [...preferences.dietaryRestrictions, restriction];
    
    const newPreferences = { ...preferences, dietaryRestrictions: updated };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    toast.success('Preference updated');
  };

  const handleToggleNotifications = () => {
    const newPreferences = { ...preferences, notifications: !preferences.notifications };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    toast.success(newPreferences.notifications ? 'Notifications enabled' : 'Notifications disabled');
  };

  const dietaryOptions = [
    { id: 'lowSugar', label: 'Low Sugar' },
    { id: 'lowSodium', label: 'Low Sodium' },
    { id: 'highProtein', label: 'High Protein' },
    { id: 'glutenFree', label: 'Gluten Free' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'vegetarian', label: 'Vegetarian' },
  ];

  const settingsItems = [
    { icon: Bell, label: 'Notifications', action: 'notifications', onClick: handleToggleNotifications },
    { icon: Shield, label: 'Privacy & Security', action: 'privacy' },
    { icon: HelpCircle, label: 'Help & Support', action: 'help' },
    { icon: Settings, label: 'App Settings', action: 'settings' },
  ];

  const healthyCount = products.filter(p => p.healthScore === 'healthy').length;
  const totalScans = products.length;

  return (
    <div className="min-h-screen bg-[#F8FBF8] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-[#4CAF50]" />
          </div>
          <div>
            <h1 className="text-2xl text-white mb-1">Health User</h1>
            <p className="text-white/90">health@scan2health.com</p>
          </div>
        </motion.div>
      </div>

      {/* Profile Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-6 -mt-6 mb-6"
      >
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#4CAF50]/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">{totalScans}</p>
              <p className="text-xs text-gray-500 mt-1">Total Scans</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#4CAF50]">{healthyCount}</p>
              <p className="text-xs text-gray-500 mt-1">Healthy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 0}%</p>
              <p className="text-xs text-gray-500 mt-1">Health Score</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Health Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#4CAF50]/10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[#4CAF50]" />
            <h3 className="font-medium">Dietary Preferences</h3>
          </div>
          <div className="space-y-3">
            {dietaryOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="flex items-center justify-between"
              >
                <span className="text-gray-700">{option.label}</span>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences.dietaryRestrictions.includes(option.id)}
                    onChange={() => handleToggleRestriction(option.id)}
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
                </label>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#4CAF50]/10">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF50]/10 to-[#66BB6A]/20 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#4CAF50]" />
                  </div>
                  <span className="text-gray-700">{item.label}</span>
                </div>
                {item.action === 'notifications' ? (
                  <div className={`px-3 py-1 rounded-full text-xs ${preferences.notifications ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {preferences.notifications ? 'On' : 'Off'}
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#4CAF50]/10">
          <h3 className="font-medium mb-3">About Scan2Health</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex justify-between">
              <span>Version</span>
              <span className="font-medium">1.0.0</span>
            </p>
            <p className="flex justify-between">
              <span>Last Updated</span>
              <span className="font-medium">March 2026</span>
            </p>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed">
                Scan2Health helps you make healthier food choices by providing instant nutrition analysis and ingredient information powered by OpenFoodFacts.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
}