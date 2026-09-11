# FoodShareAI Backend

Production-style Node.js + Express.js backend for FoodShareAI.

## Architecture Progress

- **Chunk 1**: Backend Foundation (Express setup, Helmet, CORS, Morgan, Rate Limiter, Health Endpoint)
- **Chunk 2**: MongoDB Database & Data Models (10 Mongoose Schemas, 2dsphere GeoJSON Indexes, Seed Script)
- **Chunk 3**: Authentication, JWT & Role-Based Access Control (bcryptjs, Stateless JWT, RBAC Middleware, Password Reset)
- **Chunk 4**: Donor Module & Donation APIs (Donor Profile CRUD, Donation Lifecycle, Image Storage Abstraction, AI Integration Point, Real Impact Analytics)
- **Chunk 5**: NGO Module + Food Discovery + Smart Matching Foundation (Geospatial Discovery, Explainable 6-Factor Matching, KNN Candidate Selection, Atomic Concurrency Claim Lock, Claims History, Real NGO Dashboard)
- **Chunk 6**: Volunteer Module + Delivery Management Foundation (Volunteer Profile, Real Dashboard, Delivery Task Discovery, Atomic Acceptance Lock, Controlled 7-Stage State Machine, Proof of Delivery, Completion Lifecycle, Real Volunteer Impact)
- **Chunk 7**: AI/ML Service Integration + Food Analysis Pipeline (FastAPI Microservice, YOLOv8, EfficientNet-B0, YOLOv8-Seg + Quantity Regression, XGBoost Expiry/Safety, Zero Fake Predictions, Fallback Resilience)
- **Chunk 8**: Demand Prediction + Operational Intelligence (PyTorch LSTM Microservice, Demand Forecast Storage, Sliding Window Preprocessing, Zero Fake Forecasts, Admin Operational Intelligence, NGO Demand Insights, Smart Matching Signal)
- **Chunk 9**: A* Route Optimization + Real-Time Delivery Tracking (f(n) = g(n) + h(n), Modular RouteGraph, GeoJSON LineString Route Storage & Reuse, Socket.IO Delivery Rooms, JWT Handshake Auth, 3s GPS Rate Throttling)
- **Chunk 10**: Fraud Detection + Duplicate Donation Detection + Food Safety Monitoring (scikit-learn Isolation Forest Anomaly Engine, Explainable Multi-Factor Duplicate Detection, Deterministic Food Safety Monitoring, Admin Governance Feeds & Review Audit Trails)
- **Chunk 11**: Notifications + Alerts + Event-Driven Communication (In-App Notification Feed, Unread Counter, Cooldown Deduplication, Push Notification Service with Expo Push API, Socket.IO notification:new Private Channels, Domain Event Emitters across Donors, NGOs, Volunteers, and Admins)

---

## Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Mongoose database connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, adminLogin, reset password
│   │   ├── deliveryController.js # Available tasks, accept, status, pickup, proof, complete
│   │   ├── donationController.js # Create, list, edit, cancel, publish, and analyze donations
│   │   ├── donorController.js    # Donor profile and real impact analytics
│   │   ├── healthController.js   # Health check controller
│   │   ├── ngoController.js      # NGO profile, discovery, matching, claims, and dashboard
│   │   └── volunteerController.js# Volunteer profile, real dashboard, and impact metrics
│   ├── middleware/
│   │   ├── authMiddleware.js     # Bearer JWT verification & req.user attachment
│   │   ├── errorHandler.js       # Centralized error handler
│   │   ├── notFoundHandler.js    # 404 Route Not Found handler
│   │   └── roleMiddleware.js     # Role authorization guard (authorizeRoles)
│   ├── models/                   # Modular Mongoose Data Models
│   │   ├── User.js               # Central identity model (Donor, NGO, Volunteer, Admin)
│   │   ├── DonorProfile.js       # Donor organization profile with GeoJSON Point
│   │   ├── NgoProfile.js         # Recipient NGO profile with capacity metrics
│   │   ├── VolunteerProfile.js   # Volunteer profile with travel radius & availability
│   │   ├── Donation.js           # Surplus food listing with pickup times & status
│   │   ├── AIAnalysis.js         # Custom ML vision/freshness inference schema
│   │   ├── Claim.js              # NGO claim allocation with match scoring factors
│   │   ├── Delivery.js           # Volunteer transit task with GeoJSON LineString route & status
│   │   ├── Notification.js       # In-app operational alerts
│   │   ├── Impact.js             # Sustainability and gamification metrics
│   │   └── index.js              # Central export hub for all models
│   ├── routes/
│   │   ├── aiRoutes.js           # /api/ai endpoints (Health, direct image analyze)
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── deliveryRoutes.js     # /api/deliveries endpoints
│   │   ├── donationRoutes.js     # /api/donations endpoints
│   │   ├── donorRoutes.js        # /api/donor endpoints
│   │   ├── healthRoutes.js       # /api/health endpoint
│   │   ├── index.js              # Aggregated API router
│   │   ├── ngoRoutes.js          # /api/ngo endpoints
│   │   └── volunteerRoutes.js    # /api/volunteer endpoints
│   ├── scripts/
│   │   ├── createAdmin.js        # Dedicated administrative account creation
│   │   ├── seed.js               # Development seed script (Demo accounts & donations)
│   │   ├── testAiIntegration.js  # AI/ML service integration and inference pipeline test suite
│   │   ├── testAuth.js           # Authentication & RBAC test suite
│   │   ├── testDonorDonations.js # Donor module & donation lifecycle test suite
│   │   ├── testModels.js         # Model validation & schema test suite
│   │   ├── testNgoMatching.js    # NGO module, matching engine & claim concurrency test suite
│   │   └── testVolunteerDelivery.js # Volunteer module & delivery lifecycle test suite
│   ├── services/
│   │   ├── aiAnalysisService.js  # Python ML microservice HTTP client & error handler
│   │   ├── authService.js        # Authentication, JWT, and password hashing logic
│   │   ├── deliveryService.js    # Delivery task creation, discovery, atomic accept, proof & completion
│   │   ├── deliveryStatusService.js # Centralized 7-stage state machine transition validation
│   │   ├── donationService.js    # Donation CRUD, validation, publishing, and AI analysis link
│   │   ├── donorService.js       # Donor profile & impact aggregation logic
│   │   ├── matchingService.js    # 6-Factor weighted smart matching engine & KNN candidate selection
│   │   ├── ngoService.js         # NGO discovery, matching, claim concurrency, and dashboard logic
│   │   ├── storageService.js     # Decoupled image upload & resolution abstraction
│   │   └── volunteerService.js   # Volunteer profile management and real dashboard aggregation
│   ├── utils/
│   │   ├── apiResponse.js        # Standardized API response utilities
│   │   ├── constants.js          # System constants & RBAC role definitions
│   │   ├── jwt.js                # Access token generation and verification
│   │   ├── matchingWeights.js    # Centralized matching score weights & thresholds
│   │   ├── password.js           # bcrypt password hashing and comparison
│   │   └── validators.js         # Input validation helpers
│   ├── app.js                    # Express app configuration & middleware pipeline
│   └── server.js                 # Server entry point & graceful shutdown
├── .env.example                  # Template for environment variables
├── .env                          # Local environment variables (git-ignored)
├── .gitignore                    # Git ignore file for backend
├── package.json                  # Dependencies and scripts
└── README.md                     # Documentation
```

---

## API Endpoints Reference

### 1. Health & AI Service
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Check server and database status |
| `GET` | `/api/ai/health` | Public | Check Python ML microservice health & loaded model versions |
| `POST` | `/api/ai/analyze` | Donor | Directly analyze a food image payload before publishing |
| `POST` | `/api/donations/:id/analyze` | Donor | Trigger food analysis pipeline for an existing donation |
| `GET` | `/api/donations/:id/analysis` | Donor | Retrieve recorded multi-model AI analysis for a donation |

### 2. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register DONOR, NGO, or VOLUNTEER (ADMIN strictly rejected with 403) |
| `POST` | `/api/auth/login` | Public | Login for public roles (returns JWT) |
| `POST` | `/api/auth/admin/login` | Public (Restricted) | Dedicated admin portal login (verifies role === ADMIN) |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user identity |
| `POST` | `/api/auth/forgot-password`| Public | Request password reset instructions |
| `POST` | `/api/auth/reset-password` | Public | Reset password using reset token |
| `POST` | `/api/auth/logout` | Authenticated | Stateless session termination |

### 3. Donor Management (`/api/donor`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/donor/profile` | DONOR | Get authenticated donor profile and organization metadata |
| `PUT` | `/api/donor/profile` | DONOR | Update organization name, contact, operating hours, coordinates |
| `GET` | `/api/donor/impact` | DONOR | Retrieve real aggregated impact metrics (meals, food saved, points) |

### 4. Food Donations (`/api/donations`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/donations` | DONOR | Create a new food donation (Status: `DRAFT`) |
| `GET` | `/api/donations/my` | DONOR | Get donor's own listings (supports `status`, `page`, `limit` params) |
| `GET` | `/api/donations/:id` | Authenticated | View donation details (donor ownership enforced) |
| `PUT` | `/api/donations/:id` | DONOR | Update draft donation (only permitted in `DRAFT` status) |
| `DELETE`| `/api/donations/:id` | DONOR | Delete `DRAFT` permanently or set published listing to `CANCELLED` |
| `POST` | `/api/donations/:id/publish` | DONOR | Publish validated draft (Status: `PUBLISHED`, ready for NGO matching) |
| `POST` | `/api/donations/:id/analyze` | DONOR | Dispatch food image to Python ML microservice integration point |
| `GET` | `/api/donations/:id/analysis` | DONOR | Retrieve food freshness and classification analysis |

### 5. NGO Management & Discovery (`/api/ngo`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/ngo/profile` | NGO | Get authenticated NGO profile, user identity, and capacity |
| `PUT` | `/api/ngo/profile` | NGO | Update organization details, food requirements, service area, and capacity |
| `GET` | `/api/ngo/donations` | NGO | Discover eligible published donations with spatial radius & category filters |
| `GET` | `/api/ngo/matches/:donationId` | NGO | Inspect deterministic 6-factor matching score and factor breakdown |
| `GET` | `/api/ngo/recommendations` | NGO | Retrieve candidate donations ranked by smart match score |
| `POST` | `/api/ngo/donations/:donationId/claim` | NGO | Atomic claim operation with duplicate & concurrency lock (PUBLISHED -> CLAIMED) |
| `GET` | `/api/ngo/claims` | NGO | Retrieve claim history belonging to the authenticated NGO |
| `GET` | `/api/ngo/claims/:id` | NGO | View specific claim details (ownership protected) |
| `GET` | `/api/ngo/dashboard` | NGO | Database-backed metrics: available count, active claims, capacity, impact |

### 6. Volunteer Management & Delivery Execution (`/api/volunteer`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/volunteer/profile` | VOLUNTEER | Retrieve authenticated volunteer profile, transport mode, and radius |
| `PUT` | `/api/volunteer/profile` | VOLUNTEER | Update volunteer contact, transport, availability, and coordinates |
| `GET` | `/api/volunteer/dashboard` | VOLUNTEER | Database-backed metrics: available tasks, active count, completed, impact |
| `GET` | `/api/volunteer/tasks` | VOLUNTEER | Discover eligible unassigned delivery tasks with spatial radius filter |
| `GET` | `/api/volunteer/tasks/:id` | VOLUNTEER | Inspect pickup and drop-off instructions without sensitive donor auth data |
| `POST` | `/api/volunteer/tasks/:id/accept` | VOLUNTEER | Atomic task acceptance with double-assignment concurrency lock |
| `GET` | `/api/volunteer/deliveries` | VOLUNTEER | View deliveries assigned to the authenticated volunteer |
| `GET` | `/api/volunteer/deliveries/:id` | VOLUNTEER | View assigned delivery details (ownership protected) |
| `PUT` | `/api/volunteer/deliveries/:id/status` | VOLUNTEER | Update delivery status through validated 7-stage state machine |
| `POST` | `/api/volunteer/deliveries/:id/pickup` | VOLUNTEER | Confirm food pickup at donor location (status: `PICKED_UP`) |
| `POST` | `/api/volunteer/deliveries/:id/proof` | VOLUNTEER | Record proof of delivery photo and recipient handover notes |
| `POST` | `/api/volunteer/deliveries/:id/complete` | VOLUNTEER | Complete delivery, update related donation & claim, award volunteer points |
| `GET` | `/api/volunteer/impact` | VOLUNTEER | Retrieve real volunteer statistics (completed count, meals, points) |

### 7. Demand & Operational Intelligence (`/api/demand` & `/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/demand/forecast` | NGO, ADMIN | Retrieve or generate food category demand predictions |
| `GET` | `/api/admin/intelligence/demand` | ADMIN | Aggregated operational intelligence, supply-demand gaps, category matrices |

---

## Delivery Lifecycle & State Machine

The delivery execution pipeline (`backend/src/services/deliveryStatusService.js`) enforces a deterministic, controlled transition model:

```text
[AVAILABLE / PENDING] ──(volunteer accepts)──> [ACCEPTED]
                                                    │
                                                    ▼
                                           [ARRIVING_FOR_PICKUP]
                                                    │
                                           (pickup confirmed)
                                                    ▼
                                              [PICKED_UP]
                                                    │
                                                    ▼
                                              [IN_TRANSIT]
                                                    │
                                                    ▼
                                               [ARRIVED]
                                                    │
                                                    ▼
                                              [DELIVERED]
                                                    │
                                           (proof of delivery)
                                                    ▼
                                              [COMPLETED]
```

- Unauthorized status jumps or backward regressions are rejected with `409 Conflict`.
- Double-assignment race conditions are eliminated using atomic database operations (`volunteerId: null` condition).

---

## Test Suites

```bash
# 1. Test Mongoose data models & GeoJSON indexes (offline)
npm run test:models

# 2. Test authentication, RBAC, and password reset workflows
npm run test:auth

# 3. Test donor profile, donation lifecycle, publish, and impact analytics
npm run test:donor

# 4. Test NGO profile, food discovery, smart matching engine, and claim concurrency
npm run test:ngo

# 5. Test volunteer profile, task discovery, delivery lifecycle & atomic accept
npm run test:volunteer

# 6. Test AI/ML service client, inference pipeline, models status & offline fallback
npm run test:ai

# 7. Test LSTM demand prediction, category normalization & operational intelligence
npm run test:demand

# 8. Test A* shortest-path routing, graph abstraction & Socket.IO GPS tracking
npm run test:route

# 9. Test Isolation Forest risk contract, duplicate detection & food safety rules
npm run test:safety

# 10. Test Notification CRUD, deduplication, Expo push client & domain event triggers
npm run test:notifications
```

---

## Frontend Integration Details

The frontend connects to the backend through a modular service architecture:
- **`src/services/api/apiConfig.js`**: Dynamic backend base URL (`EXPO_PUBLIC_API_URL` or loopback).
- **`src/services/api/tokenStorage.js`**: Hardware-encrypted JWT storage using `expo-secure-store`.
- **`src/services/api/apiClient.js`**: Automatically attaches `Authorization: Bearer <token>` and formats errors.
- **`src/services/api/authApiService.js`**: User registration, login, and admin authentication.
- **`src/services/api/donorApiService.js`**: Donor profile and donation creation/publishing APIs.
- **`src/services/api/ngoApiService.js`**: NGO profile, real-time discovery, match factors, claim execution, claims tracking, and dashboard.
- **`src/services/api/volunteerApiService.js`**: Volunteer profile, task discovery, atomic acceptance, delivery timeline progression, pickup confirmation, proof upload, and impact.
- **Session Restoration**: Handled automatically in `AppNavigator.js` on app mount.

