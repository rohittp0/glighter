import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LocationSelectionScreen } from './screens/LocationSelectionScreen';
import { TemplateSelectionScreen } from './screens/TemplateSelectionScreen';
import { AnimationPreviewScreen } from './screens/AnimationPreviewScreen';
import { VideoPreviewScreen } from './screens/VideoPreviewScreen';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import type { VideoExportResult } from './types/video.types';

type AppStep = 'locations' | 'templates' | 'preview' | 'video-preview';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('locations');
  const [videoData, setVideoData] = useState<VideoExportResult | null>(null);

  const handleExportComplete = (result: VideoExportResult) => {
    setVideoData(result);
    setCurrentStep('video-preview');
  };

  const handleBackFromResult = () => {
    setVideoData(null);
    setCurrentStep('preview');
  };

  const handleBackToLocations = () => {
    setCurrentStep('locations');
  };

  const handleBackToTemplates = () => {
    setCurrentStep('templates');
  };

  const handleGoToTemplates = () => {
    setCurrentStep('templates');
  };

  const handleGoToPreview = () => {
    setCurrentStep('preview');
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#08294b',
            color: '#fff',
            borderRadius: '14px',
          },
          success: {
            iconTheme: {
              primary: '#0ea5e9',
              secondary: '#fff',
            },
          },
        }}
      />

      <InstallPrompt />

      {currentStep === 'locations' && (
        <LocationSelectionScreen onNext={handleGoToTemplates} />
      )}
      {currentStep === 'templates' && (
        <TemplateSelectionScreen
          onBack={handleBackToLocations}
          onNext={handleGoToPreview}
        />
      )}
      {currentStep === 'preview' && (
        <AnimationPreviewScreen
          onBack={handleBackToTemplates}
          onExportComplete={handleExportComplete}
        />
      )}
      {currentStep === 'video-preview' && videoData && (
        <VideoPreviewScreen
          video={videoData}
          onBack={handleBackFromResult}
        />
      )}
    </>
  );
}

export default App;
