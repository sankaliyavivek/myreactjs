const mongoose = require("mongoose");

const CalendarTaskSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    googleEventId: { 
        type: String, // Store the Google Calendar event ID for syncing 
    },
    googleCalendarId: {
        type: String, // The calendar ID where the event is stored
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const CalendarTask = mongoose.model("CalendarTask", CalendarTaskSchema);
module.exports = CalendarTask;
