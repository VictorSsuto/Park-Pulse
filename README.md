# 🌲 ParkPulse

**Smart National Park Visitation Forecasting**

ParkPulse is a full-stack machine learning web application that forecasts crowding levels at U.S. National Parks and helps users choose the best parks and months to visit based on predicted visitation patterns.

---

## 🎯 What ParkPulse Does

- **Forecasts** monthly visitation for all U.S. National Parks
- **Converts** raw visit predictions into crowding levels (low / medium / high), computed per park
- **Exposes** predictions through a fast, lightweight API
- **Displays** results in a modern web interface (interactive UI in progress)

---

## 🔍 How It Works

### 1. Historical Data
Uses National Park Service monthly visitation data as the foundation for predictions.

### 2. Modeling
- Time-series feature engineering (lags, rolling means, seasonality)
- Machine learning model trained once
- Forecasts generated offline for all parks

### 3. API
- Serves precomputed forecasts from CSV
- No model inference at request time (fast + scalable)

### 4. Frontend
- Fetches data from the API
- Displays park list and forecasts
- **Coming soon:** interactive US map, search, recommendations

---

## 🛠️ Tech Stack

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

## 📁 Project Structure

```
Park-Pulse/
├── api/                      # FastAPI backend
│   └── main.py              # API entry point (/parks, /forecast)
│
├── ml/                       # Modeling & forecasting
│   ├── train.py
│   ├── forecast.py
│   ├── run_forecast.py
│   └── artifacts/           # Saved models
│
├── app/                      # Next.js frontend
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   └── lib/             # API helpers
│   └── package.json
│
├── data/
│   ├── raw/                 # Original NPS data
│   └── processed/           # Modeling datasets & forecasts
│
├── venv/                     # Python virtual environment
├── requirements.txt
└── README.md
```

---

## 🚀 Running the Project Locally

You'll need **two terminals**: one for the backend and one for the frontend.

### Backend (FastAPI)

From the project root:

```bash
# Activate the virtual environment
source venv/bin/activate

# Start the backend server
uvicorn api.main:app --reload
```

The backend will run at: **http://127.0.0.1:8000**

Test it by opening: **http://127.0.0.1:8000/parks**

### Frontend (Next.js)

In a second terminal:

```bash
# Navigate to the frontend folder
cd app

# Start the development server
npm run dev
```

The frontend will run at: **http://localhost:3000**

---

## ⚙️ Environment Configuration

The frontend uses an environment variable to reach the backend.

**File:** `app/.env.local`

```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

---

## 📡 API Endpoints

### `GET /parks`

Returns a list of all parks with available forecasts.

**Example response:**
```json
{
  "count": 63,
  "parks": ["Acadia", "Yosemite", "..."]
}
```

### `GET /forecast`

Returns predicted visits and crowd levels for the selected park.

**Query parameters:**
- `park` (string) — Park name
- `months` (int, default = 36) — Number of months to forecast

**Example request:**
```
/forecast?park=Yosemite&months=12
```

---

## 🎯 Future Enhancements

- Interactive U.S. map with park locations
- Advanced search and filtering
- Personalized park recommendations
- Docker containerization
- Crowd trend visualizations

---

## 📄 License

This project is open source and available for educational and personal use.

---

**Built with ❤️ for National Park enthusiasts**
