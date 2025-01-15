import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './app/components/Auth/Login';
import Dashboard from './app/components/Dashboard/Dashboard';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import TicketDetail from './app/components/Tickets/TicketDetails';
import Signup from './app/components/Auth/Signup';
import Users from './app/components/Users/Users';
import ProtectedRoute from './app/utils/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute element={<Dashboard />} requiredRole="user" />} 
        />
        <Route 
          path="/users" 
          element={<ProtectedRoute element={<Users />} requiredRole="admin" />} 
        />
        <Route 
          path="/ticket-detail/:id" 
          element={<ProtectedRoute element={<TicketDetail />} requiredRole="user" />} 
        />
      </Routes>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: { background: '#363636', color: '#fff' },
        }}
      />
    </Router>
  );
}

export default App;
