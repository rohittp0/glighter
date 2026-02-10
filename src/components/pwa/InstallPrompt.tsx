import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/Button';

export function InstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => localStorage.getItem('pwa-install-dismissed') === 'true');

  useEffect(() => {
    if (isDismissed) {
      return;
    }

    if (isInstallable && !isInstalled) {
      const timer = window.setTimeout(() => setShowPrompt(true), 4500);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isDismissed]);

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
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up md:left-auto md:w-[380px]">
      <div className="relative rounded-3xl border border-white/60 bg-white/94 p-5 shadow-[0_18px_45px_rgba(5,35,76,0.23)] backdrop-blur-md">
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-slate-900">
            Install Glighter
          </h3>
          <p className="mb-4 text-sm text-slate-600">
            Save Glighter to your home screen for faster launches and offline map access.
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1"
              size="sm"
            >
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
