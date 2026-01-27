"use client";

import React from 'react';
import Footer from "@/components/Footer";

export default function ModelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="text-sm font-bold">Park Pulse</span>
            <span className="text-white/60">•</span>
            <span className="text-sm">Model Documentation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Forecasting National Park Visits
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl leading-relaxed mb-8">
            How Park Pulse predicts monthly park visits using a time-series regression pipeline.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
              Last updated: Jan 2026
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
              6 min read
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
              Target: Monthly visits
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
              Model: Random Forest Regressor
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Executive Summary */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-10 border border-emerald-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Executive Summary</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            The model learns seasonality (summer peaks, winter lows) and trend using lagged and rolling historical signals. We evaluate on future months to mimic real forecasting.
          </p>
          <div className="bg-white rounded-xl p-6 border border-emerald-100">
            <p className="text-gray-700 leading-relaxed">
              <strong>What "good" looks like:</strong> the predicted curve should overlap the real curve, especially around seasonal peaks. Errors usually grow during extreme months or structural changes (e.g., disruptions).
            </p>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Model Performance</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-600 mb-2">Training Samples</div>
              <div className="text-3xl font-black text-emerald-900 mb-2">27,347</div>
              <div className="text-sm text-gray-600">Monthly rows across all parks used to fit the model</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-600 mb-2">Testing Samples</div>
              <div className="text-3xl font-black text-teal-900 mb-2">6,703</div>
              <div className="text-sm text-gray-600">Held-out future months used to simulate forecasting</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-600 mb-2">MAE</div>
              <div className="text-3xl font-black text-blue-900 mb-2">21,666</div>
              <div className="text-sm text-gray-600">Average absolute error in visits per month</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-600 mb-2">RMSE</div>
              <div className="text-3xl font-black text-purple-900 mb-2">51,582</div>
              <div className="text-sm text-gray-600">Penalizes large misses more heavily</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            <img 
              src="/model/monthly_actual_vs_pred.png" 
              alt="Actual vs Predicted Monthly Visits"
              className="w-full object-contain"
            />
            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                <strong>Figure:</strong> Actual vs predicted monthly visits during the test period. A tight overlap indicates the model captures seasonality and broader trend.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 rounded-xl p-6 border border-amber-200">
            <p className="text-amber-900 leading-relaxed">
              <strong>Reading the metrics:</strong> MAE ≈ 21.7k means the model's typical monthly miss is about 21,700 visits. RMSE is larger (≈ 51.6k) because it grows more when the model makes a few large errors.
            </p>
          </div>
        </div>

        {/* Problem Definition & Features - Side by Side */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Problem Definition</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We predict <strong>monthly visits</strong> for U.S. parks using historical visitation patterns. This is a supervised regression task where each row represents a park-month and the label is total visits for that month.
            </p>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data & Granularity</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Unit:</strong> (Park, Year, Month)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Target:</strong> Monthly total visits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Goal:</strong> Predict future months using only past information</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Feature Engineering</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The model relies heavily on "what happened recently" and "what typically happens this time of year." We add lag and rolling statistics to encode those signals.
            </p>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Core Features</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">→</span>
                  <span><strong>Time:</strong> Year, Month (captures long-term trend)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">→</span>
                  <span><strong>Lags:</strong> lag_1, lag_3, lag_12 (recent history)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">→</span>
                  <span><strong>Rolling means:</strong> roll_mean_3, roll_mean_6</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">→</span>
                  <span><strong>Categorical:</strong> ParkName, season (one-hot)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-sm text-gray-700">
                <strong>Why lag_12 matters:</strong> visitation is strongly seasonal, so last year's same-month value often provides a strong baseline.
              </p>
            </div>
          </div>
        </div>

        {/* Model Choice & Evaluation */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Model Choice</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We use a <strong>Random Forest Regressor</strong> because it handles non-linear interactions well, works with mixed feature types after encoding, and provides a strong baseline without heavy tuning.
            </p>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pipeline Structure</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span><strong>Preprocess:</strong> One-hot encode categorical features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span><strong>Fit:</strong> RandomForestRegressor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span><strong>Predict:</strong> On held-out future months</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> Random forests don't naturally extrapolate trends far into the future. They perform best when future conditions resemble the training distribution.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Evaluation Methodology</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We evaluate using a <strong>time-based split</strong> so the test set represents "future" data. This is critical for forecasting problems.
            </p>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Split:</strong> Train on earlier years, test on later years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Metrics:</strong> MAE and RMSE</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Visual:</strong> Actual vs predicted curves for sanity checking</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-sm text-gray-700">
                <strong>What we look for:</strong> (1) peak timing correct, (2) peak magnitude close, (3) no systematic over/under prediction over long periods.
              </p>
            </div>
          </div>
        </div>

        {/* Limitations & Tech Stack */}
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitations & Next Steps</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Current Limitations</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>No explicit weather, holidays, wildfire closures, or macroeconomic variables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Structural breaks (e.g., disruptions) can reduce accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Less reliable for parks with sparse or highly volatile history</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Next Improvements</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Add exogenous features (holiday calendars, weather aggregates, closures)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Try gradient boosting (XGBoost/LightGBM) or quantile models for uncertainty bands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Per-park models or hierarchical approach to capture unique park behavior</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-bold text-emerald-900">Python</span>
                <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-bold text-blue-900">Pandas</span>
                <span className="px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-sm font-bold text-purple-900">NumPy</span>
                <span className="px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-sm font-bold text-teal-900">Scikit-learn</span>
                <span className="px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-sm font-bold text-orange-900">Matplotlib</span>
                <span className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-bold text-gray-900">Joblib</span>
                <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-bold text-indigo-900">Next.js</span>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                The model is trained offline and the UI presents results and documentation for transparency.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Glossary</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div><strong>MAE:</strong> Average absolute error (in visits)</div>
                <div><strong>RMSE:</strong> Error metric that penalizes large misses more</div>
                <div><strong>Lag:</strong> Prior value of the target (e.g., last month)</div>
                <div><strong>Rolling mean:</strong> Average over recent months to smooth noise</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}