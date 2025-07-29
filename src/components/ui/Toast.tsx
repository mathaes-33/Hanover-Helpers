

import React, { useEffect, useState, useRef } from 'react';
import { ToastMessage } from '../../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '../Icons';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: () => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    barClass: 'bg-green-500',
  },
  error: {
    icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
    barClass: 'bg-red-500',
  },
  info: {
    icon: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
    barClass: 'bg-blue-500',
  },
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const exitTimerIdRef = useRef<any>(null);
  const dismissTimerIdRef = useRef<any>(null);

  // Helper to clear both timers to prevent memory leaks
  const cleanupTimers = () => {
    if (exitTimerIdRef.current) {
        window.clearTimeout(exitTimerIdRef.current);
    }
    if (dismissTimerIdRef.current) {
        window.clearTimeout(dismissTimerIdRef.current);
    }
  };

  useEffect(() => {
    // Set a timer to automatically dismiss the toast.
    exitTimerIdRef.current = window.setTimeout(() => {
      setIsExiting(true);
      // After the exit animation starts, set another timer to call the final onDismiss.
      dismissTimerIdRef.current = window.setTimeout(() => onDismiss(), 400);
    }, 4000); // Auto-dismiss after 4 seconds

    // The cleanup function is called when the component unmounts.
    return cleanupTimers;
  }, [onDismiss]);
  
  const handleDismiss = () => {
      // Clear any pending auto-dismiss timers.
      cleanupTimers();
      // Immediately start the exit process.
      setIsExiting(true);
      // This new timer doesn't need to be cleared, as it's the final action.
      window.setTimeout(() => onDismiss(), 400);
  }

  const config = toastConfig[toast.type];

  return (
    <div
      className={`relative flex items-start w-full max-w-sm p-4 bg-white rounded-lg shadow-2xl overflow-hidden ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-slate-900">{toast.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={handleDismiss}
          className="inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
       <div className={`absolute bottom-0 left-0 h-1 ${config.barClass} animate-pulse`}></div>
    </div>
  );
};

export default Toast;