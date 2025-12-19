# Vehicle Health Monitor - Full Stack Application

A comprehensive vehicle health monitoring system with real-time sensor data tracking, alerts, and analytics.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication
- **Vehicle Management**: Add, view, update, and delete vehicles
- **Real-time Monitoring**: Track RPM, temperature, battery, fuel levels
- **Health Scoring**: Automated vehicle health assessment
- **Alerts System**: Automatic alerts for critical conditions
- **Analytics Dashboard**: Visualize trends and statistics
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 19.2.0
- Vite 7.2.4
- Tailwind CSS v4
- React Router v7
- Recharts (Charts)
- Axios (API calls)
- HeadlessUI (Components)
- Lucide React (Icons)

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs (Password hashing)

## 📋 Prerequisites

- Node.js (v20 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd vehicle-health-monitor
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Environment Setup

#### Frontend (frontend/.env)
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (backend/.env)
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vehicle-health-monitor
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 5. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Database will be created automatically

**Option B: MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in server/.env

### 6. Seed the Database (Optional)
```bash
cd backend
npm run seed
cd ..
```

This creates:
- Demo user: `demo@example.com` / `demo123`
- Sample vehicles with sensor data
- Sample alerts

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## 📱 Usage

1. **Login**: Use demo credentials or register a new account
   - Email: `demo@example.com`
   - Password: `demo123`

2. **Dashboard**: View overall statistics and recent alerts

3. **Vehicles**: 
   - Add new vehicles
   - View vehicle details
   - Delete vehicles

4. **Analytics**: View detailed charts and trends

5. **Service**: Track service schedules

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `GET /api/vehicles/stats/summary` - Get statistics

### Sensors
- `GET /api/sensors/vehicle/:vehicleId` - Get sensor data
- `POST /api/sensors` - Add sensor reading
- `GET /api/sensors/stats/:vehicleId` - Get sensor statistics

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/vehicle/:vehicleId` - Get vehicle alerts
- `PUT /api/alerts/:id/read` - Mark alert as read
- `PUT /api/alerts/read-all` - Mark all as read
- `DELETE /api/alerts/:id` - Delete alert
- `GET /api/alerts/stats/count` - Get alert counts

## 📊 Database Schema

### User
- name, email, password (hashed)
- role (user/admin)

### Vehicle
- userId, model, engineCC, fuelType
- odometer, lastService
- healthScore, status

### SensorData
- vehicleId, rpm, temperature, battery
- fuel, fuelEfficiency, speed
- timestamp

### Alert
- vehicleId, userId, type, message
- isRead, timestamp

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- CORS enabled
- Input validation

## 🎨 UI Components

- Responsive navigation
- Interactive charts (Recharts)
- Real-time data updates
- Alert notifications
- Form validation
- Loading states

## 📝 Scripts

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd backend
npm start            # Start server
npm run dev          # Start with nodemon
npm run seed         # Seed database
```

## 🚧 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML
- [ ] Service center integration
- [ ] Multi-language support
- [ ] Export reports (PDF/CSV)
- [ ] Push notifications
- [ ] Vehicle comparison features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Abhinav Praveen - Vehicle Health Monitor

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- MongoDB for the database
- All open-source contributors

---

**Note**: This is a demo application. For production use, implement additional security measures, error handling, and testing.
