import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export function InstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      toast.success('App installed successfully!');
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || isDismissed || isInstalled) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl p-6 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            Install Glighter
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Install our app for quick access and offline features
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
