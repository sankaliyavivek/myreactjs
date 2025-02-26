const express = require('express');
const http = require('http');
const { initializeSocket } = require('./socket');
const app = express();
const sendSlackNotification = require("./utils/slackService");
sendSlackNotification("🚀 Backend is running! This is a test message.");


// Backend installation
// npm i bcrypt
// npm i cookie-parser
// npm i cors
// npm i express
// npm i jsonwebtoken
// npm i mongoose
// npm i nodemailer
// npm i node-cron
// npm i sokect.io
// npm i dotenv
// npm i googleapis
// npm i moment

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups"); // ✅ Allow popups to communicate
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");  
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // ✅ Ensure frontend is allowed
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


// Create HTTP server and initialize socket.io
const httpServer = http.createServer(app);
initializeSocket(httpServer); // Initialize socket server

require('./connect');  // MongoDB connection mate aa use thy

const { sendDeadlineReminders } = require('./cronReminder/emailsheduler');
const cookieParser = require('cookie-parser');
// const cors = require('cors');

const port = 8000;
const cors = require("cors");

app.use(cors({
  origin: ["http://localhost:5173", "https://clientproject-vivek.netlify.app"], // ✅ Allow frontend during development & production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


// sendDeadlineReminders();
app.use(cookieParser());
app.use(express.json());
 
const router = require('./route/user');
const project = require('./route/project');
const task = require('./route/task');
const notification =require('./route/notification');
const statistics = require('./route/projectstatistics')
const taskstatistics = require('./route/taskstatistics');
const googleAuthRoutes = require("./route/googleauth");


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



// Listen on the HTTP server
httpServer.listen(port, () => {
  console.log(`Server is started at http://localhost:${port}`);
});
