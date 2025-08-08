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
  Paper,
  Slider,
  Chip,
  Divider,
} from '@mui/material'
import {
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material'

const OfferCalculator = () => {
  const [formData, setFormData] = useState({
    marketValue: 20000,
    taxOwed: 1500,
    targetMargin: 35,
    holdingMonths: 3,
  })
  
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const calculateOffer = () => {
    try {
      setError(null)
      
      if (!formData.marketValue || formData.marketValue <= 0) {
        setError('Please enter a valid market value')
        return
      }

      // Calculate offer components
      const targetMarginDecimal = formData.targetMargin / 100
      const baseOffer = formData.marketValue * (1 - targetMarginDecimal)
      const transactionCosts = formData.marketValue * 0.05 // 5%
      const holdingCosts = formData.marketValue * 0.002 * formData.holdingMonths // 0.2% per month
      const taxFactor = Math.min(formData.taxOwed * 0.5, formData.marketValue * 0.1) // Cap at 10% of market value
      
      const finalOffer = Math.max(1000, Math.floor((baseOffer - transactionCosts - holdingCosts - taxFactor) / 500) * 500)
      const estimatedProfit = (formData.marketValue * 0.9) - finalOffer - transactionCosts - holdingCosts
      const roi = finalOffer > 0 ? (estimatedProfit / finalOffer) * 100 : 0

      // Recommendation
      let recommendation = ''
      let recommendationColor = ''
      if (estimatedProfit > 5000) {
        recommendation = 'Excellent deal - proceed with confidence!'
        recommendationColor = 'success'
      } else if (estimatedProfit > 2000) {
        recommendation = 'Good deal - consider making the offer'
        recommendationColor = 'warning'
      } else if (estimatedProfit > 0) {
        recommendation = 'Marginal deal - proceed with caution'
        recommendationColor = 'warning'
      } else {
        recommendation = 'Poor deal - avoid or renegotiate terms'
        recommendationColor = 'error'
      }

      setResults({
        finalOffer,
        estimatedProfit,
        roi,
        breakdown: {
          baseOffer,
          transactionCosts,
          holdingCosts,
          taxFactor,
        },
        recommendation,
        recommendationColor,
      })
    } catch (err) {
      setError('Error calculating offer')
      console.error('Calculation error:', err)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const loadExample = (marketValue, taxOwed, margin) => {
    setFormData({
      ...formData,
      marketValue,
      taxOwed,
      targetMargin: margin,
    })
    // Auto-calculate for examples
    setTimeout(calculateOffer, 100)
  }

  const ResultCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', textAlign: 'center' }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 1 
        }}>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: `${color}.main` }}>
            {value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Offer Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Property Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Market Value"
                  type="number"
                  value={formData.marketValue}
                  onChange={(e) => handleInputChange('marketValue', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Tax Amount Owed"
                  type="number"
                  value={formData.taxOwed}
                  onChange={(e) => handleInputChange('taxOwed', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom>
                  Target Margin: {formData.targetMargin}%
                </Typography>
                <Slider
                  value={formData.targetMargin}
                  onChange={(_, value) => handleInputChange('targetMargin', value)}
                  min={10}
                  max={60}
                  step={5}
                  marks={[
                    { value: 25, label: '25%' },
                    { value: 35, label: '35%' },
                    { value: 45, label: '45%' },
                  ]}
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom>
                  Holding Period: {formData.holdingMonths} months
                </Typography>
                <Slider
                  value={formData.holdingMonths}
                  onChange={(_, value) => handleInputChange('holdingMonths', value)}
                  min={1}
                  max={12}
                  step={1}
                  marks={[
                    { value: 1, label: '1m' },
                    { value: 6, label: '6m' },
                    { value: 12, label: '12m' },
                  ]}
                  sx={{ mb: 3 }}
                />
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                startIcon={<CalculateIcon />}
                onClick={calculateOffer}
                size="large"
              >
                Calculate Offer
              </Button>
            </CardContent>
          </Card>

          {/* Quick Examples */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Examples
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => loadExample(20000, 1500, 40)}
                >
                  $20k Land with $1.5k Tax Debt
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => loadExample(35000, 2800, 35)}
                >
                  $35k Property with $2.8k Tax Debt
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => loadExample(50000, 0, 30)}
                >
                  $50k Property (No Tax Debt)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} lg={6}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {results ? (
            <Box>
              {/* Main Results */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommended Offer
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                    ${results.finalOffer.toLocaleString()}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main">
                          ${results.estimatedProfit.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Est. Profit
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="info.main">
                          {results.roi.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ROI
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">
                          {formData.targetMargin}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Margin
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Alert severity={results.recommendationColor}>
                    {results.recommendation}
                  </Alert>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cost Breakdown
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Base offer (after margin):</Typography>
                      <Typography fontWeight={500}>
                        ${results.breakdown.baseOffer.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Transaction costs (5%):</Typography>
                      <Typography color="error.main">
                        -${results.breakdown.transactionCosts.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Holding costs:</Typography>
                      <Typography color="error.main">
                        -${results.breakdown.holdingCosts.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Tax consideration:</Typography>
                      <Typography color="error.main">
                        -${results.breakdown.taxFactor.toLocaleString()}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography fontWeight={600}>Final Offer:</Typography>
                      <Typography fontWeight={600} color="primary.main">
                        ${results.finalOffer.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              <CalculateIcon sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Enter property details to calculate your offer
              </Typography>
              <Typography variant="body2">
                Use the form on the left or try one of the quick examples
              </Typography>
            </Paper>
          )}

          {/* Strategy Tips */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Strategy Tips
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Your Investment Strategy:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                <li>Target tax delinquent land/lots</li>
                <li>Offer 40-60% below market value</li>
                <li>Goal: $2-5k profit per flip</li>
                <li>Quick sale to developers</li>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Offer Guidelines:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <li>Start 10-20% lower than calculated offer</li>
                <li>Emphasize cash and quick close</li>
                <li>Factor in repair/cleanup costs</li>
                <li>Consider neighborhood trends</li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OfferCalculator
