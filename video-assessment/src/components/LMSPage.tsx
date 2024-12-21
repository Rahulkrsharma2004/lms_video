import React, { useState, useEffect, useRef } from 'react';
import Assessment from './Assessment';
import dummyData from '../data/videos.json';

interface Lesson {
  id: number;
  videoUrl: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer?: number | null;
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
  console.log(isAssessmentComplete)
  const playerRefs = useRef<any[]>([]);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState<boolean>(false);
  const videoWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleVideoEnd = (index: number) => {
    const assessmentElement = document.getElementById(`assessment-${index}`);
    if (assessmentElement) {
      assessmentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  useEffect(() => {
    const loadYouTubeApi = () => {
      return new Promise<void>((resolve) => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onload = () => resolve();
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
      });
    };

    const initYouTubeApi = async () => {
      if (!window.YT) {
        await loadYouTubeApi();
      }
      setIsYouTubeApiReady(true);
    };

    initYouTubeApi();
  }, []);

  useEffect(() => {
    if (isYouTubeApiReady) {
      dummyData.forEach((lesson, index) => {
        const videoId = extractVideoId(lesson.videoUrl);
        if (videoId) {
          playerRefs.current[index] = new window.YT.Player(`video-${index}`, {
            videoId: videoId,
            playerVars: {
              controls: 0, 
              showinfo: 0,
              rel: 0, 
              modestbranding: 1,
              fs: 0,
              playsinline: 1, 
              iv_load_policy: 3, 
              autohide: 1, 
              disablekb: 1,
              cc_load_policy: 0, 
              origin: window.location.origin,
              widget_referrer: window.location.href,
              enablejsapi: 1, 
              hl: 'en',
              color: 'white', 
            },
            events: {
              onReady: (event: any) => {
                console.log(`Player ${index} is ready`);
                resizeVideo(index);
                console.log(event)
              },
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  handleVideoEnd(index);
                }
              },
            },
          });
        }
      });
    }
  }, [isYouTubeApiReady]);

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const resizeVideo = (index: number) => {
    const wrapper = videoWrapperRefs.current[index];
    if (wrapper && playerRefs.current[index]) {
      const width = wrapper.clientWidth;
      const height = width * 9 / 16; // 16:9 aspect ratio
      playerRefs.current[index].setSize(width, height);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      dummyData.forEach((_, index) => resizeVideo(index));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting && playerRefs.current[index]) {
            playerRefs.current[index].playVideo();
          } else if (playerRefs.current[index]) {
            playerRefs.current[index].pauseVideo();
          }
        });
      },
      { threshold: 0.5 }
    );

    dummyData.forEach((_, index) => {
      const videoElement = document.getElementById(`video-${index}`);
      if (videoElement) {
        observer.observe(videoElement);
      }
    });

    return () => {
      dummyData.forEach((_, index) => {
        const videoElement = document.getElementById(`video-${index}`);
        if (videoElement) {
          observer.unobserve(videoElement);
        }
      });
    };
  }, [isYouTubeApiReady]);

  const lessons: Lesson[] = dummyData as Lesson[];

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
          <div 
            className="video-wrapper mb-6 relative w-full"
            ref={el => videoWrapperRefs.current[index] = el}
          >
            <div id={`video-${index}`} data-index={index} className="w-full"></div>
          </div>

          <div
            id={`assessment-${index}`}
            className="bg-white p-6 rounded-lg shadow-md mt-6 border-t-4 border-blue-500"
          >
            <Assessment
              type={lesson.type as 'short-answer' | 'multiple-choice'}
              question={lesson.question}
              options={lesson.options || []}
              correctAnswer={lesson.correctAnswer !== null ? lesson.correctAnswer : undefined}
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
          className="mt-6 px-8 py-3 bg-purple-800 text-white rounded shadow-lg cursor-pointer transition-colors duration-300 hover:bg-purple-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default LMS;

