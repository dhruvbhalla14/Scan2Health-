import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ScanBarcode, Sparkles, Leaf, Apple, Salad } from 'lucide-react';
import { motion } from 'motion/react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4CAF50] via-[#66BB6A] to-[#81C784] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 0.08, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-20 left-10"
      >
        <Apple className="w-24 h-24 text-white" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ opacity: 0.08, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-32 right-10"
      >
        <Salad className="w-28 h-28 text-white" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={{ opacity: 0.08, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-1/3 right-16"
      >
        <Leaf className="w-20 h-20 text-white" />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 150 }}
        className="bg-white rounded-full p-10 shadow-2xl mb-8 relative"
      >
        <ScanBarcode className="w-28 h-28 text-[#4CAF50]" />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-8 h-8 text-[#FFA726]" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-white mb-4">Scan2Health</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl text-white/95 font-light"
        >
          Scan. Know. Eat Better.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-12"
      >
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </motion.div>
    </div>
  );
}