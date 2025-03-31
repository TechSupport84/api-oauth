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
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/auth/failure" }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        
        // Store token in session (Assuming Passport strategy includes token)
        req.session.token = req.user.token || null;

        // Redirect to frontend with the token
        res.redirect(`http://localhost:5173/login?token=${req.session.token}`);
    }
);

// Authentication Failure Route
router.get("/auth/failure", (req, res) => {
    res.status(401).json({ message: "Authentication failed" });
});

// Get Logged-In User Info
router.get("/auth/user", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({
        username: req.user.username,
        avatar_url: req.user.photos?.[0]?.value || "",
        token: req.session.token || null, // Send the token
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