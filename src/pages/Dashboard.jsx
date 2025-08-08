import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
  Calculate as CalculateIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { dashboardAPI } from '../services/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({})
  const [recentDeals, setRecentDeals] = useState([])
  const [recentProperties, setRecentProperties] = useState([])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await dashboardAPI.getStats()
      
      setStats(data.stats)
      setRecentDeals(data.recent_deals || [])
      setRecentProperties(data.recent_properties || [])
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard load error:', err)
      
      // Set sample data for development
      setStats({
        total_deals: 15,
        pending_deals: 3,
        accepted_deals: 8,
        total_profit: 32000,
        total_developers: 12,
        active_properties: 25,
      })
      setRecentDeals([
        { id: 1, property_id: '123 Main St', offer_amount: 12000, status: 'pending' },
        { id: 2, property_id: '456 Oak Ave', offer_amount: 15000, status: 'accepted' },
        { id: 3, property_id: '789 Pine Rd', offer_amount: 8500, status: 'rejected' },
      ])
      setRecentProperties([
        { id: 1, address: '321 Elm St', market_value: 25000, tax_owed: 3200 },
        { id: 2, address: '654 Maple Dr', market_value: 18000, tax_owed: 2800 },
        { id: 3, address: '987 Cedar Ln', market_value: 30000, tax_owed: 4100 },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const StatCard = ({ title, value, icon, color = 'primary', onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
        backdropFilter: 'blur(20px)',
        border: `1px solid rgba(79, 195, 247, 0.2)`,
        '&:hover': onClick ? { 
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: `0px 12px 40px rgba(79, 195, 247, 0.25)`,
          border: `1px solid rgba(79, 195, 247, 0.4)`,
        } : {},
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              color="textSecondary" 
              gutterBottom 
              variant="body2"
              sx={{ 
                fontWeight: 500,
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${color === 'primary' ? '#4fc3f7, #29b6f6' : 
                  color === 'success' ? '#81c784, #66bb6a' :
                  color === 'warning' ? '#ffb74d, #ff9800' :
                  color === 'info' ? '#64b5f6, #42a5f5' :
                  color === 'secondary' ? '#ba68c8, #9c27b0' : '#4fc3f7, #29b6f6'})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))',
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              background: `linear-gradient(45deg, ${color === 'primary' ? '#4fc3f7, #29b6f6' : 
                color === 'success' ? '#81c784, #66bb6a' :
                color === 'warning' ? '#ffb74d, #ff9800' :
                color === 'info' ? '#64b5f6, #42a5f5' :
                color === 'secondary' ? '#ba68c8, #9c27b0' : '#4fc3f7, #29b6f6'})`,
              borderRadius: '12px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0px 4px 12px rgba(79, 195, 247, 0.3)`,
            }}
          >
            {React.cloneElement(icon, { 
              sx: { 
                fontSize: 32, 
                color: '#000',
                filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2))',
              } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'accepted': return 'success'
      case 'sold': return 'info'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <IconButton onClick={loadDashboardData} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Deals"
            value={stats.total_deals || 0}
            icon={<AssessmentIcon sx={{ fontSize: 32 }} />}
            color="primary"
            onClick={() => navigate('/deals')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Deals"
            value={stats.pending_deals || 0}
            icon={<TrendingUpIcon sx={{ fontSize: 32 }} />}
            color="warning"
            onClick={() => navigate('/deals')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Profit"
            value={`$${(stats.total_profit || 0).toLocaleString()}`}
            icon={<AccountBalanceIcon sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Developers"
            value={stats.total_developers || 0}
            icon={<PeopleIcon sx={{ fontSize: 32 }} />}
            color="info"
            onClick={() => navigate('/developers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Properties"
            value={stats.active_properties || 0}
            icon={<BusinessIcon sx={{ fontSize: 32 }} />}
            color="secondary"
            onClick={() => navigate('/research')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Accepted Deals"
            value={stats.accepted_deals || 0}
            icon={<TrendingUpIcon sx={{ fontSize: 32 }} />}
            color="success"
            onClick={() => navigate('/deals')}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(79, 195, 247, 0.2)`,
            '&:hover': {
              border: `1px solid rgba(79, 195, 247, 0.4)`,
              boxShadow: `0px 8px 32px rgba(79, 195, 247, 0.2)`,
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{
                background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                mb: 3,
              }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate('/research')}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #29b6f6, #039be5)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0px 6px 20px rgba(79, 195, 247, 0.4)',
                    },
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    py: 1.5,
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Research Properties
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CalculateIcon />}
                  onClick={() => navigate('/calculator')}
                  fullWidth
                  sx={{
                    borderColor: 'rgba(129, 199, 132, 0.5)',
                    color: '#81c784',
                    '&:hover': {
                      borderColor: '#81c784',
                      background: 'rgba(129, 199, 132, 0.1)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0px 6px 20px rgba(129, 199, 132, 0.2)',
                    },
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    py: 1.5,
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Calculate Offers
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<BusinessIcon />}
                  onClick={() => navigate('/developers')}
                  fullWidth
                  sx={{
                    borderColor: 'rgba(186, 104, 200, 0.5)',
                    color: '#ba68c8',
                    '&:hover': {
                      borderColor: '#ba68c8',
                      background: 'rgba(186, 104, 200, 0.1)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0px 6px 20px rgba(186, 104, 200, 0.2)',
                    },
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    py: 1.5,
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  View Developer Network
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Deals */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(129, 199, 132, 0.2)`,
            '&:hover': {
              border: `1px solid rgba(129, 199, 132, 0.4)`,
              boxShadow: `0px 8px 32px rgba(129, 199, 132, 0.2)`,
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{
                  background: 'linear-gradient(45deg, #81c784, #66bb6a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                }}>
                  Recent Deals
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/deals')}
                  sx={{
                    color: '#81c784',
                    '&:hover': {
                      background: 'rgba(129, 199, 132, 0.1)',
                      transform: 'scale(1.05)',
                    },
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  View All
                </Button>
              </Box>
              <List dense>
                {recentDeals.slice(0, 5).map((deal) => (
                  <ListItem key={deal.id} sx={{
                    borderRadius: '8px',
                    mb: 1,
                    background: 'rgba(255, 255, 255, 0.02)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}>
                    <ListItemText
                      primary={deal.property_id}
                      secondary={`$${deal.offer_amount?.toLocaleString()}`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <Chip
                      label={deal.status}
                      color={getStatusColor(deal.status)}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          textTransform: 'capitalize',
                        },
                      }}
                    />
                  </ListItem>
                ))}
                {recentDeals.length === 0 && (
                  <ListItem sx={{
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                  }}>
                    <ListItemText
                      primary="No deals yet"
                      secondary="Start by researching properties"
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Properties */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ 
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(100, 181, 246, 0.2)`,
            '&:hover': {
              border: `1px solid rgba(100, 181, 246, 0.4)`,
              boxShadow: `0px 8px 32px rgba(100, 181, 246, 0.2)`,
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{
                  background: 'linear-gradient(45deg, #64b5f6, #42a5f5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                }}>
                  Recent Properties Researched
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/research')}
                  sx={{
                    color: '#64b5f6',
                    '&:hover': {
                      background: 'rgba(100, 181, 246, 0.1)',
                      transform: 'scale(1.05)',
                    },
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Research More
                </Button>
              </Box>
              <Grid container spacing={2}>
                {recentProperties.slice(0, 6).map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(100, 181, 246, 0.1)',
                        borderRadius: '12px',
                        '&:hover': {
                          border: '1px solid rgba(100, 181, 246, 0.3)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0px 6px 20px rgba(100, 181, 246, 0.15)',
                        },
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        {property.address}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          Market Value:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ${property.market_value?.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Tax Owed:
                        </Typography>
                        <Typography variant="body2" color="error.main" fontWeight={600}>
                          ${property.tax_owed?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              {recentProperties.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    No properties researched yet. Start by searching for opportunities!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
