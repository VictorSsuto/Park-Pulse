# 🌲 Park Pulse

**Park Pulse** is a web application that forecasts crowd levels for U.S. National Parks and visualizes them on an interactive map.  
Users can explore parks, view predicted visitation trends, and discover destinations that match their interests.

🔗 **Live Demo:** https://park-pulse-one.vercel.app/

---

## ✨ Features

- 🗺️ Interactive U.S. map with clustered park markers
- 📊 Monthly crowd level forecasts (Low / Medium / High)
- 🏞️ Dedicated pages for each national park
- 🔍 Smart park slug routing (`/parks/<park-name>`)
- ⚡ Fast, modern UI built with Next.js + React
- ☁️ Deployed on Vercel

---

## 🧱 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Leaflet / React-Leaflet
- Marker clustering for performance

**Data & Visualization**
- D3
- Preprocessed park and forecast datasets

**Deployment**
- Vercel
- Node.js 20.x

---

## 📁 Project Structure

```
Park-Pulse/
├── app/ # Next.js application (deployed)
│ ├── public/ # Static assets (park images, icons)
│ ├── src/
│ │ ├── app/ # App Router pages
│ │ ├── components/ # Reusable UI components
│ │ └── lib/ # Utilities and helpers
│ ├── package.json
│ └── next.config.ts
├── api/ # Backend / API experiments
├── data/ # Datasets and preprocessing
├── ml/ # Forecasting / ML experiments
└── README.md
```

---
