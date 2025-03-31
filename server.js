const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Store attendance data in memory (replace with database in production)
let attendanceData = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send current attendance data to newly connected client
    socket.emit('initial-data', attendanceData);

    // Handle new attendance submission
    socket.on('submit-attendance', (data) => {
        attendanceData.push(data);
        // Broadcast to all connected clients
        io.emit('attendance-update', attendanceData);
    });

    // Handle attendance deletion
    socket.on('delete-attendance', (index) => {
        attendanceData.splice(index, 1);
        io.emit('attendance-update', attendanceData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});