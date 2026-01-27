"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
<footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌲</span>
              <h3 className="text-xl font-black tracking-tight">Park Pulse</h3>
            </div>

            <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-md">
              AI-powered forecasting for U.S. National Parks. Plan your visit by understanding
              crowd patterns and seasonal trends.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/VictorSsuto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/victor-ssuto-195643223"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-extrabold tracking-wide text-white/90">
              Explore
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
                <li>
                <Link href="/model" className="text-white/70 hover:text-white transition-colors">
                  Model
                </Link>
              </li>
                <li>
                <Link href="/parkRandomizer" className="text-white/70 hover:text-white transition-colors">
                  Park Randomizer
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-extrabold tracking-wide text-white/90">
              Resources
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.nps.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  NPS.gov
                </a>
              </li>
              <li>
                <a
                  href="https://irma.nps.gov/Stats/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  NPS Stats
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/55">
            <span>© {new Date().getFullYear()} Park Pulse.</span>{" "}
            <span>
              Built by <span className="font-bold text-white/85">Victor Ssuto</span>.
            </span>{" "}
            <span className="block md:inline md:ml-2 text-white/45">
              Second Year Computer Science Student at Concordia University
            </span>
          </div>

          <div className="text-xs text-white/55">
            Made with <span className="text-white/85">❤</span> for national parks
          </div>
        </div>
      </div>
    </footer>
  );
}
