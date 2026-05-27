import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
    return (
       <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee" element={
          <ProtectedRoute role='employee'>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role='admin'>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App;