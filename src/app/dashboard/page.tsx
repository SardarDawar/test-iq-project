'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Brain, Award, TrendingUp, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface DashboardData {
  user: {
    name: string;
    email: string;
  };
  results: Array<{
    id: string;
    iqScore: number;
    eqScore: number;
    sqScore: number;
    lpiScore: number | null;
    createdAt: string;
  }>;
  badges: Array<{
    badge: {
      name: string;
      description: string;
      icon: string;
    };
    earnedAt: string;
  }>;
  progress: {
    xp: number;
    level: number;
    streak: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchDashboard();
    }
  }, [session]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const result = await response.json();

      if (response.ok) {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ICEAS Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {data.user.name}!
          </h2>
          <p className="text-gray-600">Here's your intelligence journey at a glance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* XP Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Experience Points</div>
                <div className="text-2xl font-bold text-gray-900">{data.progress.xp} XP</div>
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Level</div>
                <div className="text-2xl font-bold text-gray-900">Level {data.progress.level}</div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">Day Streak</div>
                <div className="text-2xl font-bold text-gray-900">{data.progress.streak} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Assessments</h3>
            <button
              onClick={() => router.push('/start')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              New Assessment
            </button>
          </div>

          {data.results.length > 0 ? (
            <div className="space-y-4">
              {data.results.map((result) => (
                <div
                  key={result.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => router.push(`/results/${result.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        Assessment Results
                      </div>
                      <div className="text-sm text-gray-600">
                        Completed: {new Date(result.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-600">IQ</div>
                        <div className="text-lg font-bold text-gray-900">{result.iqScore}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600">EQ</div>
                        <div className="text-lg font-bold text-gray-900">{result.eqScore}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600">SQ</div>
                        <div className="text-lg font-bold text-gray-900">{result.sqScore}</div>
                      </div>
                      {result.lpiScore && (
                        <div className="text-center">
                          <div className="text-xs text-gray-600">LPI</div>
                          <div className="text-lg font-bold text-gray-900">{result.lpiScore}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't taken any assessments yet.</p>
              <button
                onClick={() => router.push('/start')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Take Your First Assessment
              </button>
            </div>
          )}
        </div>

        {/* Badges */}
        {data.badges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Badges</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.badges.map((userBadge, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl mb-2">{userBadge.badge.icon}</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {userBadge.badge.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {userBadge.badge.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
