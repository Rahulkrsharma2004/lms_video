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
  const videoRefs = useRef<HTMLIFrameElement[]>([]);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState<boolean>(false);
  const ytPlayers = useRef<any[]>([]);

  // Handle video end
  const handleVideoEnd = (index: number) => {
    const assessmentElement = document.getElementById(`assessment-${index}`);
    if (assessmentElement) {
      assessmentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Complete assessment
  const handleComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      const nextLessonIndex = currentLesson + 1;
      if (nextLessonIndex < dummyData.length) {
        setCurrentLesson(nextLessonIndex);
        const nextLessonElement = document.getElementById(`lesson-${nextLessonIndex}`);
        if (nextLessonElement) {
          nextLessonElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setIsAssessmentComplete(true);
      }
    } else {
      alert('Incorrect answer, please try again.');
    }
  };

  // Load YouTube API
  useEffect(() => {
    const loadYouTubeApi = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
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
    if (isYouTubeApiReady) {
      videoRefs.current.forEach((iframe, index) => {
        if (iframe) {
          const player = new window.YT.Player(iframe, {
            events: {
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  handleVideoEnd(index);
                }
              },
            },
          });
          ytPlayers.current[index] = player;
        }
      });
    }
  }, [isYouTubeApiReady, currentLesson]);

  // Intersection Observer to detect when video enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting && ytPlayers.current[index]) {
            ytPlayers.current[index].playVideo();
          } else if (ytPlayers.current[index]) {
            ytPlayers.current[index].pauseVideo();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((iframe, index) => {
      if (iframe) {
        observer.observe(iframe);
      }
    });

    return () => {
      videoRefs.current.forEach((iframe) => {
        if (iframe) {
          observer.unobserve(iframe);
        }
      });
    };
  }, [isYouTubeApiReady, currentLesson]);

  const lessons: Lesson[] = dummyData as unknown as Lesson[];

  // Handle 'Next Task' button click
  const handleNextTask = () => {
    const nextLessonIndex = currentLesson + 1;
    if (nextLessonIndex < lessons.length) {
      setCurrentLesson(nextLessonIndex);
      const nextLessonElement = document.getElementById(`lesson-${nextLessonIndex}`);
      if (nextLessonElement) {
        nextLessonElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="container mx-auto p-6 rounded-lg">
      {lessons.map((lesson: Lesson, index: number) => (
        <div key={lesson.id} id={`lesson-${index}`} className="mb-10">
          <div className="video-wrapper mb-6">
            <iframe
              ref={(el) => (videoRefs.current[index] = el!)}
              width="100%"
              height="430"
              src={`${lesson.videoUrl}?enablejsapi=1`}
              allowFullScreen
              className="w-full rounded-lg shadow-xl"
              style={{ border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              data-index={index}
            ></iframe>
          </div>

          <div
            id={`assessment-${index}`}
            className="bg-white p-6 rounded-lg shadow-md mt-6 border-t-4 border-blue-500"
          >
            <Assessment
              type={lesson.type}
              question={lesson.question}
              options={lesson.options}
              correctAnswer={lesson.correctAnswer}
              onComplete={handleComplete}
              onNext={handleNextTask}
              isLastAssessment={index === dummyData.length - 1}
            />
          </div>
        </div>
      ))}

      <div id="congratulations" className="text-center mt-8">
        <button
          onClick={() => {
            setCurrentLesson(0);
            setIsAssessmentComplete(false);
            const firstLessonElement = document.getElementById('lesson-0');
            if (firstLessonElement) {
              firstLessonElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default LMS;
