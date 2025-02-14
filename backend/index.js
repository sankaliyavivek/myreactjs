const express = require('express');
const http = require('http');
const { initializeSocket } = require('./socket');
const app = express();
const sendSlackNotification = require("./utils/slackService");
const punycode = require("punycode/")

sendSlackNotification("🚀 Backend is running! This is a test message.");



app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none"); // Allows embedded content  
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // ✅ Ensure the frontend is allowed
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});





// Create HTTP server and initialize socket.io
const httpServer = http.createServer(app);
initializeSocket(httpServer); // Initialize socket server

require('./connect');  // MongoDB connection

const { sendDeadlineReminders } = require('./cronReminder/emailsheduler');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const port = 8000;

app.use(cors({
  origin: 'http://localhost:5173',  // Frontend origin
  credentials: true,
}));

// sendDeadlineReminders();
app.use(cookieParser());
app.use(express.json());
// 
const router = require('./route/user');
const project = require('./route/project');
const task = require('./route/task');
const notification =require('./route/notification');
const statistics = require('./route/projectstatistics')
const taskstatistics = require('./route/taskstatistics');
const googleAuthRoutes = require("./route/googleauth");
// const integrationRoutes = require("./route/inegration");
// const integrationRoutes = require("./route/integration"); // ✅ Correct spelling


// const integrationRoutes = require("./route/integration"); // ✅ Correct file name
// app.use("/api/integration", integrationRoutes)

const integrationRoutes = require("./route/integration");
app.use("/api/integration", integrationRoutes);

const calendarTaskRoutes = require("./route/calendarTask");
app.use("/api/calendar-task", calendarTaskRoutes);


app.use('/user', router);
app.use('/project', project);
app.use('/task', task);
app.use('/notification',notification);
app.use('/statistics',statistics);
app.use('/statisticss', taskstatistics);
app.use("/auth", googleAuthRoutes);
// app.use("/api/integration", integrationRoutes); // ✅ Correct


// Listen on the HTTP server
httpServer.listen(port, () => {
  console.log(`Server is started at http://localhost:${port}`);
});
