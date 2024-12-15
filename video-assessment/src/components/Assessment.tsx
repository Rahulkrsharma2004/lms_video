
import React, { useState } from 'react';

interface AssessmentProps {
  type: 'multiple-choice' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer?: number;
  onComplete: (isCorrect: boolean) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ type, question, options, correctAnswer, onComplete }) => {
  const [answer, setAnswer] = useState<string | number>('');

  const handleSubmit = () => {
    if (type === 'multiple-choice') {
      const isCorrect = answer === correctAnswer;
      onComplete(isCorrect);
    } else {
      onComplete(true);
    }
  };

  return (
    <div className="assessment mt-4 p-4 border rounded-lg bg-gray-100">
      <p className="font-semibold mb-2">{question}</p>
      {type === 'multiple-choice' && options && (
        <div className="mb-4">
          {options.map((option, index) => (
            <label key={index} className="block mb-2">
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
          className="w-full p-2 border rounded"
        />
      )}
      <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </div>
  );
};

export default Assessment;
