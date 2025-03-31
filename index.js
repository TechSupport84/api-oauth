import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRouter.js";
import cors from "cors"

dotenv.config();
const app = express();

// Connect to MongoDB
connectDb();

// Session Middleware
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true,
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(cors({ 
    origin: "http://localhost:5173",  // Allow frontend URL
    credentials: true                 // Allow cookies/auth headers
  }));
// Routes
app.use(authRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
