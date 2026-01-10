"use client";

import React from 'react';
import Footer from "@/components/Footer";
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="text-sm font-bold">Second Year CS Student</span>
            <span className="text-white/60">•</span>
            <span className="text-sm">Concordia University</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            About Park Pulse
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl leading-relaxed">
            A personal project built at the intersection of data science, curiosity, and the United States National Parks.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Introduction with Image */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Why I Built This</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              I built Park Pulse as a way to combine two things I care deeply about: understanding data and spending time in national parks.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This project started as a technical challenge, but it quickly became something more personal. National parks have always been places where I slow down, reflect, and reset. Park Pulse is my way of exploring how data can help us better understand and protect those places.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              When you visit a park, it feels timeless. Trails, cliffs, forests, and coastlines seem unchanged. But behind the scenes, parks are constantly adapting to changing visitor patterns, seasonal demand, and unexpected events.
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/about/IMG_5194.JPG" 
              alt="Acadia National Park coastline"
              className="w-full object-cover aspect-[4/3]"
            />
            <div className="bg-white p-6 border-t border-gray-100">
              <p className="text-gray-600 italic">Looking out over the coastline at Acadia National Park</p>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-10 border border-emerald-100 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Questions That Pulled Me In</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            I started asking simple questions. How predictable are park visits? Which months create the most pressure on infrastructure? How do trends repeat year after year? These questions naturally led me to explore the data.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Seasonality</h3>
              <p className="text-gray-600">Summer peaks and winter lows repeat year after year</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100">
              <h3 className="text-xl font-bold text-teal-900 mb-2">Trend Analysis</h3>
              <p className="text-gray-600">Some parks grow steadily while others fluctuate</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Anomalies</h3>
              <p className="text-gray-600">Big events can break normal patterns</p>
            </div>
          </div>
        </div>

        {/* Acadia Sign - Image Left, Text Right */}
        <div className="grid md:grid-cols-5 gap-12 items-center mb-20">
          <div className="md:col-span-2 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/about/IMG_5560.JPG" 
              alt="Acadia National Park sign"
              className="w-full object-cover aspect-[3/4]"
            />
            <div className="bg-white p-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Acadia National Park</p>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Connecting Data Science and National Parks</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Park Pulse uses historical visitation data to explore long term patterns in how people experience national parks. By modeling monthly visits, the project highlights seasonality, growth trends, and moments where reality deviates from expectations.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This kind of analysis can support better planning, whether that means staffing, conservation efforts, or helping visitors understand when a park might be at its busiest. For me, it is also a way to practice building real, interpretable data science systems.
            </p>
          </div>
        </div>

        {/* Sequoia - Text Left, Image Right */}
        <div className="grid md:grid-cols-5 gap-12 items-center mb-20">
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Scale and Humility</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Standing beneath the sequoias puts everything into perspective. These trees have been here for thousands of years, far longer than any trend, dataset, or prediction.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Experiences like this remind me why understanding long term patterns matters and why data should be used with humility. The natural world operates on timescales that dwarf our models and predictions.
            </p>
          </div>
          
          <div className="md:col-span-2 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/about/IMG_7834.JPG" 
              alt="Giant Sequoias"
              className="w-full object-cover aspect-[3/4]"
            />
            <div className="bg-white p-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Walking among giant sequoias</p>
            </div>
          </div>
        </div>

        {/* Yosemite Sunrise - Full Width */}
        <div className="mb-20">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/about/IMG_8502.jpg" 
              alt="Yosemite sunrise"
              className="w-full object-cover aspect-[21/9]"
            />
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">A Sunrise at Yosemite</h3>
              <p className="text-lg text-gray-700 italic">
                Moments like this remind me why these places matter. The data tells us when people visit, but experiences like watching the sunrise over Yosemite remind us why they come.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">
            Why Park Pulse Matters to Me
          </h2>
          <p className="text-xl text-gray-200 leading-relaxed mb-6 max-w-3xl mx-auto">
            Park Pulse represents how I want to approach technology. Data science should not exist in isolation. It should help us understand real places, real systems, and real experiences.
          </p>
          <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            This project brings together my academic interests and experiences that shaped how I see the world. It is both a learning tool and a reminder that good data work starts with genuine curiosity about the world.
          </p>
        </div>
      </div>
    </main>
  );
}