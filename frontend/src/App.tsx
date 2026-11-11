import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { setMockScenario } from './services/mockScenario';
import { AppShell } from './components/layout/AppShell';
import { RequireAuth } from './components/layout/RequireAuth';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { VerifyAccount } from './pages/auth/VerifyAccount';
import { ResetPassword } from './pages/auth/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { DiagnosisResult } from './pages/DiagnosisResult';
import { History } from './pages/History';
import { Library } from './pages/Library';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

interface AppProps {
  scanOutcome?: 'confident' | 'lowConfidence' | 'healthy' | 'unrecognized' | 'invalidImage';
  emptyHistory?: boolean;
  apiFailure?: boolean;
}

export function App({ scanOutcome = 'confident', emptyHistory = false, apiFailure = false }: AppProps) {
  // Kịch bản mock chỉ dùng khi chưa có Backend (xem services/config.ts).
  setMockScenario({ scanOutcome, emptyHistory, apiFailure });
  const scenarioKey = `${scanOutcome}-${emptyHistory}-${apiFailure}`;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes key={scenarioKey}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/app"
            element={
            <RequireAuth>
                <AppShell />
              </RequireAuth>
            }>
            
            <Route index element={<Dashboard />} />
            <Route path="scan" element={<Scanner />} />
            <Route path="result/:id" element={<DiagnosisResult />} />
            <Route path="history" element={<History />} />
            <Route path="library" element={<Library />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-center"
          offset="max(16px, env(safe-area-inset-top))"
          toastOptions={{ style: { fontFamily: 'Be Vietnam Pro, sans-serif', borderRadius: 14 } }} />
        
      </BrowserRouter>
    </AuthProvider>);

}