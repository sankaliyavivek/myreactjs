const express = require("express");
const { Authentication } = require("../middleware/userAuth");
const User= require("../model/user");
const CalendarTask = require("../model/calendarTask");
const {
    createGoogleEvent,
    updateGoogleEvent,
    deleteGoogleEvent,
    refreshAccessToken
} = require("../utils/googleCalendarService");

const router = express.Router();

//  GET All Tasks
router.get("/googletaskget", Authentication, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const tasks = await CalendarTask.find({ userId: req.user.id });
        res.json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/googletaskget/:taskId", Authentication, async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const task = await CalendarTask.findOne({ _id: taskId, userId: req.user.id });
        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json({ task });
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//  Create Task & Sync with Google Calendar (Prevent if Google is not connected)
router.post("/create", Authentication, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!title || !dueDate) {
            return res.status(400).json({ error: "Title and Due Date are required" });
        }

        //  Check if Google is connected
        const user = await User.findById(userId);
        if (!user || !user.googleAccessToken) {
            return res.status(403).json({ error: "Google account not connected. Please connect your Google account first." });
        }

        //  Save task in database
        const newTask = new CalendarTask({ userId, title, description, dueDate });
        await newTask.save();

        try {
            console.log("Syncing task with Google Calendar...");
            const googleEvent = await createGoogleEvent(userId, newTask);
            newTask.googleEventId = googleEvent.id;
            await newTask.save();
        } catch (googleError) {
            console.error("Google Calendar Sync Failed:", googleError.message);
        }

        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//  Update Task & Sync with Google Calendar
router.put("/update/:taskId", Authentication, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, dueDate } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const task = await CalendarTask.findById(taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.title = title;
        task.description = description;
        task.dueDate = dueDate;

        try {
            console.log("Updating Google Calendar...");
            if (task.googleEventId) {
                await updateGoogleEvent(userId, task);
            }
        } catch (googleError) {
            console.error("Google Calendar Update Failed:", googleError.message);
        }

        await task.save();
        res.json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//  Delete Task & Remove from Google Calendar
router.delete("/delete/:taskId", Authentication, async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const task = await CalendarTask.findById(taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        try {
            if (task.googleEventId) {
                console.log("Deleting Google Calendar event...");
                await deleteGoogleEvent(userId, task.googleEventId);
            }
        } catch (googleError) {
            console.error("Google Calendar Delete Failed:", googleError.message);
        }

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/google-webhook", async (req, res) => {
    try {
        console.log("Webhook received:", req.body);

        const { resourceId } = req.headers;
        if (!resourceId) return res.status(400).json({ error: "Missing resourceId" });

        // Fetch latest events from Google Calendar
        const authClient = await setUserCredentials(req.user.id);
        const calendar = google.calendar({ version: "v3", auth: authClient });

        const { data } = await calendar.events.list({
            calendarId: "primary",
            singleEvents: true,
            orderBy: "startTime",
        });

        for (const event of data.items) {
            const task = await CalendarTask.findOne({ googleEventId: event.id });

            if (!task && event.status === "confirmed") {
                //  Create missing task in DB
                const newTask = new CalendarTask({
                    userId: req.user.id,
                    title: event.summary,
                    description: event.description || "",
                    dueDate: event.start.dateTime,
                    googleEventId: event.id,
                });
                await newTask.save();
            } else if (task && event.status === "cancelled") {
                // Delete task from DB if deleted from Google
                await CalendarTask.deleteOne({ googleEventId: event.id });
            } else if (task) {
                //  Update task if changed in Google Calendar
                task.title = event.summary;
                task.description = event.description || "";
                task.dueDate = event.start.dateTime;
                await task.save();
            }
        }

        res.status(200).json({ message: "Webhook processed" });
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
