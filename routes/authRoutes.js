import express from "express";
import passport from "passport";

const router = express.Router();

// Middleware to check if the user is authenticated
const isAuth = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    } 
    res.status(401).json({ message: "Unauthorized" });
};

// GitHub OAuth Routes
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

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
    res.json({
        username: req.user?.username || "Unknown",
        avatar_url: req.user?.photos?.[0]?.value || "",
    });
});

// Logout Route
router.get("/auth/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed", error: err });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error destroying session", error: err });
            }
            res.json({ message: "Logout successful" });
        });
    });
});

export default router;
