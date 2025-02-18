
  const socketIo = require('socket.io')

  let io;  // Declare the io instance

  // Initialize Socket.IO with the HTTP server
  const initializeSocket = (server) => {

    io = socketIo(server, {
      cors: {
        origin: ["http://localhost:5173", "https://clientproject-vivek.netlify.app"], // ✅ Allow both localhost and deployed frontend
        methods: ["GET", "POST"],
        credentials: true,
       
      },
      transports: ["websocket", "polling"]
    });

    console.log('Socket.IO initialized');

    // Handle Socket.IO events
    io.on('connection', (socket) => {
      console.log('A user connected');

      // Listen for task updates
      socket.on('updateTask', (taskData) => {
        io.emit('taskUpdated', taskData);
      });

      // Listen for project updates
      socket.on('updateProject', (projectData) => {
        io.emit('projectUpdated', projectData);
      });

      // Listen for task statistics updates (e.g., after task completion)
      socket.on('updateTaskStatistics', (statisticsData) => {
        io.emit('taskStatisticsUpdated', statisticsData);
      });

      // Listen for user assignments
      socket.on('assignUser', (assignmentData) => {
        io.emit('userAssigned', assignmentData);
      });

      // Listen for user removals
      socket.on('removeUser', (removalData) => {
        io.emit('userRemoved', removalData);
      });

      socket.on('taskAssigned', (assignmentData) => {
        io.emit('taskAssigned', assignmentData);  // Emit task assignment data to all clients
      });

      // Listen for user removals (added for Socket.IO event)
      socket.on('taskUnassigned', (unassignmentData) => {
        io.emit('taskUnassigned', unassignmentData);  // Emit task unassignment data to all clients
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  };
  // Get the current Socket.IO instance (to use in other parts of the app)
  const getIO = () => {
    if (!io) {
      throw new Error('Socket.IO not initialized');
    }
    return io;
  };

  module.exports = { initializeSocket, getIO };
