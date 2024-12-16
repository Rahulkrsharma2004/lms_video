import React, { useState } from 'react';

interface AssessmentProps {
  type: 'short-answer' | 'multiple-choice';
  question: string;
  options?: string[];
  correctAnswer?: number;
  onComplete: (isCorrect: boolean) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ type, question, options, correctAnswer, onComplete }) => {
  const [answer, setAnswer] = useState<string | number>('');

  const handleSubmit = () => {
    if (type === 'multiple-choice' && typeof correctAnswer === 'number') {
      const isCorrect = answer === correctAnswer;
      onComplete(isCorrect);
    } else if (type === 'short-answer') {
      onComplete(true);
    }
  };

  return (
    <div className="assessment mt-4 p-6 border rounded-lg bg-white shadow-md">
      <p className="font-semibold mb-4 text-lg">{question}</p>
      {type === 'multiple-choice' && options && (
        <div className="mb-4">
          {options.map((option, index) => (
            <label key={index} className="block mb-2 cursor-pointer">
              <input
                type="radio"
                name="option"
                value={index}
                onChange={() => setAnswer(index)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
      {type === 'short-answer' && (
        <textarea
          value={answer as string}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      )}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </div>
  );
};

export default Assessment;
