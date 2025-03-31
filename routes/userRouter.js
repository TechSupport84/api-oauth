import express from "express";
const router = express.Router();

router.get("/profile", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
});

export default router;
