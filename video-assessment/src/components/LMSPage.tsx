import React, { useState, useEffect, useRef } from 'react';
import Assessment from './Assessment'; 
import dummyData from '../data/videos.json'; 

interface Lesson {
  id: number;
  videoUrl: string;
  question: string;
  type: 'short-answer' | 'multiple-choice';
  options?: string[];
  correctAnswer?: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const LMS: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<number>(0);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState<boolean>(false);
  const [isAllLessonsCompleted, setIsAllLessonsCompleted] = useState<boolean>(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState<boolean>(false);

  // Handle video end
  const handleVideoEnd = () => {
    const assessmentElement = document.getElementById(`assessment-${currentLesson}`);
    if (assessmentElement) {
      assessmentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Complete assessment
  const handleComplete = (isCorrect: boolean) => {
    setIsAssessmentComplete(true);
  };

  // Go to next task (lesson)
  const handleNextTask = () => {
    if (currentLesson + 1 < dummyData.length) {
      setCurrentLesson((prev) => prev + 1);
      setIsAssessmentComplete(false);
      const nextLessonElement = document.getElementById(`lesson-${currentLesson + 1}`);
      if (nextLessonElement) {
        nextLessonElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setIsAllLessonsCompleted(true); // Mark all lessons as completed
    }
  };

  // Back to Home functionality
  const handleBackToHome = () => {
    setIsAllLessonsCompleted(false); // Reset and go back to first lesson
    setCurrentLesson(0);
    const firstLessonElement = document.getElementById('lesson-0');
    if (firstLessonElement) {
      firstLessonElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load YouTube API
  useEffect(() => {
    const loadYouTubeApi = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      console.log(firstScriptTag)
      firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
    };

    const onYouTubeIframeAPIReady = () => {
      setIsYouTubeApiReady(true);
    };

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    if (!window.YT) {
      loadYouTubeApi();
    } else {
      setIsYouTubeApiReady(true);
    }
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    if (isYouTubeApiReady && videoRef.current) {
      const iframe = videoRef.current;
      console.log(iframe)
      const player = new window.YT.Player(iframe, {
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleVideoEnd();
            }
          }
        }
      });
    }
  }, [currentLesson, isYouTubeApiReady]);

  const lessons: Lesson[] = dummyData as Lesson[];

  return (
    <div className="container mx-auto p-4">
      {lessons.map((lesson: Lesson, index: number) => (
        <div
          key={lesson.id}
          id={`lesson-${index}`}
          className={`mb-8 ${index !== currentLesson ? 'hidden' : ''}`}
        >
          <div className="video-wrapper mb-4">
            <iframe
              ref={index === currentLesson ? videoRef : null}
              width="100%"
              height="480"
              src={lesson.videoUrl}
              frameBorder="0"
              allowFullScreen
              className="w-full rounded-lg shadow-lg"
              title={`Lesson ${index + 1}`}
              style={{ border: 'none' }}
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>

          {/* Assessment Section */}
          {index === currentLesson && (
            <div id={`assessment-${index}`} className="bg-white p-6 rounded-lg shadow-md mt-6">
              <Assessment
                type={lesson.type}
                question={lesson.question}
                options={lesson.options}
                correctAnswer={lesson.correctAnswer}
                onComplete={handleComplete}
              />
              {isAssessmentComplete && (
                <button
                  onClick={handleNextTask}
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Next Task
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* End of All Lessons */}
      {isAllLessonsCompleted && (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold">Congratulations!</h2>
          <p className="mt-4">You have completed all the lessons.</p>
          <button
            onClick={handleBackToHome}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default LMS;
