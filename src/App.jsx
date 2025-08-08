import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PropertyResearch from './pages/PropertyResearch'
import OfferCalculator from './pages/OfferCalculator'
import Deals from './pages/Deals'
import Developers from './pages/Developers'
import Login from './pages/Login'
import Register from './pages/Register'

// Routes that don't require authentication
const PublicRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)

// Routes that require authentication
const PrivateRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/research" element={<PropertyResearch />} />
      <Route path="/calculator" element={<OfferCalculator />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/developers" element={<Developers />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
)

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth()
  const { currentTheme } = useThemeMode()
  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        }}
      >
        {/* You can add a loading spinner here */}
      </Box>
    )
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
    </ThemeProvider>
  )
}

function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeModeProvider>
  )
}

export default App
