# ParkPulse 🌲

**ParkPulse** is a full-stack machine learning web application that forecasts crowding levels at U.S. National Parks and helps users choose the best parks and months to visit based on predicted visitation patterns.

---

## What ParkPulse Does

- Forecasts monthly visitation for all U.S. National Parks  
- Converts raw visit predictions into **crowding levels** (low / medium / high), computed **per park**  
- Exposes predictions through a fast, lightweight API  
- Displays results in a modern web interface (interactive UI in progress)

---

## How It Works (High Level)

1. **Historical Data**
   - National Park Service monthly visitation data

2. **Modeling**
   - Time-series feature engineering (lags, rolling means, seasonality)
   - Machine learning model trained once
   - Forecasts generated **offline** for all parks

3. **API**
   - Serves precomputed forecasts from CSV
   - No model inference at request time (fast + scalable)

4. **Frontend**
   - Fetches data from the API
   - Displays park list and forecasts
   - Future: interactive US map, search, recommendations

---

## Tech Stack

### Backend & ML
- Python
- Pandas / NumPy
- scikit-learn
- FastAPI

### Frontend
- Next.js (React, App Router)
- TypeScript
- Fetch API

### Other
- CSV-based forecast storage
- Docker (planned)

---

## Project Structure

