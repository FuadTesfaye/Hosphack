"use client";
import React, { useState, Suspense } from "react";
import { Button } from "primereact/button"; // Import PrimeReact Button

// Dynamically import the VideoCallDialog component
const VideoCallDialog = React.lazy(() => import("./VideoCallDialog"));

const VideoCallButton: React.FC<{ label: string }> = ({ label }) => {
  const [isVideoCallOpen, setVideoCallOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenVideoCall = () => setVideoCallOpen(true);
  const handleCloseVideoCall = () => setVideoCallOpen(false);

  // Error boundary fallback in case of loading issues
  const renderError = () => (
    <p className="text-red-600">Failed to load video call. Please try again.</p>
  );

  return (
    <>
      {error && renderError()}
      <Button
        onClick={handleOpenVideoCall}
        label={label}
        className="bg-sky-600 hover:bg-sky-700 text-white md:text-sm text-xs font-medium py-2 px-4 rounded-lg w-full"
      />
      {/* Lazy load VideoCallDialog with error handling */}
      <Suspense fallback={<div>Loading Video Call...</div>}>
        {isVideoCallOpen && (
          <VideoCallDialog
            isOpen={isVideoCallOpen}
            onHide={handleCloseVideoCall}
            onError={setError}
          />
        )}
      </Suspense>
    </>
  );
};

export default VideoCallButton;
