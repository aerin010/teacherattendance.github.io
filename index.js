require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Parser } = require('json2csv');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
}).then(() => {
  console.log('Successfully connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
  process.exit(1);
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  reason: { type: String, required: true }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Routes
app.post('/api/attendance', async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/attendance', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/export', async (req, res) => {
  try {
    const records = await Attendance.find();
    const fields = ['teacherName', 'date', 'reason'];
    const parser = new Parser({ fields });
    const csv = parser.parse(records);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('teacher-attendance.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});