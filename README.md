# SurplusAI (FoodShareAI) 🥗 — Intelligent Surplus Food Redistribution Platform

SurplusAI is a production-grade, multi-role food rescue and distribution platform that connects **Food Donors** (restaurants, hotels, banquet halls, supermarkets), **Verified NGOs** (food banks, shelters, relief centers), and **Community Volunteers** with comprehensive administrative oversight.

The system employs custom machine learning inference models, deterministic heuristic algorithms, real-time WebSocket telemetry, interactive OpenStreetMap geospatial tracking, and role-based security to minimize food waste, accelerate distribution times, and provide transparent environmental impact analytics.

---

## 1. System Architecture

```text
                                  +-------------------------------------------------------+
                                  |            SurplusAI Mobile & Web Client              |
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
|  * KNN Smart Matching Engine (6 Weighted Factors)* Food Safety & Duplicate Hashing  |
|  * Audit Logging & Operational Intelligence     * Socket.IO Real-Time GPS Streaming |
+-------------------------------------------------------------------------------------+
              |                                                           |
     Async HTTP / JSON Fallback                                      Mongoose ODM
              v                                                           v
+---------------------------------------------+       +-------------------------------+
|  Custom ML Microservice (Python / FastAPI)  |       |       MongoDB Database        |
|                                             |       |                               |
|  * YOLOv8: Food Detection (30 Classes)      |       |  * Users & Role Profiles      |
|  * EfficientNet-B0: Freshness Classification|       |  * Donations & AI Analysis    |
|  * YOLOv8-Seg + Ridge: Quantity Volume (kg) |       |  * Claims & Deliveries        |
|  * XGBoost: Expiry & Shelf-Life Hours       |       |  * Impact & Gamification      |
|  * PyTorch LSTM: Time-Series Demand         |       |  * Audit Logs & Risk Alerts   |
|  * Isolation Forest: Behavioral Anomalies   |       |  * GeoJSON 2dsphere Indexes   |
+---------------------------------------------+       +-------------------------------+
```

---

## 2. Artificial Intelligence & Algorithmic Stack

SurplusAI uses custom machine learning and heuristic models without third-party LLM API dependencies:

| Model / Algorithm | Task & Function | Technology Stack |
| :--- | :--- | :--- |
| **YOLOv8n** | Multi-class food object detection (30 food classes mapped to 6 categories) | Ultralytics, PyTorch |
| **EfficientNet-B0** | Deep visual freshness grading (`FRESH`, `GOOD`, `MODERATE`, `EXPIRING`, `UNSAFE`) | PyTorch, torchvision |
| **YOLOv8-Seg + Ridge** | Instance segmentation mask volume estimation and serving count regression | Ultralytics, scikit-learn |
| **XGBoost** | Tabular shelf-life and safe consumption window prediction | XGBoost, NumPy |
| **PyTorch LSTM** | Multi-step chronological time-series food category demand forecasting | PyTorch (`nn.LSTM`) |
| **Isolation Forest** | Unsupervised behavioral anomaly detection for rapid submission fraud risks | scikit-learn (`IsolationForest`)|
| **KNN (K-Nearest Neighbors)** | Multi-factor weighted donor-to-NGO candidate discovery and scoring (0-100) | Custom deterministic heuristic |
| **A\* Search** | Admissible Great-Circle heuristic shortest-path delivery routing | PriorityQueue, GeoJSON LineString |

---

## 3. Platform Modules & User Roles

SurplusAI supports 4 isolated system roles protected by server-side Role-Based Access Control (RBAC):

1. **Donors (Restaurants, Caterers, Households, Grocers)**
   - Draft, edit, and publish surplus food listings.
   - Run AI image analysis for automatic food category, freshness, and quantity estimation.
   - Multi-mode photo input: Camera capture, native gallery selection, and curated demo presets.
   - 1-click sync from AI scan results directly into the donation creation flow.
   - Interactive OpenStreetMap location picker with reverse geocoding.
   - Track live donation progress and environmental impact (kg rescued, meals shared, CO₂ avoided).

2. **NGOs (Charities, Food Banks, Community Kitchens)**
   - Discover available surplus food geographically on interactive maps.
   - View explainable KNN smart match compatibility scores (distance, capacity, dietary match, urgency).
   - Claim published donations with atomic concurrency guarantees.
   - Review category demand forecasts to align receiving capacity.

3. **Volunteers (Food Rescue Couriers)**
   - Discover available delivery tasks near their live location.
   - Atomically accept delivery tasks without double-assignment race conditions.
   - Interactive Smart Route Navigation Card powered by A* route optimization with turn-by-turn simulation, live distance (km), and ETA.
   - Stream throttled GPS location updates to authorized donor and NGO participants over WebSockets.
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

```text
SurplusAI/
├── App.js                         # React Native root component
├── app.json                       # Expo configuration & permissions
├── package.json                   # Frontend dependencies (Expo SDK 57, React 19)
├── .env.example                   # Frontend environment template
│
├── src/                           # Mobile / Web Application Source
│   ├── components/                # Reusable UI cards, maps, modals, badges
│   │   ├── common/                # LocationPickerMap, OpenStreetMapViewer, ScreenHeader
│   │   ├── donor/                 # AIAnalysisScreen, AIScannerVisualizer, DonationReviewCard
│   │   ├── volunteer/             # SmartRouteCard, NearbyTasksList, ActiveDeliveryCard
│   │   └── navigation/            # ScreenBarSwitcher, AppHeader, RoleTabBar
│   ├── navigation/                # Role-based Tab & Stack navigation (AppNavigator)
│   ├── screens/                   # Donor, NGO, Volunteer, and Admin screens
│   │   ├── donor/                 # CreateDonationFlow, DonorDashboardScreen, MyDonationsScreen
│   │   ├── ngo/                   # DiscoverTabScreen, MyClaimsScreen, NgoDashboardScreen
│   │   ├── volunteer/             # VolunteerDashboardScreen, VolunteerRouteTabScreen
│   │   └── admin/                 # AdminDonationOperationsTab, NgoVerificationQueueTab
│   ├── services/
│   │   ├── api/                   # apiClient, socketClient, tokenStorage, role API services
│   │   ├── ai/                    # aiService, freshnessEstimator
│   │   ├── routes/                # volunteerRouteService (A* waypoint & simulation)
│   │   ├── location/              # locationService (GPS & geocoding)
│   │   ├── impact/                # impactService (caching & backend sync)
│   │   ├── matching/              # matchingService (KNN recommendations)
│   │   ├── __tests__/             # Unit tests for routing and location freshness
│   │   └── ai/__tests__/          # Unit tests for scanner, presets, and live flow
│   ├── store/                     # Zustand state management (useAppStore)
│   └── theme/                     # Design tokens, typography, and color palette
│
├── backend/                       # Node.js / Express.js Core Backend
│   ├── package.json               # Backend dependencies & 18 test scripts
│   ├── .env.example               # Backend environment template
│   ├── src/
│   │   ├── app.js                 # Express app (Helmet, CORS, rate limiting)
│   │   ├── server.js              # HTTP server & graceful shutdown handler
│   │   ├── config/                # Database connection (MongoDB Atlas ready)
│   │   ├── controllers/           # Auth, donor, donation, ngo, volunteer, admin controllers
│   │   ├── middleware/            # JWT authentication, role authorization, errorHandler
│   │   ├── models/                # 10 Mongoose schemas with GeoJSON indexes
│   │   ├── routes/                # REST route modules mounted under /api/*
│   │   ├── scripts/               # 18 automated test suites + seed.js + createAdmin.js
│   │   ├── services/              # Business logic, KNN, A*, impact, route optimization
│   │   ├── socket/                # Socket.IO delivery rooms & GPS location broadcasting
│   │   └── utils/                 # Password hashing, JWT generation, GeoJSON helpers
│   └── README.md                  # Comprehensive backend documentation
│
└── ml-service/                    # Standalone Custom ML Microservice (FastAPI)
    ├── app.py                     # FastAPI application entry point
    ├── requirements.txt           # Python dependencies (PyTorch, FastAPI, scikit-learn)
    ├── .env.example               # ML microservice environment template
    ├── config/                    # Model path registry and LSTM hyperparameters
    ├── models/                    # Model weights directory (*.pt, *.pth, *.joblib)
    ├── routes/                    # Inference endpoints (/health, /api/ml/*)
    ├── services/                  # Food detection, freshness, quantity, demand, fraud
    ├── training/                  # Training pipelines (YOLOv8n train, resume, eval)
    ├── tests/                     # Candidate verification & category mapping tests
    ├── colab_preparation/         # Google Colab free GPU training notebook & manifests
    └── README.md                  # Comprehensive ML service documentation
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

SurplusAI includes comprehensive automated test suites covering all backend domains, frontend unit contracts, and ML microservice pipelines:

### 1. Backend Test Suites (Node.js)
```bash
cd backend

# End-to-end multi-role system integration
npm run test:integration

# Verification of live donation to delivery flow
node src/scripts/verifyLiveDonationFlow.js

# Category mapping contract (30 vision classes to 6 categories)
node src/scripts/testCategoryMappingContract.js

# Role routing and navigation guards
node src/scripts/testPhase1RoleRouting.js

# Splash and layout responsiveness
node src/scripts/testPhase2SplashLayout.js

# Backend client resilient networking and timeout fallback
node src/scripts/testPhase3Networking.js

# Domain-specific test suites
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

### 2. Frontend Test Suites (React Native / Jest)
```bash
# In the root directory:
# Tests for volunteer route optimization and OSM coordinates
node src/services/__tests__/testVolunteerRouteOptimization.test.js
node src/services/__tests__/testRealtimeLocationFreshness.test.js

# Tests for AI scanner UI redesign, photo selection, and preset modes
node src/services/ai/__tests__/testAIScannerUIRedesign.test.js
node src/services/ai/__tests__/testAIScannerImageSelection.test.js
node src/services/ai/__tests__/testCreateDonationPhotoSelection.test.js
node src/services/ai/__tests__/verifyAiServiceLive.test.js
node src/services/ai/__tests__/verifyEndToEndScannerToDonation.test.js
```

### 3. ML Microservice Test Suites (Python / pytest)
```bash
cd ml-service

# Run candidate weights verification
python -m pytest tests/test_candidate_verification.py -v

# Run 30-class to 6-category mapping contract verification
python -m pytest tests/test_category_mapping_integration.py -v
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
| **Interactive OpenStreetMap** | ✅ Yes | ✅ Yes | ✅ Yes | OpenStreetMap Tiles / Leaflet WebView |
| **Smart Route Card & ETA** | ✅ Yes | ✅ Yes | ✅ Yes | Internal polyline generator & waypoint engine |
| **AI Scanner Multi-Mode** | ✅ Yes | ✅ Yes | ✅ Yes | `expo-image-picker` / camera & presets |
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
