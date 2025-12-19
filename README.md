# 🚗 Vehicle Health Monitor

A comprehensive full-stack vehicle health monitoring system with real-time sensor data tracking, alerts, and analytics dashboard.

![Vehicle Health Monitor](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **🔐 User Authentication** - Secure JWT-based authentication system
- **🚙 Vehicle Management** - Add, view, update, and delete vehicles
- **📊 Real-time Monitoring** - Track RPM, temperature, battery, fuel levels
- **💯 Health Scoring** - Automated vehicle health assessment algorithm
- **🚨 Smart Alerts** - Automatic alerts for critical conditions
- **📈 Analytics Dashboard** - Interactive charts and trend visualization
- **📱 Responsive Design** - Optimized for desktop and mobile devices
- **⚡ Real-time Updates** - Live data synchronization

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Vite 7.2.4** - Fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js & Express** - Server runtime and framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- **Node.js** v20 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/vehicle-health-monitor.git
cd vehicle-health-monitor
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Environment Setup

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vehicle-health-monitor
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. Database Setup

**Local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**MongoDB Atlas:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `backend/.env`

### 5. Seed Database (Optional)
```bash
cd backend
npm run seed
```

## 🎯 Usage

### Start Development Servers

**Backend Server:**
```bash
cd backend
npm run dev
# Server: http://localhost:5000
```

**Frontend Application:**
```bash
cd frontend
npm run dev
# App: http://localhost:5173
```

### Demo Credentials
- **Email:** `demo@example.com`
- **Password:** `demo123`

## 📚 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | Get all vehicles |
| GET | `/api/vehicles/:id` | Get single vehicle |
| POST | `/api/vehicles` | Create vehicle |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |

### Sensors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sensors/vehicle/:vehicleId` | Get sensor data |
| POST | `/api/sensors` | Add sensor reading |
| GET | `/api/sensors/stats/:vehicleId` | Get sensor statistics |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | Get all alerts |
| GET | `/api/alerts/vehicle/:vehicleId` | Get vehicle alerts |
| PUT | `/api/alerts/:id/read` | Mark alert as read |
| DELETE | `/api/alerts/:id` | Delete alert |

## 📁 Project Structure

```
vehicle-health-monitor/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
npm run seed         # Seed database with sample data
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render/Heroku)
```bash
cd backend
# Set environment variables
# Deploy backend folder
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for utility-first styling
- MongoDB for the database solution
- All open-source contributors

## 📞 Support

If you have any questions or need help, please open an issue or contact:

- **Email:** your.email@example.com
- **GitHub:** [@yourusername](https://github.com/yourusername)

---

⭐ **Star this repository if you found it helpful!**