const express = require("express");
const { google } = require("googleapis");
const User = require("../model/user");
const { Authentication } = require("../middleware/userAuth");
const router = express.Router();


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
// Save Google Tokens
router.post("/save-tokens", Authentication, async (req, res) => {
    try {
        const { access_token, refresh_token } = req.body;
        const userId = req.user.id;

        if (!access_token) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { 
                googleAccessToken: access_token, 
                googleRefreshToken: refresh_token || null,
                googleConnected: true,
                googleCalendarEnabled: true, //  Ensure this is updated
            },
            { new: true }
        );

        res.json({ message: "Tokens saved successfully", user });
    } catch (error) {
        console.error("Error saving tokens:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// Toggle Integrations
router.post("/toggle", Authentication, async (req, res) => {
    try {
        const { googleCalendar, slack } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (googleCalendar !== undefined) {
            user.googleCalendarEnabled = googleCalendar;
        }
        if (slack !== undefined) {
            user.slackEnabled = slack;
        }

        await user.save();

        res.json({
            message: "Integration toggled successfully",
            googleCalendar: user.googleCalendarEnabled || false,
            slack: user.slackEnabled || false,
        });
    } catch (error) {
        console.error("Error toggling integration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Disconnect Google
router.post("/disconnect-google", Authentication, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            googleAccessToken: null,
            googleRefreshToken: null,
            googleConnected: false,
            googleCalendarEnabled: false,
        });

        res.json({ message: "Google account disconnected.", googleCalendar: false });
    } catch (error) {
        console.error("Error disconnecting Google:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Fetch Integration Status
router.get("/status", Authentication, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        console.log("User Integration Status:", user.googleCalendarEnabled ?? false); //  Safe logging

        res.json({
            googleCalendar: Boolean(user.googleCalendarEnabled),
            userId: user._id,
        });
    } catch (error) {
        console.error("Error fetching integration status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;