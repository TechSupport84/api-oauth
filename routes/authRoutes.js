import express from "express";
import passport from "passport";

const router = express.Router();

// Middleware to check if the user is authenticated
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

// GitHub OAuth Routes
router.get("/auth/github", passport.authenticate("github"));

router.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/auth/failure" }),
    (req, res) => {
        res.redirect("http://localhost:5173/");
    }
);

// Authentication Failure Route
router.get("/auth/failure", (req, res) => {
    res.status(401).json({ message: "Authentication failed" });
});

// Get Logged-In User Info
router.get("/auth/user", isAuth, (req, res) => {
    res.json(req.user);
});

// Logout Route
router.post("/auth/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ message: "Logout successful" });
    });
});

export default router;
