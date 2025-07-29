import React from 'react';
import ReactDOM from 'react-dom';
import { useToast } from '../contexts/ToastContext';
import Toast from './ui/Toast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const portalRoot = document.getElementById('toast-root');

  if (!portalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed bottom-5 right-5 z-[100] w-full max-w-sm space-y-3">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    portalRoot
  );
};

export default ToastContainer;