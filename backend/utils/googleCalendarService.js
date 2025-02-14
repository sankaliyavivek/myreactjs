


const { google } = require("googleapis");
const User = require("../model/user");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Set user credentials
const setUserCredentials = async (userId) => {
    const user = await User.findById(userId);
    if (!user || !user.googleAccessToken) {
        throw new Error("User not authenticated with Google.");
    }

    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
    });

    return oauth2Client;

};

const watchGoogleCalendar = async (userId) => {
    const authClient = await setUserCredentials(userId);
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const response = await calendar.events.watch({
        calendarId: "primary",
        requestBody: {
            id: `watch-${userId}-${Date.now()}`, // Unique ID
            type: "web_hook",
            address: process.env.GOOGLE_WEBHOOK_URL, // Your webhook URL
        },
    });

    console.log("Google Calendar Watch Response:", response.data);
};


// Create Google Calendar Event
const createGoogleEvent = async (userId, task) => {
    const authClient = await setUserCredentials(userId);
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const event = {
        summary: task.title,
        description: task.description,
        start: { dateTime: new Date(task.dueDate).toISOString(), timeZone: "UTC" },
        end: { dateTime: new Date(task.dueDate).toISOString(), timeZone: "UTC" },
    };

    const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
    });

    return response.data;
};

// Update Google Calendar Event
const updateGoogleEvent = async (userId, task) => {
    const authClient = await setUserCredentials(userId);
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const event = {
        summary: task.title,
        description: task.description,
        start: { dateTime: new Date(task.dueDate).toISOString(), timeZone: "UTC" },
        end: { dateTime: new Date(task.dueDate).toISOString(), timeZone: "UTC" },
    };

    const response = await calendar.events.update({
        calendarId: "primary",
        eventId: task.googleEventId,
        resource: event,
    });

    return response.data;
};

// Delete Google Calendar Event
const deleteGoogleEvent = async (userId, googleEventId) => {
    const authClient = await setUserCredentials(userId);
    const calendar = google.calendar({ version: "v3", auth: authClient });

    await calendar.events.delete({
        calendarId: "primary",
        eventId: googleEventId,
    });
};


const refreshAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.googleRefreshToken) {
            throw new Error("No refresh token available.");
        }

        oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });
        const { credentials } = await oauth2Client.refreshAccessToken();

        // ✅ Update user with new access token
        user.googleAccessToken = credentials.access_token;
        await user.save();

        return credentials.access_token;
    } catch (error) {
        console.error("Error refreshing access token:", error);
        throw error;
    }
};

module.exports = {
    createGoogleEvent,
    updateGoogleEvent,
    deleteGoogleEvent,
    refreshAccessToken,
    watchGoogleCalendar
};