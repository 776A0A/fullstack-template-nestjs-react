import { token } from '@/api/utils/token';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }: ReactBasicProps) {
  if (!token.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/study"
          element={<ProtectedRoute>{/* <Home /> */}</ProtectedRoute>}
        />
        <Route
          path="/study/:studyId"
          element={<ProtectedRoute>{/* <Home /> */}</ProtectedRoute>}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
