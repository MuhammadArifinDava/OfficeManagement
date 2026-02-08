import { Route, Routes } from "react-router-dom";
import SplashCursor from "./components/SplashCursor";
import { Navbar } from "./components/Navbar";
import { CommandPalette } from "./components/CommandPalette";
import { SmoothScroll } from "./components/SmoothScroll";
import { ParallaxBackdrop } from "./components/ParallaxBackdrop";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import DivisionsPage from "./pages/DivisionsPage";
import EmployeeFormPage from "./pages/EmployeeFormPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-full relative">
        <ParallaxBackdrop />
        <div className="fixed inset-0 z-0 pointer-events-none">
          <SplashCursor
            SIM_RESOLUTION={100}
            DYE_RESOLUTION={512}
            DENSITY_DISSIPATION={1.75}
            VELOCITY_DISSIPATION={1}
            PRESSURE={0.1}
            PRESSURE_ITERATIONS={8}
            CURL={6}
            SPLAT_RADIUS={0.5}
            SPLAT_FORCE={16000}
            COLOR_UPDATE_SPEED={10}
          />
        </div>
        <div className="relative z-10">
          <Navbar />
          <CommandPalette />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/divisions" element={<DivisionsPage />} />
              <Route path="/employees/new" element={<EmployeeFormPage />} />
              <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;
