# Hotel Room Booking Management System

A complete production-ready MERN Stack application for hotel room booking with modern UI/UX, payment integration, and advanced features.

## 🚀 Features

### User Features
- User registration and authentication with JWT
- Browse and filter rooms by category, price, capacity
- View detailed room information with images
- Book rooms with date selection
- Secure payment processing with Stripe
- View booking history and status
- Cancel bookings
- Update profile information

### Admin Features
- Admin dashboard with analytics
- Manage rooms (Add/Edit/Delete)
- Upload room images
- Manage all bookings
- Update booking status
- View revenue statistics
- Manage users

### Technical Features
- JWT-based authentication
- Role-based authorization (User/Admin)
- Password hashing with bcrypt
- Image upload with Multer
- Email notifications
- Real-time room availability checking
- Prevent double booking
- Pagination and filtering
- Responsive design
- Toast notifications
- Error handling middleware
- Input validation

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Stripe React
- date-fns

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Multer for file uploads
- Nodemailer for emails
- Stripe for payments

## 📁 Project Structure

```
hotel-booking-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling, upload
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── uploads/         # Uploaded images
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   └── utils/       # Helper functions
│   └── public/          # Static files
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account (for payments)
- Gmail account (for email notifications)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Frontend URL
CLIENT_URL=http://localhost:5173
```

4. Start MongoDB (if using local):
```bash
mongod
```

5. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Start frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📧 Email Configuration (Gmail)

1. Enable 2-Factor Authentication in your Gmail account
2. Generate App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASSWORD` in backend `.env`

## 💳 Stripe Configuration

1. Create a Stripe account at https://stripe.com
2. Get your API keys from Dashboard → Developers → API keys
3. Use Test keys for development:
   - Secret key in backend `.env` (`STRIPE_SECRET_KEY`)
   - Publishable key in frontend `.env` (`VITE_STRIPE_PUBLIC_KEY`)

### Test Card Numbers
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future date for expiry and any 3 digits for CVC

## 🗄️ Database Setup

### MongoDB Local
```bash
# Start MongoDB
mongod

# The application will automatically create the database
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Replace `MONGO_URI` in backend `.env` with your connection string

## 👤 Creating Admin User

After starting the backend, you can create an admin user by:

1. Register a normal user through the application
2. Connect to MongoDB and update the user's role:

```javascript
// Using MongoDB Compass or mongo shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or use this script (create `createAdmin.js` in backend folder):

```javascript
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hotel.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin'
    });
    console.log('Admin created:', admin);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
```

Run: `node createAdmin.js`

## 🧪 Testing the Application

### User Flow
1. Register a new account at `/register`
2. Login at `/login`
3. Browse rooms at `/rooms`
4. Filter rooms by category, price, etc.
5. Click on a room to view details
6. Click "Book Now" and fill booking form
7. Complete payment with test card
8. View bookings in dashboard

### Admin Flow
1. Login with admin credentials
2. Access admin dashboard at `/admin/dashboard`
3. View statistics (revenue, bookings)
4. Manage rooms (add/edit/delete)
5. Manage bookings (update status)
6. View all users

## 🚀 Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Update `MONGO_URI` to production database
3. Update `CLIENT_URL` to production frontend URL
4. Deploy backend

### Frontend (Vercel/Netlify)
1. Update `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update profile
- POST `/api/auth/forgot-password` - Forgot password
- PUT `/api/auth/reset-password/:token` - Reset password

### Rooms
- GET `/api/rooms` - Get all rooms (with filters)
- GET `/api/rooms/:id` - Get room by ID
- POST `/api/rooms` - Create room (Admin)
- PUT `/api/rooms/:id` - Update room (Admin)
- DELETE `/api/rooms/:id` - Delete room (Admin)
- GET `/api/rooms/check-availability` - Check availability

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my-bookings` - Get user bookings
- GET `/api/bookings` - Get all bookings (Admin)
- GET `/api/bookings/:id` - Get booking by ID
- PUT `/api/bookings/:id/cancel` - Cancel booking
- PUT `/api/bookings/:id/status` - Update status (Admin)
- POST `/api/bookings/payment-intent` - Create payment intent
- POST `/api/bookings/confirm-payment` - Confirm payment
- GET `/api/bookings/stats` - Get booking statistics (Admin)

### Users
- GET `/api/users` - Get all users (Admin)
- GET `/api/users/:id` - Get user by ID (Admin)
- DELETE `/api/users/:id` - Delete user (Admin)
- PUT `/api/users/:id/role` - Update user role (Admin)

## 🎨 UI/UX Features

- Modern, clean hotel-style design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading states and skeletons
- Toast notifications for user feedback
- Modal dialogs for booking
- Professional color palette
- Intuitive navigation
- Form validation with helpful messages

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes (frontend & backend)
- Role-based access control
- Input validation
- XSS protection
- CORS configuration
- Secure payment processing

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For Atlas, whitelist your IP address

### Email Not Sending
- Verify Gmail credentials
- Check if 2FA is enabled
- Use App Password, not regular password

### Stripe Payment Failing
- Verify API keys are correct
- Use test card numbers in development
- Check Stripe dashboard for errors

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ for learning and demonstration purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if you like this project!
