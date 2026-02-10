import { useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';

interface VideoPreviewScreenProps {
  videoBlob: Blob;
  videoExtension: string;
  onBack: () => void;
}

export function VideoPreviewScreen({ videoBlob, videoExtension, onBack }: VideoPreviewScreenProps) {
  // Create object URL using useMemo to avoid recreating on every render
  const videoUrl = useMemo(() => URL.createObjectURL(videoBlob), [videoBlob]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleDownload = () => {
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glighter-${Date.now()}.${videoExtension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Video downloaded!');
  };

  const handleShare = async () => {
    // Create File from Blob for sharing
    const file = new File(
      [videoBlob],
      `glighter-${Date.now()}.${videoExtension}`,
      { type: videoBlob.type }
    );

    // Check if Web Share API is supported and can share files
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Glighter Animation',
          text: 'Check out my map animation!',
          files: [file],
        });
        toast.success('Video shared!');
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
          toast.error('Failed to share video');
        }
      }
    } else {
      // Fallback: trigger download if share not supported
      toast.error('Sharing not supported on this device. Downloading instead...');
      handleDownload();
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header with back button */}
      <div className="px-4 py-2 bg-white shadow-sm z-10 flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-xl p-1 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="m-0 text-lg font-bold text-gray-900">Your Video</h1>
      </div>

      {/* Video preview - takes remaining space */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-2xl">
          {videoUrl && (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-auto max-h-[60vh] bg-black rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Action buttons - fixed at bottom */}
      <div className="bg-white p-4 shadow-lg flex gap-3">
        <Button onClick={handleDownload} variant="secondary" className="flex-1">
          Download
        </Button>
        <Button onClick={handleShare} variant="primary" className="flex-1">
          Share
        </Button>
      </div>
    </div>
  );
}
