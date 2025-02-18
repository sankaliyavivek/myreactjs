const express = require("express");
const { google } = require("googleapis");
// const axios = require("axios");
require("dotenv").config();
const { Authentication, refreshGoogleToken } = require("../middleware/userAuth");
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

//  Generate Google OAuth URL 
router.get("/google", Authentication, (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/calendar.events",
            "email",
            "profile"
        ],
        prompt: "consent", // Ensures refresh_token is always provided
    });
    res.json({ authUrl });
});

//  Google OAuth Callback
router.get("/google/callback", Authentication, async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ message: "Authorization code is missing" });
        }

        console.log(" Exchanging code for tokens...");
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log(" OAuth Success: Tokens received", tokens);

        if (!tokens.refresh_token) {
            console.warn(" No refresh token received. Ensure `prompt: 'consent'` is used.");
        }

        // Save tokens in the database
        await saveTokensToDB({
            email: req.user.email,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token || null,
            expires_in: tokens.expiry_date,
        });

        // Store access token in cookie
        res.cookie("accessToken", tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.redirect("https://clientproject-vivek.netlify.app/home");
    } catch (error) {
        console.error(" OAuth Token Exchange Error:", error.response?.data || error.message || error);
        return res.status(500).json({ message: "OAuth failed", error: error.message });
    }
});

module.exports = router;
