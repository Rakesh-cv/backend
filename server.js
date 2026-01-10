// Import required modules
import express from 'express';
import cors from 'cors';
import connectDb from './config/db.js'; // Database connection


// Routes
import routes from './routes/authRoutes.js'

// Initialize Express app
const app = express();


// Connect to the database with error handling
(async () => {
  try {
    await connectDb();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Stop the server if DB connection fails
  }
})();

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "http://localhost:5174",

];

// Use CORS middleware with dynamic origin handling
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Add Vary header to prevent caching issues in multi-origin environments
app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});



app.use(express.json());

// Add routes
// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

app.use('/api/auth', routes);

app.use(routes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
