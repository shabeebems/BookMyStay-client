import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onCancel}
          >
            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ 
                duration: 0.4, 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
              className="relative w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 -left-4 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 -right-2 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
              </div>

              {/* Main Dialog */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-orange-600/5 to-pink-600/5"></div>
                
                {/* Content */}
                <div className="relative z-10 p-8">
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 
                      border border-slate-700/50 transition-all duration-200 group"
                  >
                    <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </motion.button>

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                      className="relative"
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-75 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full shadow-xl">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-center mb-4"
                  >
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                      {title}
                    </h2>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-center mb-8"
                  >
                    <p className="text-slate-300 text-lg leading-relaxed">
                      {message}
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex gap-4 justify-center"
                  >
                    {/* Cancel Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onCancel}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                        bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/50
                        text-slate-300 hover:text-white transition-all duration-300 shadow-lg
                        backdrop-blur-sm group min-w-[120px] justify-center"
                    >
                      <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Cancel
                    </motion.button>

                    {/* Confirm Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onConfirm}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                        bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400
                        text-white transition-all duration-300 shadow-xl hover:shadow-2xl
                        group min-w-[120px] justify-center relative overflow-hidden"
                    >
                      {/* Button glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                      
                      <Check className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
                      <span className="relative z-10">Confirm</span>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;