const createGoogleCalendarEvent  = require('../utils/googleCalendarService');


const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();

        // Fetch user’s Google tokens from DB
        const userTokens = {}; // Fetch from database

        if (userTokens) {
            await createGoogleCalendarEvent(task, userTokens);
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = createTask;