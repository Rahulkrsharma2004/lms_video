// src/components/VideoPlayer.tsx
import React from 'react';
import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoUrl: string;
  onEnd: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onEnd }) => {
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  const videoId = videoUrl.split("/embed/")[1];

  return <YouTube videoId={videoId} opts={opts} onEnd={onEnd} />;
};

export default VideoPlayer;
