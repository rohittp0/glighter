import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LocationSelectionScreen } from './screens/LocationSelectionScreen';
import { AnimationPreviewScreen } from './screens/AnimationPreviewScreen';
import { VideoPreviewScreen } from './screens/VideoPreviewScreen';
import { InstallPrompt } from './components/pwa/InstallPrompt';

type Screen = 'location-selection' | 'animation-preview' | 'video-preview';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('location-selection');

  // State to hold video data for preview
  const [videoData, setVideoData] = useState<{
    blob: Blob;
    extension: string;
  } | null>(null);

  // Navigation handler for export completion
  const handleExportComplete = (blob: Blob, extension: string) => {
    setVideoData({ blob, extension });
    setCurrentScreen('video-preview');
  };

  const handleVideoPreviewBack = () => {
    // Clean up video data
    setVideoData(null);
    setCurrentScreen('animation-preview');
  };

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
        <AnimationPreviewScreen
          onBack={() => setCurrentScreen('location-selection')}
          onExportComplete={handleExportComplete}
        />
      )}
      {currentScreen === 'video-preview' && videoData && (
        <VideoPreviewScreen
          videoBlob={videoData.blob}
          videoExtension={videoData.extension}
          onBack={handleVideoPreviewBack}
        />
      )}
    </>
  );
}

export default App;
