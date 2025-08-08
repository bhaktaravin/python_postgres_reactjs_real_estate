import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import {
  Search as SearchIcon,
  Calculate as CalculateIcon,
  Handshake as HandshakeIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import { propertyApi, calculatorApi, dealsApi } from '../services/api'

const PropertyResearch = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [properties, setProperties] = useState([])
  const [searchForm, setSearchForm] = useState({
    city: '',
    state: 'CA',
  })
  
  // Offer modal state
  const [offerModal, setOfferModal] = useState({
    open: false,
    property: null,
    offerAmount: '',
    notes: '',
    calculation: null,
  })

  const states = [
    'CA', 'TX', 'FL', 'NY', 'IL', 'AZ', 'NV', 'CO', 'WA', 'OR'
  ]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchForm.city.trim()) {
      setError('Please enter a city name')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // This would need to be adjusted based on your Flask API structure
      // For now, we'll simulate the search
      const sampleProperties = []
      for (let i = 0; i < 10; i++) {
        sampleProperties.push({
          id: i + 1,
          address: `${100 + i * 5} Main St`,
          city: searchForm.city,
          state: searchForm.state,
          market_value: 20000 + (i * 3000),
          tax_assessment: 15000 + (i * 2000),
          tax_amount_owed: 1500 + (i * 200),
          property_type: 'Vacant Land',
          lot_size: 0.2 + (i * 0.1),
          tax_delinquent: true,
          owner_name: `Owner ${i + 1}`,
        })
      }
      
      setProperties(sampleProperties)
      setSuccess(`Found ${sampleProperties.length} properties in ${searchForm.city}, ${searchForm.state}`)
    } catch (err) {
      setError('Failed to search properties. Make sure the Flask backend is running.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateOffer = async (property) => {
    try {
      const calculation = await calculatorApi.calculateOffer(
        property.market_value,
        property.tax_amount_owed
      )
      
      alert(`Recommended Offer for ${property.address}:\n\n` +
            `Market Value: $${property.market_value.toLocaleString()}\n` +
            `Recommended Offer: $${calculation.offer_amount.toLocaleString()}\n` +
            `Estimated Profit: $${calculation.estimated_profit.toLocaleString()}\n` +
            `ROI: ${calculation.roi.toFixed(1)}%`)
    } catch (err) {
      setError('Failed to calculate offer')
      console.error('Calculation error:', err)
    }
  }

  const handleOpenOfferModal = async (property) => {
    try {
      const calculation = await calculatorApi.calculateOffer(
        property.market_value,
        property.tax_amount_owed
      )
      
      setOfferModal({
        open: true,
        property,
        offerAmount: calculation.offer_amount,
        notes: '',
        calculation,
      })
    } catch (err) {
      setError('Failed to calculate offer')
      console.error('Calculation error:', err)
    }
  }

  const handleCreateOffer = async () => {
    try {
      await dealsApi.createDeal(
        offerModal.property.address,
        parseFloat(offerModal.offerAmount),
        offerModal.notes
      )
      
      setSuccess(`Created offer of $${parseFloat(offerModal.offerAmount).toLocaleString()} for ${offerModal.property.address}`)
      setOfferModal({ open: false, property: null, offerAmount: '', notes: '', calculation: null })
    } catch (err) {
      setError('Failed to create offer')
      console.error('Create offer error:', err)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Property Research
      </Typography>

      {/* Search Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Find Tax Delinquent Properties
          </Typography>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={searchForm.city}
                  onChange={(e) => setSearchForm({ ...searchForm, city: e.target.value })}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={searchForm.state}
                    label="State"
                    onChange={(e) => setSearchForm({ ...searchForm, state: e.target.value })}
                  >
                    {states.map((state) => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2} md={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<SearchIcon />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

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

      {/* Results */}
      {properties.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Results - {properties.length} Properties Found
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">Market Value</TableCell>
                    <TableCell align="right">Tax Assessment</TableCell>
                    <TableCell align="right">Tax Owed</TableCell>
                    <TableCell>Property Type</TableCell>
                    <TableCell align="right">Lot Size</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={500}>
                            {property.address}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {property.city}, {property.state}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" color="success.main" fontWeight={600}>
                          ${property.market_value.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        ${property.tax_assessment.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="error.main" fontWeight={500}>
                          ${property.tax_amount_owed.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={property.property_type} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {property.lot_size.toFixed(2)} acres
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleCalculateOffer(property)}
                            title="Calculate Offer"
                          >
                            <CalculateIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenOfferModal(property)}
                            title="Make Offer"
                          >
                            <HandshakeIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Offer Modal */}
      <Dialog open={offerModal.open} onClose={() => setOfferModal({ ...offerModal, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Make Offer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Property: {offerModal.property?.address}
            </Typography>
            
            <TextField
              fullWidth
              label="Offer Amount"
              type="number"
              value={offerModal.offerAmount}
              onChange={(e) => setOfferModal({ ...offerModal, offerAmount: e.target.value })}
              InputProps={{
                startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={offerModal.notes}
              onChange={(e) => setOfferModal({ ...offerModal, notes: e.target.value })}
              placeholder="Optional notes about this offer..."
              sx={{ mb: 2 }}
            />
            
            {offerModal.calculation && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Offer Analysis:
                </Typography>
                <Typography variant="body2">
                  Market Value: ${offerModal.property?.market_value.toLocaleString()}<br />
                  Estimated Profit: ${offerModal.calculation.estimated_profit.toLocaleString()}<br />
                  Expected ROI: {offerModal.calculation.roi.toFixed(1)}%
                </Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferModal({ ...offerModal, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleCreateOffer} variant="contained">
            Make Offer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PropertyResearch
