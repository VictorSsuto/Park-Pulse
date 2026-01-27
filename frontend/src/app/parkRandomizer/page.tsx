"use client";

import React from "react";

export default function ParkRandomizerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-300/30 mb-6">
            <span className="text-sm font-bold">🎲 Park Randomizer</span>
            <span className="text-white/60">•</span>
            <span className="text-sm">Coming Soon</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Discover Your Next Adventure
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl leading-relaxed">
            Not sure which national park to visit next? Let Park Pulse help you discover parks based on what you actually enjoy, not just popularity.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* How It Works Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-black text-gray-900">How It Works</h2>
            <p className="text-sm text-gray-600 mt-1">Match your preferences with the perfect park</p>
          </div>
          
          <div className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Instead of picking a park at random, you'll choose what kind of experience you want — like beaches, coastlines, forests, or mountains. Park Pulse uses <strong>clustering techniques</strong> to group parks with similar characteristics and match you with one that fits your vibe.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">How Clustering Works</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Park Pulse analyzes park attributes (terrain, climate, activities, crowd patterns) and uses <strong>machine learning clustering algorithms</strong> to group similar parks together. When you select preferences, the system finds parks in clusters that match your desired characteristics.
                  </p>
                </div>
              </div>
            </div>

            {/* Preference Tags */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { icon: "🏖", label: "Beach", color: "from-blue-50 to-cyan-50 border-blue-200" },
                { icon: "🌊", label: "Coastline", color: "from-cyan-50 to-teal-50 border-cyan-200" },
                { icon: "🌲", label: "Forest", color: "from-emerald-50 to-green-50 border-emerald-200" },
                { icon: "🏔", label: "Mountains", color: "from-gray-50 to-slate-50 border-gray-300" },
                { icon: "🏜", label: "Desert", color: "from-amber-50 to-orange-50 border-amber-200" },
                { icon: "🐻", label: "Wildlife", color: "from-green-50 to-emerald-50 border-green-200" },
                { icon: "🚶", label: "Chill", color: "from-purple-50 to-pink-50 border-purple-200" },
                { icon: "🧗", label: "Adventure", color: "from-red-50 to-orange-50 border-red-200" },
              ].map((pref) => (
                <button
                  key={pref.label}
                  disabled
                  className={`bg-gradient-to-br ${pref.color} border-2 rounded-xl p-4 text-center transition-all hover:shadow-md cursor-not-allowed opacity-60`}
                >
                  <div className="text-3xl mb-1">{pref.icon}</div>
                  <div className="text-sm font-bold text-gray-700">{pref.label}</div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Coming soon:</strong> Select multiple preferences to get personalized recommendations
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">What You'll Get</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold mt-1">→</span>
                <span className="text-gray-700">A <strong>personalized park suggestion</strong> based on your preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold mt-1">→</span>
                <span className="text-gray-700">A short explanation of <strong>why</strong> it matches your vibe</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold mt-1">→</span>
                <span className="text-gray-700">Options to <strong>re-roll</strong> or explore similar parks</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">What's Coming Next</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold mt-1">✓</span>
                <span className="text-gray-700">Multiple recommendations instead of just one</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold mt-1">✓</span>
                <span className="text-gray-700">Seasonal suggestions (best parks right now)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold mt-1">✓</span>
                <span className="text-gray-700">Crowd-aware picks using Park Pulse predictions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 rounded-2xl p-12 text-white text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-4xl">🎲</span>
          </div>
          
          <h2 className="text-3xl font-black mb-4">Ready to Explore?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Pick a few preferences (like "coastline" + "chill") and Park Pulse will recommend a park that matches your style.
          </p>
          
          <button
            disabled
            className="px-8 py-4 bg-white/20 text-white rounded-full font-bold border-2 border-white/30 cursor-not-allowed backdrop-blur-sm"
          >
            Coming Soon
          </button>
          
          <p className="text-sm text-gray-400 mt-4">
            This feature is currently in development
          </p>
        </div>
      </div>
    </main>
  );
}