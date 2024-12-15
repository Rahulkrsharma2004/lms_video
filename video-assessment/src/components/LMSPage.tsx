// src/components/LMSPage.tsx
import React, { useState, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import Assessment from './Assessment';
import { videoData } from '../data/videos';
import { VideoData } from '../components/types';

const LMSPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const assessmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleVideoEnd = () => {
    assessmentRefs.current[currentIndex]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAssessmentComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      if (currentIndex < videoData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      alert('Please try again.');
    }
  };

  return (
    <div className="lms-page p-4">
      {videoData.map((video: VideoData, index: number) => (
        <div key={video.id} className="task-section mb-8">
          <VideoPlayer videoUrl={video.videoUrl} onEnd={handleVideoEnd} />
          <div ref={(el) => (assessmentRefs.current[index] = el)}>
            <Assessment
              type={video.assessment.type}
              question={video.assessment.question}
              options={video.assessment.options}
              correctAnswer={video.assessment.correctAnswer}
              onComplete={handleAssessmentComplete}
            />
          </div>
          {index === currentIndex && (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Next Task
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LMSPage;
