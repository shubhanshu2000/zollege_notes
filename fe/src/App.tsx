// src/App.tsx
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateComponents";
import { isAuthenticated } from "../utils/auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Redirect root to notes if authenticated, otherwise to login */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/notes" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
