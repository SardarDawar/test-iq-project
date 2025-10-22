'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Brain, Sparkles, Target } from 'lucide-react';

export default function StartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mode, setMode] = useState<'default' | 'custom' | 'leadership' | null>(null);
  const [customContext, setCustomContext] = useState({
    bio: '',
    industry: '',
    jobRole: '',
  });
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!mode) return;

    setLoading(true);

    try {
      const response = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          customContext: mode === 'custom' ? customContext : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/assessment/${data.assessmentId}`);
      } else {
        alert(data.error || 'Failed to start assessment');
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Assessment Mode
          </h1>
          <p className="text-lg text-gray-600">
            Select how you'd like to experience the ICEAS assessment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Default Mode */}
          <button
            onClick={() => setMode('default')}
            className={`p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all ${
              mode === 'default' ? 'ring-4 ring-blue-500' : ''
            }`}
          >
            <div className="w-16 h-16 gradient-iq rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Default Test
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Standard assessment with consistent questions for all users.
              Quick and comparable results.
            </p>
            <div className="text-xs text-gray-500">
              <span className="font-semibold">Includes:</span> IQ, EQ, SQ
            </div>
          </button>

          {/* Custom Mode */}
          <button
            onClick={() => setMode('custom')}
            className={`p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all ${
              mode === 'custom' ? 'ring-4 ring-purple-500' : ''
            }`}
          >
            <div className="w-16 h-16 gradient-eq rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Customize for Me
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              AI-reframed questions tailored to your background, role, and
              industry for contextual relevance.
            </p>
            <div className="text-xs text-gray-500">
              <span className="font-semibold">Includes:</span> IQ, EQ, SQ
            </div>
          </button>

          {/* Leadership Mode */}
          <button
            onClick={() => setMode('leadership')}
            className={`p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all ${
              mode === 'leadership' ? 'ring-4 ring-pink-500' : ''
            }`}
          >
            <div className="w-16 h-16 gradient-leadership rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Leadership Assessment
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Comprehensive evaluation including Leadership Potential Index
              (LPI) and leadership style analysis.
            </p>
            <div className="text-xs text-gray-500">
              <span className="font-semibold">Includes:</span> IQ, EQ, SQ, Leadership
            </div>
          </button>
        </div>

        {/* Custom Context Form */}
        {mode === 'custom' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Tell Us About Yourself
            </h3>
            <p className="text-gray-600 mb-6">
              This information helps us personalize question wording to your
              context without changing difficulty or scoring.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brief Bio (optional)
                </label>
                <textarea
                  value={customContext.bio}
                  onChange={(e) =>
                    setCustomContext({ ...customContext, bio: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Software engineer with 5 years experience..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={customContext.industry}
                    onChange={(e) =>
                      setCustomContext({ ...customContext, industry: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Technology, Healthcare..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Role
                  </label>
                  <input
                    type="text"
                    value={customContext.jobRole}
                    onChange={(e) =>
                      setCustomContext({ ...customContext, jobRole: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Team Lead, Manager..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        {mode && (
          <div className="text-center">
            <button
              onClick={handleStart}
              disabled={loading}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Starting Assessment...' : 'Begin Assessment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
