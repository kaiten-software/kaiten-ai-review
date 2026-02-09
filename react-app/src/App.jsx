import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import BusinessPage from './pages/BusinessPage';
import LeaveReviewPage from './pages/LeaveReviewPage';
import ReviewGenerated from './pages/ReviewGenerated';
import PrivateFeedback from './pages/PrivateFeedback';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/business/:businessId" element={<BusinessPage />} />
        <Route path="/business/:businessId/review" element={<LeaveReviewPage />} />
        <Route path="/review-generated" element={<ReviewGenerated />} />
        <Route path="/private-feedback" element={<PrivateFeedback />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
