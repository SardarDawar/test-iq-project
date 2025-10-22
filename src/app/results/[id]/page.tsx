'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Brain, Heart, Sparkles, Target, Award, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface Result {
  id: string;
  iqScore: number;
  iqPercentile: number;
  eqScore: number;
  sqScore: number;
  lpiScore: number | null;
  reasoningType: string;
  leadershipStyle: string | null;
  domainScores: any;
  insights: any;
  strengths: any;
  improvements: any;
  user: {
    name: string;
  };
  badges: any[];
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/results/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        alert(data.error || 'Failed to load results');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
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
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Results not found</p>
        </div>
      </div>
    );
  }

  // Prepare radar chart data for EQ
  const eqRadarData = Object.entries(result.domainScores.eq || {}).map(([key, value]) => ({
    subject: key.replace(/([A-Z])/g, ' $1').trim(),
    score: value,
    fullMark: 100,
  }));

  // Prepare radar chart data for SQ
  const sqRadarData = Object.entries(result.domainScores.sq || {}).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    score: value,
    fullMark: 100,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Your Mindprint</h1>
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

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Congratulations, {result.user.name}!
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            You've completed your comprehensive intelligence assessment.
          </p>

          {/* AI Insights */}
          {result.insights?.text && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Intelligence Profile
              </h3>
              <p className="text-blue-800">{result.insights.text}</p>
            </div>
          )}
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* IQ Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 gradient-iq rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">IQ Score</h3>
            <div className="text-4xl font-bold text-gray-900 mb-1">{result.iqScore}</div>
            <div className="text-sm text-gray-600">{result.iqPercentile}th percentile</div>
            <div className="mt-3 text-sm text-gray-500">
              Type: <span className="font-semibold">{result.reasoningType}</span>
            </div>
          </div>

          {/* EQ Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 gradient-eq rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">EQ Score</h3>
            <div className="text-4xl font-bold text-gray-900 mb-1">{result.eqScore}</div>
            <div className="text-sm text-gray-600">Emotional Intelligence</div>
          </div>

          {/* SQ Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 gradient-sq rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">SQ Score</h3>
            <div className="text-4xl font-bold text-gray-900 mb-1">{result.sqScore}</div>
            <div className="text-sm text-gray-600">Social/Spiritual Intelligence</div>
          </div>

          {/* LPI Card (if available) */}
          {result.lpiScore && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="w-12 h-12 gradient-leadership rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LPI Score</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">{result.lpiScore}</div>
              <div className="text-sm text-gray-600">Leadership Potential</div>
              {result.leadershipStyle && (
                <div className="mt-3 text-sm text-gray-500">
                  Style: <span className="font-semibold">{result.leadershipStyle}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visualizations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* EQ Radar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              Emotional Intelligence Profile
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={eqRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="EQ" dataKey="score" stroke="#f093fb" fill="#f093fb" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* SQ Radar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Social/Spiritual Intelligence Profile
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={sqRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="SQ" dataKey="score" stroke="#4facfe" fill="#4facfe" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-green-500" />
              Your Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths?.list?.map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Growth */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              Areas for Growth
            </h3>
            <ul className="space-y-2">
              {result.improvements?.list?.map((improvement: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Grow?
          </h3>
          <p className="text-gray-600 mb-6">
            Get personalized microlearning recommendations based on your results.
          </p>
          <button
            onClick={() => router.push(`/microlearning/${params.id}`)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Start Learning Journey
          </button>
        </div>
      </div>
    </div>
  );
}
