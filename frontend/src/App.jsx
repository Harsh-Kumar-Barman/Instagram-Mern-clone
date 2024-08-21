import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute'
import Register from './components/Register'
import Login from './components/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
