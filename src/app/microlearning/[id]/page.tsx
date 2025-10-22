'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function MicrolearningPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  // Sample insight cards (in production, these would be AI-generated based on results)
  const insightCards = [
    {
      title: 'Deep Breathing for Decision Making',
      description: 'Try 3 deep breaths before making hard decisions to activate your prefrontal cortex.',
      category: 'EQ',
    },
    {
      title: 'Value-Driven Action',
      description: 'Reflect on one value-driven action you can take this week to strengthen your purpose.',
      category: 'SQ',
    },
    {
      title: 'Pattern Recognition Practice',
      description: 'Spend 10 minutes daily on logic puzzles to sharpen analytical thinking.',
      category: 'IQ',
    },
  ];

  const dailyPlan = [
    { day: 1, task: 'Morning reflection: Identify your core value for the week' },
    { day: 2, task: 'Practice empathy: Listen actively to a colleague without judgment' },
    { day: 3, task: 'Logic challenge: Solve 5 pattern recognition puzzles' },
    { day: 4, task: 'Self-awareness: Journal about an emotional trigger you experienced' },
    { day: 5, task: 'Purpose action: Take one step toward a meaningful goal' },
  ];

  const toggleComplete = (day: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(day)) {
      newCompleted.delete(day);
    } else {
      newCompleted.add(day);
    }
    setCompleted(newCompleted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Microlearning Journey</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Personalized Growth Plan
          </h2>
          <p className="text-gray-600 mb-6">
            Based on your assessment results, we've created actionable insights
            and a 5-day plan to help you grow your intelligence across IQ, EQ, and SQ.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <strong>Pro tip:</strong> Consistency is key. Complete one task per day
              to build lasting growth habits.
            </p>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {insightCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm font-semibold text-blue-600 mb-2">
                  {card.category}
                </div>
                <h4 className="font-bold text-gray-900 mb-3">{card.title}</h4>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Day Plan */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">5-Day Learning Plan</h3>
          <div className="space-y-4">
            {dailyPlan.map((item) => (
              <div
                key={item.day}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  completed.has(item.day)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleComplete(item.day)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      completed.has(item.day)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {completed.has(item.day) ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      item.day
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Day {item.day}</div>
                    <div className="text-gray-600">{item.task}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {completed.size === dailyPlan.length && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">
                🎉 Congratulations! You've completed your 5-day plan!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
