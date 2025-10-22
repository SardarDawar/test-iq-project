'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, FileQuestion, Settings } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  // Check if user is admin
  if (session.user.role !== 'ADMIN' && session.user.role !== 'CLIENT_ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Admin privileges required.</p>
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
              <Settings className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Admin Portal
          </h2>
          <p className="text-gray-600">
            Manage questions, view analytics, and configure your ICEAS instance.
          </p>
        </div>

        {/* Admin Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Question Management */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileQuestion className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Question Manager
            </h3>
            <p className="text-gray-600 mb-4">
              Add, edit, and organize questions for IQ, EQ, SQ, and Leadership assessments.
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              Manage Questions →
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Analytics & Reports
            </h3>
            <p className="text-gray-600 mb-4">
              Track engagement metrics, completion rates, and score distributions.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-semibold">
              View Analytics →
            </button>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              User Management
            </h3>
            <p className="text-gray-600 mb-4">
              View and manage user accounts, roles, and permissions.
            </p>
            <button className="text-green-600 hover:text-green-700 font-semibold">
              Manage Users →
            </button>
          </div>
        </div>

        {/* Widget Integration */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Widget Integration
          </h3>
          <p className="text-gray-600 mb-6">
            Embed ICEAS on your website with a single line of code:
          </p>
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code>{`<div id="iceas-widget"></div>
<script src="https://cdn.iceas.app/widget.min.js"
        data-client="your-tenant-id"
        data-mode="leadership">
</script>`}</code>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Replace <code className="bg-gray-100 px-2 py-1 rounded">your-tenant-id</code> with your organization's ID.
            Mode options: <code className="bg-gray-100 px-2 py-1 rounded">default</code>,{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">custom</code>,{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">leadership</code>
          </p>
        </div>
      </div>
    </div>
  );
}
