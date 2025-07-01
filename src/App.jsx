import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// User pages
import Home from "./pages/Home";
import Tentang from "./pages/Tentang";
import Wisata from "./pages/Wisata";
import Lawa from "./pages/Lawa";
import Baluara from "./pages/Baluara";
import DetailPage from "./pages/DetailPage";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";

// Error page
import NotFound from "./pages/NotFound";

// AdminNav for consistent navbar across admin-accessed user pages
import AdminNav from "./components/AdminNav";
import { isAdminLoggedIn } from "./utils/AuthHelper";

function AdminWrapper({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/admin/login" replace />;

  return (
    <>
      <AdminNav />
      <div className="pt-24 px-4">{children}</div>
    </>
  );
}

function App() {
  const adminAccessPaths = ["/", "/tentang", "/wisata", "/lawa", "/baluara"];

  return (
    <Router>
      <Routes>
        {/* User Layout */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/wisata" element={<Wisata />} />
          <Route path="/lawa" element={<Lawa />} />
          <Route path="/baluara" element={<Baluara />} />

          <Route path="/wisata/:id" element={<DetailPage type="wisata" />} />
          <Route path="/lawa/:id" element={<DetailPage type="lawa" />} />
          <Route path="/baluara/:id" element={<DetailPage type="baluara" />} />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin/login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
