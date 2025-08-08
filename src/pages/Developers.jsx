import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Avatar,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Add as AddIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material'

const Developers = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [developers, setDevelopers] = useState([])
  const [stats, setStats] = useState({})
  
  // New developer modal
  const [newDeveloperModal, setNewDeveloperModal] = useState({
    open: false,
    name: '',
    company: '',
    email: '',
    phone: '',
    specialties: '',
    preferred_areas: '',
    notes: '',
  })

  const loadDevelopers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call - replace with actual API when backend is ready
      const sampleDevelopers = [
        {
          id: 1,
          name: 'John Smith',
          company: 'Smith Development LLC',
          email: 'john@smithdev.com',
          phone: '(555) 123-4567',
          specialties: 'Residential Development',
          preferred_areas: 'Downtown, Midtown',
          rating: 4.5,
          deals_count: 12,
          total_purchased: 240000,
          notes: 'Quick closer, prefers vacant lots',
          created_at: '2025-01-15',
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          company: 'Urban Solutions Inc',
          email: 'sarah@urbansolutions.com',
          phone: '(555) 987-6543',
          specialties: 'Commercial Development',
          preferred_areas: 'Business District',
          rating: 5.0,
          deals_count: 8,
          total_purchased: 320000,
          notes: 'Great for commercial properties',
          created_at: '2025-02-01',
        },
        {
          id: 3,
          name: 'Mike Rodriguez',
          company: 'Rodriguez Construction',
          email: 'mike@rodriguezconst.com',
          phone: '(555) 456-7890',
          specialties: 'Multi-family Development',
          preferred_areas: 'Suburbs, New Areas',
          rating: 4.0,
          deals_count: 6,
          total_purchased: 180000,
          notes: 'Focuses on apartment buildings',
          created_at: '2025-01-20',
        },
      ]
      
      const sampleStats = {
        total_developers: 3,
        active_developers: 3,
        total_deals: 26,
        avg_rating: 4.5,
      }
      
      setDevelopers(sampleDevelopers)
      setStats(sampleStats)
    } catch (err) {
      setError('Failed to load developers')
      console.error('Load developers error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDevelopers()
  }, [])

  const handleCreateDeveloper = async () => {
    try {
      if (!newDeveloperModal.name || !newDeveloperModal.email) {
        setError('Please fill in required fields (name and email)')
        return
      }

      // Simulate API call
      const newDeveloper = {
        id: developers.length + 1,
        name: newDeveloperModal.name,
        company: newDeveloperModal.company,
        email: newDeveloperModal.email,
        phone: newDeveloperModal.phone,
        specialties: newDeveloperModal.specialties,
        preferred_areas: newDeveloperModal.preferred_areas,
        rating: 0,
        deals_count: 0,
        total_purchased: 0,
        notes: newDeveloperModal.notes,
        created_at: new Date().toISOString().split('T')[0],
      }
      
      setDevelopers([newDeveloper, ...developers])
      setSuccess(`Added developer ${newDeveloperModal.name}`)
      setNewDeveloperModal({ 
        open: false, 
        name: '', 
        company: '', 
        email: '', 
        phone: '', 
        specialties: '', 
        preferred_areas: '', 
        notes: '' 
      })
    } catch (err) {
      setError('Failed to create developer')
      console.error('Create developer error:', err)
    }
  }

  const handleUpdateRating = async (developerId, newRating) => {
    try {
      setDevelopers(developers.map(dev => 
        dev.id === developerId ? { ...dev, rating: newRating } : dev
      ))
      setSuccess(`Updated rating for developer #${developerId}`)
    } catch (err) {
      setError('Failed to update rating')
      console.error('Update rating error:', err)
    }
  }

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

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
          Developer Network
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewDeveloperModal({ ...newDeveloperModal, open: true })}
        >
          Add Developer
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Developers"
            value={stats.total_developers || 0}
            icon={<PersonIcon sx={{ fontSize: 32 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Developers"
            value={stats.active_developers || 0}
            icon={<BusinessIcon sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Deals"
            value={stats.total_deals || 0}
            icon={<StarBorderIcon sx={{ fontSize: 32 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Rating"
            value={stats.avg_rating || 0}
            icon={<StarBorderIcon sx={{ fontSize: 32 }} />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Developers Grid */}
      <Grid container spacing={3}>
        {developers.map((developer) => (
          <Grid item xs={12} md={6} lg={4} key={developer.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                {/* Developer Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {developer.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {developer.name}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {developer.company}
                    </Typography>
                  </Box>
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={developer.rating}
                    onChange={(event, newValue) => {
                      handleUpdateRating(developer.id, newValue)
                    }}
                    precision={0.5}
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({developer.deals_count} deals)
                  </Typography>
                </Box>

                {/* Contact Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{developer.email}</Typography>
                  </Box>
                  {developer.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{developer.phone}</Typography>
                    </Box>
                  )}
                </Box>

                {/* Specialties */}
                {developer.specialties && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Specialties
                    </Typography>
                    <Chip label={developer.specialties} size="small" variant="outlined" />
                  </Box>
                )}

                {/* Preferred Areas */}
                {developer.preferred_areas && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Preferred Areas
                    </Typography>
                    <Typography variant="body2">{developer.preferred_areas}</Typography>
                  </Box>
                )}

                {/* Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {developer.deals_count}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Deals
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      ${(developer.total_purchased || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Total Purchased
                    </Typography>
                  </Box>
                </Box>

                {/* Notes */}
                {developer.notes && (
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {developer.notes}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {developers.length === 0 && (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">
                No developers in your network yet. Add your first developer to get started!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* New Developer Modal */}
      <Dialog 
        open={newDeveloperModal.open} 
        onClose={() => setNewDeveloperModal({ ...newDeveloperModal, open: false })}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Add New Developer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Developer Name"
                  value={newDeveloperModal.name}
                  onChange={(e) => setNewDeveloperModal({ ...newDeveloperModal, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={newDeveloperModal.company}
                  onChange={(e) => setNewDeveloperModal({ ...newDeveloperModal, company: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newDeveloperModal.email}
                  onChange={(e) => setNewDeveloperModal({ ...newDeveloperModal, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={newDeveloperModal.phone}
                  onChange={(e) => setNewDeveloperModal({ ...newDeveloperModal, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Specialties"
                  value={newDeveloperModal.specialties}
                  onChange={(e) => setNewDeveloperModal({ ...newDeveloperModal, specialties: e.target.value })}
                  placeholder="e.g., Residential Development"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preferred Areas"
                  value={newDeveloperModal.preferred_areas}
                  onChange={(e) => setNewDeveloperModal({ ...newDeveloperModal, preferred_areas: e.target.value })}
                  placeholder="e.g., Downtown, Suburbs"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={newDeveloperModal.notes}
                  onChange={(e) => setNewDeveloperModal({ ...newDeveloperModal, notes: e.target.value })}
                  placeholder="Optional notes about this developer..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDeveloperModal({ ...newDeveloperModal, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleCreateDeveloper} variant="contained">
            Add Developer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Developers
