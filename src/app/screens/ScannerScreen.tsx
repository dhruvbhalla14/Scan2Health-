import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { X, Zap, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { fetchProductByBarcode } from '../services/foodApi';
import { saveProduct } from '../services/storage';
import { toast } from 'sonner';

export function ScannerScreen() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    startScanning();

    return () => {
      stopScanning();
    };
  }, [facingMode]);

  const startScanning = async () => {
    try {
      setError(null);
      setScanning(true);

      // Initialize the barcode reader
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Get video devices
      const videoInputDevices = await codeReader.listVideoInputDevices();
      setAvailableCameras(videoInputDevices);
      
      if (videoInputDevices.length === 0) {
        setError('No camera found on this device');
        return;
      }

      // Find the back camera (environment) or front camera based on facingMode
      let selectedDeviceId = videoInputDevices[0].deviceId;
      
      // Try to find camera matching the facing mode
      const preferredCamera = videoInputDevices.find((device) => {
        const label = device.label.toLowerCase();
        if (facingMode === 'environment') {
          return label.includes('back') || label.includes('rear') || label.includes('environment');
        } else {
          return label.includes('front') || label.includes('user') || label.includes('face');
        }
      });

      if (preferredCamera) {
        selectedDeviceId = preferredCamera.deviceId;
      } else if (facingMode === 'environment' && videoInputDevices.length > 1) {
        // If we can't find by label, assume last camera is back camera on mobile
        selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
      }

      // Start decoding from video device
      await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        async (result, error) => {
          if (result) {
            // Barcode detected
            const barcode = result.getText();
            console.log('Scanned barcode:', barcode);
            
            // Stop scanning and fetch product
            stopScanning();
            await handleBarcodeScanned(barcode);
          }

          if (error && !(error instanceof NotFoundException)) {
            console.error('Scanning error:', error);
          }
        }
      );
    } catch (err) {
      console.error('Failed to start camera:', err);
      setError('Failed to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setScanning(false);
  };

  const toggleCamera = () => {
    stopScanning();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleBarcodeScanned = async (barcode: string) => {
    setLoading(true);
    const toastId = toast.loading('Fetching product information...');

    try {
      const product = await fetchProductByBarcode(barcode);

      if (product) {
        // Save to localStorage
        saveProduct(product);
        toast.dismiss(toastId);
        toast.success('Product found!');
        
        // Navigate to result screen
        setTimeout(() => {
          navigate(`/result/${product.id}`);
        }, 500);
      } else {
        toast.dismiss(toastId);
        toast.error('Product not found in database');
        setError('Product not found. Try another barcode.');
        setLoading(false);
        
        // Restart scanning after 2 seconds
        setTimeout(() => {
          setError(null);
          startScanning();
        }, 2000);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      toast.dismiss(toastId);
      toast.error('Failed to fetch product information');
      setError('Failed to fetch product. Please try again.');
      setLoading(false);
      
      // Restart scanning after 2 seconds
      setTimeout(() => {
        setError(null);
        startScanning();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Camera View */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Header Buttons */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Camera Flip Button - only show if multiple cameras available */}
        {availableCameras.length > 1 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={toggleCamera}
            className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* Scanner Frame */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="relative w-full max-w-sm">
          {/* Instruction Text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-white text-lg mb-2">Align barcode within the frame</p>
            <div className="flex items-center justify-center gap-2 text-[#4CAF50]">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Scanning...</span>
            </div>
          </motion.div>

          {/* Barcode Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[4/3] border-2 border-white/50 rounded-2xl overflow-hidden"
          >
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#4CAF50] rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#4CAF50] rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#4CAF50] rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#4CAF50] rounded-br-2xl" />

            {/* Scanning Line Animation */}
            {scanning && (
              <motion.div
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4CAF50] to-transparent shadow-lg shadow-[#4CAF50]/50"
              />
            )}

            {/* Barcode Guide Lines */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-2 bg-white/20 rounded"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-white/70 text-sm">
              Make sure the barcode is well lit and in focus
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scanning Progress Indicator */}
      {scanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-12 left-0 right-0 flex justify-center"
        >
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-white text-sm">Processing barcode...</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-12 left-0 right-0 flex justify-center"
        >
          <div className="bg-red-500/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}