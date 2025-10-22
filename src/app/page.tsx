import Link from "next/link";
import { Brain, Heart, Sparkles, Target } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ICEAS</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Your Complete Intelligence Profile
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          ICEAS combines cognitive, emotional, social, and leadership assessments
          to create your comprehensive Mindprint. Understand your strengths,
          unlock your potential, and grow with personalized insights.
        </p>
        <Link
          href="/start"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Your Assessment
        </Link>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* IQ Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 gradient-iq rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              IQ Assessment
            </h3>
            <p className="text-gray-600 mb-4">
              Measure your cognitive abilities through pattern recognition,
              logical reasoning, and problem-solving challenges.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Visual & Spatial Reasoning</li>
              <li>• Numerical Analysis</li>
              <li>• Verbal Intelligence</li>
            </ul>
          </div>

          {/* EQ Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 gradient-eq rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              EQ Assessment
            </h3>
            <p className="text-gray-600 mb-4">
              Evaluate your emotional intelligence across self-awareness,
              empathy, and social skills.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Self-Awareness</li>
              <li>• Empathy & Social Skills</li>
              <li>• Emotional Regulation</li>
            </ul>
          </div>

          {/* SQ Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 gradient-sq rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              SQ Assessment
            </h3>
            <p className="text-gray-600 mb-4">
              Explore your values, purpose, and capacity for meaning-making
              and compassion.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Values & Purpose</li>
              <li>• Ethical Reasoning</li>
              <li>• Connection & Compassion</li>
            </ul>
          </div>

          {/* Leadership Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 gradient-leadership rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Leadership Potential
            </h3>
            <p className="text-gray-600 mb-4">
              Discover your leadership style and potential through integrated
              IQ, EQ, and SQ insights.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Vision & Strategy</li>
              <li>• Team Empathy</li>
              <li>• Ethical Leadership</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Choose Your Mode
              </h3>
              <p className="text-gray-600">
                Select default assessment or customize questions to your
                background, role, and industry for personalized context.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Complete the Assessment
              </h3>
              <p className="text-gray-600">
                Answer questions across IQ, EQ, SQ, and optional Leadership
                modules. Enjoy gamified progress tracking with badges and levels.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Get Your Mindprint
              </h3>
              <p className="text-gray-600">
                View your comprehensive results dashboard with visual
                intelligence profiles, insights, and personalized recommendations.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Grow with Microlearning
              </h3>
              <p className="text-gray-600">
                Receive actionable insight cards and a 5-day learning plan
                tailored to your strengths and areas for growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Discover Your Intelligence Profile?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of users who have unlocked their potential with ICEAS.
          </p>
          <Link
            href="/start"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Begin Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 ICEAS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
