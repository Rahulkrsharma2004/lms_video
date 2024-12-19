import React, { useState } from 'react'

interface AssessmentProps {
  type: 'short-answer' | 'multiple-choice'
  question: string
  options?: string[]
  correctAnswer?: number
  onComplete: (isCorrect: boolean) => void
  onNext: () => void // Add the onNext prop to handle going to the next task
  isLastAssessment: boolean // Prop to check if this is the last assessment
}

const Assessment: React.FC<AssessmentProps> = ({
  type,
  question,
  options,
  correctAnswer,
  onComplete,
  onNext,
  isLastAssessment,
}) => {
  const [answer, setAnswer] = useState<string | number>('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSubmit = () => {
    let isCorrect = false

    if (type === 'multiple-choice' && typeof correctAnswer === 'number') {
      isCorrect = answer === correctAnswer
    } else if (type === 'short-answer') {
      isCorrect = (answer as string).trim() !== ''
    }

    if (isCorrect) {
      setFeedback(null)
      onComplete(true)
    } else {
      setFeedback('Wrong answer. Please try again.')
    }
  }

  return (
    <div className='assessment mt-6 p-6 border-2 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-200 shadow-lg'>
      <p className='font-semibold mb-4 text-xl text-gray-800'>{question}</p>
      {type === 'multiple-choice' && options && (
        <div className='mb-4 space-y-3'>
          {options.map((option, index) => (
            <label key={index} className='block cursor-pointer text-lg text-gray-700 hover:text-blue-600'>
              <input
                type='radio'
                name='option'
                value={index}
                onChange={() => setAnswer(index)}
                className='mr-3 rounded-full border-gray-300 hover:bg-blue-500'
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
          className='w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={4}
        />
      )}
      <div className='flex justify-between mt-6'>
        <button
          onClick={handleSubmit}
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300'
        >
          Submit
        </button>
        <button
          onClick={onNext}
          className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ${
            isLastAssessment ? 'cursor-not-allowed bg-gray-500' : 'cursor-pointer'
          }`}
          disabled={isLastAssessment}
        >
          {isLastAssessment ? 'Complete' : 'Next Task'}
        </button>
      </div>
      {feedback && <p className='mt-3 text-red-600 text-lg'>{feedback}</p>}
    </div>
  )
}

export default Assessment
