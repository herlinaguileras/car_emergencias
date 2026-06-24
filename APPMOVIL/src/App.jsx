import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Scanner from './pages/Scanner';
import Diagnostic from './pages/Diagnostic';

// Componente para proteger las rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/scanner" element={
          <PrivateRoute>
            <Scanner />
          </PrivateRoute>
        } />
        <Route path="/diagnostic" element={
          <PrivateRoute>
            <Diagnostic />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
