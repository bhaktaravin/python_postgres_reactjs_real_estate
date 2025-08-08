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
} from '@mui/material'
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Handshake as HandshakeIcon,
  AccountBalance as AccountBalanceIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material'

const Deals = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [deals, setDeals] = useState([])
  const [stats, setStats] = useState({})
  
  // New deal modal
  const [newDealModal, setNewDealModal] = useState({
    open: false,
    propertyId: '',
    offerAmount: '',
    notes: '',
  })

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call - replace with actual API when backend is ready
      const sampleDeals = [
        {
          id: 1,
          property_id: '100 Main St',
          offer_amount: 12000,
          status: 'pending',
          created_at: '2025-08-07',
          notes: 'Quick cash close',
        },
        {
          id: 2,
          property_id: '105 Main St',
          offer_amount: 15000,
          status: 'accepted',
          created_at: '2025-08-06',
          notes: 'Negotiated down from $18k',
        },
        {
          id: 3,
          property_id: '110 Main St',
          offer_amount: 8500,
          status: 'rejected',
          created_at: '2025-08-05',
          notes: 'Owner wants more',
        },
      ]
      
      const sampleStats = {
        total_deals: 3,
        pending: 1,
        accepted: 1,
        rejected: 1,
        sold: 0,
        total_profit: 0,
        avg_profit: 0,
      }
      
      setDeals(sampleDeals)
      setStats(sampleStats)
    } catch (err) {
      setError('Failed to load deals')
      console.error('Load deals error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [])

  const handleCreateDeal = async () => {
    try {
      if (!newDealModal.propertyId || !newDealModal.offerAmount) {
        setError('Please fill in required fields')
        return
      }

      // Simulate API call
      const newDeal = {
        id: deals.length + 1,
        property_id: newDealModal.propertyId,
        offer_amount: parseFloat(newDealModal.offerAmount),
        status: 'pending',
        created_at: new Date().toISOString().split('T')[0],
        notes: newDealModal.notes,
      }
      
      setDeals([newDeal, ...deals])
      setSuccess(`Created deal for ${newDealModal.propertyId}`)
      setNewDealModal({ open: false, propertyId: '', offerAmount: '', notes: '' })
    } catch (err) {
      setError('Failed to create deal')
      console.error('Create deal error:', err)
    }
  }

  const handleUpdateDealStatus = async (dealId, newStatus) => {
    try {
      setDeals(deals.map(deal => 
        deal.id === dealId ? { ...deal, status: newStatus } : deal
      ))
      setSuccess(`Updated deal #${dealId} to ${newStatus}`)
    } catch (err) {
      setError('Failed to update deal')
      console.error('Update deal error:', err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'accepted': return 'primary'
      case 'sold': return 'success'
      case 'rejected': return 'error'
      default: return 'default'
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
          Deals Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewDealModal({ ...newDealModal, open: true })}
        >
          New Deal
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
            title="Total Deals"
            value={stats.total_deals || 0}
            icon={<HandshakeIcon sx={{ fontSize: 32 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending || 0}
            icon={<AccessTimeIcon sx={{ fontSize: 32 }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Accepted"
            value={stats.accepted || 0}
            icon={<TrendingUpIcon sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Profit"
            value={`$${(stats.total_profit || 0).toLocaleString()}`}
            icon={<AccountBalanceIcon sx={{ fontSize: 32 }} />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Deals Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Deals
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Deal #</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell align="right">Offer Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        #{deal.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{deal.property_id}</TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" color="success.main" fontWeight={600}>
                        ${deal.offer_amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={deal.status.charAt(0).toUpperCase() + deal.status.slice(1)} 
                        color={getStatusColor(deal.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{deal.created_at}</TableCell>
                    <TableCell>{deal.notes || '-'}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {deal.status === 'pending' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleUpdateDealStatus(deal.id, 'accepted')}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleUpdateDealStatus(deal.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {deal.status === 'accepted' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleUpdateDealStatus(deal.id, 'sold')}
                          >
                            Mark Sold
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {deals.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">
                No deals found. Create your first deal to get started!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* New Deal Modal */}
      <Dialog 
        open={newDealModal.open} 
        onClose={() => setNewDealModal({ ...newDealModal, open: false })}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Create New Deal</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Property ID/Address"
              value={newDealModal.propertyId}
              onChange={(e) => setNewDealModal({ ...newDealModal, propertyId: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Offer Amount"
              type="number"
              value={newDealModal.offerAmount}
              onChange={(e) => setNewDealModal({ ...newDealModal, offerAmount: e.target.value })}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={newDealModal.notes}
              onChange={(e) => setNewDealModal({ ...newDealModal, notes: e.target.value })}
              placeholder="Optional notes about this deal..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDealModal({ ...newDealModal, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleCreateDeal} variant="contained">
            Create Deal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Deals
