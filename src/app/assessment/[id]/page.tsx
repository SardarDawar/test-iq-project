'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Brain, Heart, Sparkles, Target, Clock, Check } from 'lucide-react';

interface Question {
  id: string;
  category: string;
  type: string;
  difficulty: number;
  text: string;
  options: string[] | null;
  imageUrl?: string;
}

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [answers, setAnswers] = useState<Map<string, any>>(new Map());
  const [startTime, setStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/assessment/${params.id}/questions`);
      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions);
      } else {
        alert(data.error || 'Failed to load questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const currentQuestion = questions[currentIndex];

    // Save answer
    try {
      await fetch(`/api/assessment/${params.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answer: selectedAnswer,
          timeSpent,
        }),
      });

      answers.set(currentQuestion.id, selectedAnswer);
      setAnswers(new Map(answers));

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setStartTime(Date.now());
      } else {
        // Complete assessment
        await completeAssessment();
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      alert('Failed to save answer');
    }
  };

  const completeAssessment = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/assessment/${params.id}/complete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/results/${data.resultId}`);
      } else {
        alert(data.error || 'Failed to complete assessment');
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'IQ':
        return <Brain className="w-6 h-6" />;
      case 'EQ':
        return <Heart className="w-6 h-6" />;
      case 'SQ':
        return <Sparkles className="w-6 h-6" />;
      case 'LEADERSHIP':
        return <Target className="w-6 h-6" />;
      default:
        return <Brain className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'IQ':
        return 'gradient-iq';
      case 'EQ':
        return 'gradient-eq';
      case 'SQ':
        return 'gradient-sq';
      case 'LEADERSHIP':
        return 'gradient-leadership';
      default:
        return 'gradient-iq';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">ICEAS Assessment</h1>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-12 h-12 ${getCategoryColor(currentQuestion.category)} rounded-full flex items-center justify-center text-white`}>
              {getCategoryIcon(currentQuestion.category)}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{currentQuestion.category} Assessment</div>
              <div className="text-sm text-gray-500">Difficulty: {'★'.repeat(currentQuestion.difficulty)}</div>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestion.text}
            </h2>
            {currentQuestion.imageUrl && (
              <img
                src={currentQuestion.imageUrl}
                alt="Question visual"
                className="w-full max-w-md mx-auto rounded-lg"
              />
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options && JSON.parse(currentQuestion.options as any).map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedAnswer === option && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <Clock className="w-4 h-4 inline mr-1" />
              Take your time
            </div>
            <button
              onClick={handleNext}
              disabled={!selectedAnswer || submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {submitting
                ? 'Completing...'
                : currentIndex < questions.length - 1
                ? 'Next Question'
                : 'Complete Assessment'}
            </button>
          </div>
        </div>

        {/* Category Progress */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          {['IQ', 'EQ', 'SQ', 'LEADERSHIP'].map((category) => {
            const categoryQuestions = questions.filter((q) => q.category === category);
            const answered = Array.from(answers.keys()).filter((id) =>
              categoryQuestions.some((q) => q.id === id)
            ).length;

            if (categoryQuestions.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-lg p-3 text-center">
                <div className="text-xs font-semibold text-gray-600 mb-1">{category}</div>
                <div className="text-sm text-gray-900">
                  {answered}/{categoryQuestions.length}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
