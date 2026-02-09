import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LocationSelectionScreen } from './screens/LocationSelectionScreen';
import { AnimationPreviewScreen } from './screens/AnimationPreviewScreen';
import { InstallPrompt } from './components/pwa/InstallPrompt';

type Screen = 'location-selection' | 'animation-preview';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('location-selection');

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A1A1A',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#FF6B35',
              secondary: '#fff',
            },
          },
        }}
      />

      <InstallPrompt />

      {currentScreen === 'location-selection' && (
        <LocationSelectionScreen onNext={() => setCurrentScreen('animation-preview')} />
      )}
      {currentScreen === 'animation-preview' && (
        <AnimationPreviewScreen onBack={() => setCurrentScreen('location-selection')} />
      )}
    </>
  );
}

export default App;
