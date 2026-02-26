import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import BusinessPage from './pages/BusinessPage';
import LeaveReviewPage from './pages/LeaveReviewPage';
import ReviewGenerated from './pages/ReviewGenerated';
import PrivateFeedback from './pages/PrivateFeedback';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AllBusinesses from './pages/AllBusinesses';
import MembershipPage from './pages/MembershipPage';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import ClientOnboarding from './pages/ClientOnboarding';
import CouponPage from './pages/CouponPage';
import RedeemPage from './pages/RedeemPage';
import FSRLogin from './pages/FSRLogin';
import FSRDashboard from './pages/FSRDashboard';
import RegisterBusiness from './pages/RegisterBusiness';
import InstagramOfferPage from './pages/InstagramOfferPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/businesses" element={<AllBusinesses />} />
        <Route path="/business/:businessId" element={<BusinessPage />} />
        <Route path="/business/:businessId/review" element={<LeaveReviewPage />} />
        <Route path="/review-generated" element={<ReviewGenerated />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/coupon" element={<CouponPage />} />
        <Route path="/redeem/:code" element={<RedeemPage />} />
        <Route path="/private-feedback" element={<PrivateFeedback />} />
        <Route path="/onboarding" element={<ClientOnboarding />} />
        <Route path="/client-onboarding" element={<ClientOnboarding />} />
        <Route path="/register-business" element={<RegisterBusiness />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/fsr-login" element={<FSRLogin />} />
        <Route path="/fsr-dashboard" element={<FSRDashboard />} />
        <Route path="/instagram-offer/:businessId" element={<InstagramOfferPage />} />
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
