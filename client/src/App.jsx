import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    teacherName: '',
    reason: ''
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const apiUrl = import.meta.env.VITE_PRODUCTION_API_URL || import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/attendance`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_PRODUCTION_API_URL || import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ teacherName: '', reason: '' });
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  const handleExport = () => {
    const apiUrl = import.meta.env.VITE_PRODUCTION_API_URL || import.meta.env.VITE_API_URL;
    window.location.href = `${apiUrl}/api/attendance/export`;
  };

  return (
    <div className="container">
      <h1>Teacher Attendance System</h1>
      
      <form onSubmit={handleSubmit} className="attendance-form">
        <input
          type="text"
          placeholder="Teacher Name"
          value={formData.teacherName}
          onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <div className="attendance-list">
        <div className="list-header">
          <h2>Attendance Records</h2>
          <button onClick={handleExport} className="export-btn">Export CSV</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher.teacherName}</td>
                <td>{new Date(teacher.date).toLocaleString()}</td>
                <td>{teacher.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
