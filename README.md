# FoodShare AI 🥗 — Intelligent Surplus Food Redistribution Platform

FoodShareAI is an end-to-end, multi-role food rescue and distribution platform that connects Food Donors (restaurants, hotels, banquet halls, supermarkets), Verified NGOs (food banks, shelters, relief centers), and Community Volunteers with administrative oversight.

The system employs custom machine learning inference models, deterministic heuristic algorithms, real-time WebSocket telemetry, and role-based security to minimize food waste, accelerate distribution times, and provide transparent environmental impact analytics.

---

## 1. System Architecture

```
                                  +-------------------------------------------------------+
                                  |         FoodShareAI Mobile & Web Client               |
                                  |     (React Native / Expo SDK 57 / JavaScript)         |
                                  +-------------------------------------------------------+
                                             |                                 ^
                                     REST / HTTPS (JWT)                   WebSockets (ws://)
                                             v                                 |
+------------------------------------------------------------------------------+------+
|                              Core Backend Application (Node.js / Express.js)        |
|                                                                                     |
|  * Auth & RBAC (JWT, bcrypt, roleMiddleware)    * A* Route Optimization Engine     |
|  * Donation Lifecycle & Storage Abstraction     * Impact Analytics & Gamification   |
|  * KNN Smart Matching Engine (5 Weighted Factors)* Food Safety & Duplicate Hashing  |
|  * Audit Logging & Operational Intelligence     * Socket.IO Real-Time GPS Streaming |
+-------------------------------------------------------------------------------------+
              |                                                           |
     Async HTTP / JSON Fallback                                      Mongoose ODM
              v                                                           v
+---------------------------------------------+       +-------------------------------+
|  Custom ML Microservice (Python / FastAPI)  |       |       MongoDB Database        |
|                                             |       |                               |
|  * YOLOv8: Food Detection                   |       |  * Users & Role Profiles      |
|  * EfficientNet-B0: Freshness Classification|       |  * Donations & AI Analysis    |
|  * YOLOv8-Seg + Regression: Quantity Volume |       |  * Claims & Deliveries        |
|  * XGBoost: Expiry & Shelf-Life             |       |  * Impact & Gamification      |
|  * PyTorch LSTM: Time-Series Demand         |       |  * Audit Logs & Risk Alerts   |
|  * Isolation Forest: Behavioral Anomalies   |       |  * GeoJSON 2dsphere Indexes   |
+---------------------------------------------+       +-------------------------------+
```

---

## 2. Artificial Intelligence & Algorithmic Stack

FoodShareAI uses custom machine learning and heuristic models without third-party LLM API dependencies.

| Model / Algorithm | Task & Function | Technology Stack |
| :--- | :--- | :--- |
| **YOLOv8** | Multi-class food object detection & classification from donor photos | Ultralytics, PyTorch |
| **EfficientNet-B0** | Deep visual freshness grading (`FRESH`, `GOOD`, `MODERATE`, `EXPIRING`, `UNSAFE`) | PyTorch, torchvision |
| **YOLOv8-Seg + Ridge** | Instance segmentation mask volume estimation and serving count regression | Ultralytics, scikit-learn |
| **XGBoost** | Tabular shelf-life and safe consumption window prediction | XGBoost, NumPy |
| **PyTorch LSTM** | Multi-step chronological time-series food category demand forecasting | PyTorch (`nn.LSTM`) |
| **Isolation Forest** | Unsupervised behavioral anomaly detection for rapid submission fraud risks | scikit-learn (`IsolationForest`)|
| **KNN (K-Nearest Neighbors)** | Multi-factor weighted donor-to-NGO candidate discovery and scoring (0-100) | Custom deterministic heuristic |
| **A\* Search** | Admissible Great-Circle heuristic shortest-path delivery routing | PriorityQueue, GeoJSON LineString |

---

## 3. Platform Modules & User Roles

FoodShareAI supports 4 isolated system roles protected by server-side Role-Based Access Control (RBAC):

1. **Donors (Restaurants, Caterers, Households, Grocers)**
   - Draft and publish surplus food listings.
   - Run AI image analysis for automatic food category, freshness, and quantity estimation.
   - Set flexible pickup windows and dietary tags.
   - Track live donation progress and environmental impact (kg rescued, meals shared, CO₂ avoided).

2. **NGOs (Charities, Food Banks, Community Kitchens)**
   - Discover available surplus food geographically.
   - View explainable KNN smart match compatibility scores (distance, capacity, dietary match, urgency).
   - Claim published donations with atomic concurrency guarantees.
   - Review demand forecasts to align receiving capacity.

3. **Volunteers (Food Rescue Couriers)**
   - Discover available delivery tasks near their live location.
   - Atomically accept delivery tasks without double-assignment race conditions.
   - View A* optimized delivery routes with turn-by-turn waypoints, distance (km), and ETA.
   - Stream throttled GPS location updates to authorized donor and NGO participants.
   - Submit photo proof of delivery and log completion.
   - Earn gamification points (+75 per delivery) and unlock achievement badges (`b11`-`b15`).

4. **Administrators (Platform Operations & Governance)**
   - Consolidated Operations Intelligence Center.
   - First-in-first-reviewed NGO verification queue (`VERIFIED`, `REJECTED`, `UNDER_REVIEW`).
   - User account lifecycle management with self-deactivation safeguards.
   - Real-time geospatial map intelligence (hotspots, clusters, active routes).
   - Advisory food safety and behavioral anomaly alerts.
   - Immutable audit logging with automatic credential sanitization.

---

## 4. Repository Structure

```
SurplusAI/
├── App.js                         # React Native root component
├── app.json                       # Expo configuration & permissions
├── package.json                   # Frontend dependencies (Expo SDK 57, React 19)
├── .env.example                   # Frontend environment template
│
├── src/                           # Mobile / Web Application Source
│   ├── components/                # Reusable UI cards, maps, modals, badges
│   ├── navigation/                # Role-based Tab & Stack navigation
│   ├── screens/                   # Donor, NGO, Volunteer, and Admin screens
│   ├── services/
│   │   ├── api/                   # apiClient, tokenStorage, donor/ngo/volunteer/admin API
│   │   ├── ai/                    # aiService (connected to backend with fallback)
│   │   ├── impact/                # impactService (caching & backend sync)
│   │   ├── matching/              # matchingService (connected to recommendations)
│   │   └── notification/          # notificationService
│   ├── store/                     # Zustand state management
│   └── theme/                     # Design tokens, typography, and color palette
│
├── backend/                       # Node.js / Express.js Core Backend
│   ├── package.json               # Backend dependencies & 13 test scripts
│   ├── .env.example               # Backend environment template
│   ├── src/
│   │   ├── app.js                 # Express app (Helmet, CORS, rate limiting)
│   │   ├── server.js              # HTTP server & graceful shutdown handler
│   │   ├── config/                # Database connection (MongoDB Atlas ready)
│   │   ├── controllers/           # Auth, donor, donation, ngo, volunteer, admin controllers
│   │   ├── middleware/            # JWT authentication, role authorization, errorHandler
│   │   ├── models/                # 10 Mongoose schemas with GeoJSON indexes
│   │   ├── routes/                # 14 REST route modules mounted under /api/*
│   │   ├── scripts/               # 13 automated test suites + seed.js + createAdmin.js
│   │   ├── services/              # Business logic, KNN, A*, impact, storage, audit logs
│   │   ├── socket/                # Socket.IO delivery rooms & GPS location broadcasting
│   │   └── utils/                 # Password hashing, JWT generation, GeoJSON helpers
│
└── ml-service/                    # Standalone Custom ML Microservice (FastAPI)
    ├── app.py                     # FastAPI application entry point
    ├── requirements.txt           # Python dependencies (PyTorch, FastAPI, scikit-learn)
    ├── .env.example               # ML microservice environment template
    ├── config/                    # Model path registry and LSTM hyperparameters
    ├── models/                    # Model weights directory (*.pt, *.pth, *.joblib)
    ├── routes/                    # Inference endpoints (/health, /api/ml/*)
    ├── services/                  # Food detection, freshness, quantity, demand, fraud
    └── utils/                     # Feature extraction and image decoding utilities
```

---

## 5. Prerequisites & Environment Setup

### System Prerequisites
- **Node.js**: v18.x or v20.x+
- **npm**: v9.x+
- **Python**: v3.10, v3.11, v3.12, or v3.13
- **MongoDB**: v6.0+ (Local Community Server or MongoDB Atlas cluster connection string)

### Environment Configuration

#### 1. Backend Configuration
Copy `backend/.env.example` to `backend/.env`:
```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:8081
MONGODB_URI=mongodb://127.0.0.1:27017/foodshareai
JWT_SECRET=super_secure_foodshare_jwt_secret_key_change_in_production_32chars
JWT_EXPIRES_IN=1d
ML_SERVICE_URL=http://localhost:8000
ML_FRAUD_TIMEOUT_MS=3000
LOCATION_UPDATE_INTERVAL_MS=3000
PUSH_TIMEOUT_MS=5000
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@foodshareai.org
ADMIN_PASSWORD=AdminSecurePass123!
```

#### 2. ML Service Configuration
Copy `ml-service/.env.example` to `ml-service/.env` (optional, defaults apply):
```ini
ML_SERVICE_PORT=8000
ML_SERVICE_HOST=0.0.0.0
```

#### 3. Frontend Configuration
Copy `.env.example` to `.env` at the project root:
```ini
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```
*(For physical mobile devices, replace `localhost` with your workstation's LAN IP address).*

---

## 6. Execution Guide

### Running the Backend Server
```bash
cd backend
npm install
npm run dev        # Starts server with auto-reload at http://localhost:5000
# or: npm start    # Production start
```

### Running the Python ML Microservice
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Running the Mobile / Web Client (Expo)
```bash
# In the root directory:
npm install
npm run web        # Web browser preview
# or: npm run android # Android emulator / connected device
# or: npm start       # Expo Go developer launcher
```

### Seeding Development Demo Data
To populate sample donors, NGOs, volunteers, and listings with working logins (`Password123!`):
```bash
cd backend
npm run seed
```

### Creating an Administrator Account
```bash
cd backend
npm run create-admin
```

---

## 7. Automated Test Suites

FoodShareAI includes 13 automated test suites covering all backend features:

```bash
cd backend

# Run comprehensive system integration & concurrency suite
npm run test:integration

# Run specific domain test suites
npm run test:models         # Schema validation, constraints, GeoJSON Point/LineString
npm run test:auth           # JWT lifecycle, bcrypt hashing, RBAC boundaries
npm run test:donor          # Donation creation, drafts, publisher authorization
npm run test:ngo            # KNN matching factors & atomic claiming
npm run test:volunteer      # Delivery state machine & transition rules
npm run test:ai             # ML integration client, timeout resilience, offline fallback
npm run test:demand         # LSTM time-series forecast contracts
npm run test:route          # A* search algorithm & GeoJSON route geometry
npm run test:safety         # Food safety monitoring, duplicate hashing, risk review
npm run test:notifications  # Push token registration, in-app events, error tolerance
npm run test:admin          # Operations dashboard, NGO verification queue, audit logs
npm run test:impact         # Gamification progression, badges, leaderboard privacy
```

---

## 8. Platform Feature & Integration Status Matrix

| Module / Capability | Implemented | Integrated | Tested | Runtime / External Dependency |
| :--- | :---: | :---: | :---: | :--- |
| **Authentication & RBAC** | ✅ Yes | ✅ Yes | ✅ Yes | None (Node.js crypto / bcrypt) |
| **Donor Management** | ✅ Yes | ✅ Yes | ✅ Yes | MongoDB |
| **NGO Discovery & Claims** | ✅ Yes | ✅ Yes | ✅ Yes | MongoDB (Atomic `findOneAndUpdate`) |
| **Volunteer Logistics** | ✅ Yes | ✅ Yes | ✅ Yes | MongoDB |
| **Admin Operations Center** | ✅ Yes | ✅ Yes | ✅ Yes | MongoDB |
| **AI Food Detection (YOLOv8)**| ✅ Yes | ✅ Yes | ✅ Yes | Python ML service / model weights (`best.pt`) |
| **Freshness (EfficientNet-B0)**| ✅ Yes | ✅ Yes | ✅ Yes | Python ML service / weights (`.pth`) |
| **Quantity Regression (Seg)**| ✅ Yes | ✅ Yes | ✅ Yes | Python ML service / weights (`.joblib`) |
| **Expiry Forecast (XGBoost)**| ✅ Yes | ✅ Yes | ✅ Yes | Python ML service / weights (`.joblib`) |
| **Demand Prediction (LSTM)** | ✅ Yes | ✅ Yes | ✅ Yes | Python ML service / historical DB records |
| **KNN Smart Matching** | ✅ Yes | ✅ Yes | ✅ Yes | None (Internal heuristic algorithm) |
| **A\* Route Optimization** | ✅ Yes | ✅ Yes | ✅ Yes | None (Internal heuristic algorithm) |
| **GPS Tracking & Sockets** | ✅ Yes | ✅ Yes | ✅ Yes | Socket.IO (WebSockets) |
| **Behavioral Risk (IsoForest)**| ✅ Yes | ✅ Yes | ✅ Yes | Python ML service / scikit-learn |
| **Duplicate Image Hashing** | ✅ Yes | ✅ Yes | ✅ Yes | None (MD5/SHA perceptual hash) |
| **Food Safety Rules Engine** | ✅ Yes | ✅ Yes | ✅ Yes | None (Timestamp/Freshness rules) |
| **Notification Pipeline** | ✅ Yes | ✅ Yes | ✅ Yes | Expo Push Service (optional live push) |
| **Impact & CO₂ Telemetry** | ✅ Yes | ✅ Yes | ✅ Yes | MongoDB |
| **Gamification & Badges** | ✅ Yes | ✅ Yes | ✅ Yes | MongoDB |
| **Audit Logging System** | ✅ Yes | ✅ Yes | ✅ Yes | MongoDB |

*Note on AI Inference: If ML model weights are absent in a development environment, the system honestly reports `MODEL_NOT_LOADED` without crashing or synthesizing fake outputs.*

---

## 9. Security & Governance Standards

- **Zero Fabricated Data**: If an external service or model is offline, the system returns honest error states (`UNREACHABLE` / `MODEL_NOT_LOADED`) rather than invented telemetry.
- **Admin Isolation**: Public registration strictly rejects `ADMIN` registration attempts with HTTP 403 Forbidden. Administrators can only be provisioned via controlled administrative scripts.
- **Atomic Concurrency**: Simultaneous NGO claims or volunteer task acceptances use atomic MongoDB operations; exactly one request wins while competing attempts receive HTTP 409 Conflict.
- **Idempotent Transactions**: Retried delivery completions never double-count impact points, kilograms, or meals.
- **Privacy Protection**: Public leaderboards strictly omit passwords, password hashes, email addresses, phone numbers, and exact home GPS coordinates.
- **Audit Sanitization**: Audit logs automatically redact tokens, passwords, hashes, and secrets before writing to the database.

---

## 10. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
