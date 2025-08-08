import React from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  useTheme
} from '@mui/material'
import { 
  Home as HomeIcon,
  Search as SearchIcon,
  Calculate as CalculateIcon,
  Handshake as HandshakeIcon,
  People as PeopleIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <HomeIcon /> },
    { label: 'Research', path: '/research', icon: <SearchIcon /> },
    { label: 'Calculator', path: '/calculator', icon: <CalculateIcon /> },
    { label: 'Deals', path: '/deals', icon: <HandshakeIcon /> },
    { label: 'Developers', path: '/developers', icon: <PeopleIcon /> },
  ]

  return (
    <AppBar position="static" elevation={0} sx={{ 
      backgroundColor: theme.palette.primary.main,
      borderBottom: '1px solid rgba(255,255,255,0.12)'
    }}>
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🏠 Real Estate Investment Tool
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                backgroundColor: location.pathname === item.path 
                  ? 'rgba(255,255,255,0.15)' 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
