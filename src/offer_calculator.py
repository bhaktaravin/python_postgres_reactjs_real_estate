"""
Offer Calculator Module
Calculates strategic offer amounts based on market conditions and profit targets.
"""

from typing import Dict, Tuple
import logging

class OfferCalculator:
    """Calculate strategic offers for real estate investments."""
    
    def __init__(self):
        # Default margins and costs
        self.default_target_margin = 0.35  # 35% below market value
        self.transaction_costs = 0.05      # 5% for closing costs, etc.
        self.holding_costs_monthly = 0.002  # 0.2% per month
        self.default_holding_period = 3     # 3 months average
        
    def calculate_offer(self, market_value: float, target_margin: float = None, 
                       tax_owed: float = 0, holding_months: int = None) -> float:
        """Calculate offer amount based on market value and strategy."""
        if target_margin is None:
            target_margin = self.default_target_margin
            
        if holding_months is None:
            holding_months = self.default_holding_period
            
        # Base offer calculation
        base_offer = market_value * (1 - target_margin)
        
        # Subtract transaction costs
        transaction_cost = market_value * self.transaction_costs
        
        # Subtract holding costs
        holding_cost = market_value * self.holding_costs_monthly * holding_months
        
        # Consider tax liability
        tax_factor = min(tax_owed, market_value * 0.1)  # Cap tax consideration at 10%
        
        # Final offer calculation
        final_offer = base_offer - transaction_cost - holding_cost - (tax_factor * 0.5)
        
        # Round down to nearest $500 for negotiation room
        final_offer = (final_offer // 500) * 500
        
        return max(1000, final_offer)  # Minimum offer of $1,000
        
    def estimate_profit(self, market_value: float, offer_amount: float, 
                       sale_price: float = None) -> float:
        """Estimate profit from a deal."""
        if sale_price is None:
            sale_price = market_value * 0.9  # Assume 10% discount to market
            
        # Calculate total costs
        acquisition_cost = offer_amount
        transaction_costs = market_value * self.transaction_costs
        holding_costs = market_value * self.holding_costs_monthly * self.default_holding_period
        
        total_costs = acquisition_cost + transaction_costs + holding_costs
        gross_profit = sale_price - total_costs
        
        return gross_profit
        
    def analyze_deal(self, property_data: Dict) -> Dict:
        """Comprehensive deal analysis."""
        market_value = property_data.get('market_value', 0)
        tax_owed = property_data.get('tax_amount_owed', 0)
        
        if market_value <= 0:
            return {'error': 'Invalid market value'}
            
        # Calculate offers at different margin levels
        conservative_offer = self.calculate_offer(market_value, 0.25, tax_owed)  # 25% margin
        standard_offer = self.calculate_offer(market_value, 0.35, tax_owed)      # 35% margin
        aggressive_offer = self.calculate_offer(market_value, 0.45, tax_owed)    # 45% margin
        
        # Calculate potential profits
        conservative_profit = self.estimate_profit(market_value, conservative_offer)
        standard_profit = self.estimate_profit(market_value, standard_offer)
        aggressive_profit = self.estimate_profit(market_value, aggressive_offer)
        
        analysis = {
            'property_id': property_data.get('id'),
            'market_value': market_value,
            'tax_owed': tax_owed,
            'offers': {
                'conservative': {
                    'amount': conservative_offer,
                    'margin': 25,
                    'profit': conservative_profit,
                    'roi': (conservative_profit / conservative_offer) * 100 if conservative_offer > 0 else 0
                },
                'standard': {
                    'amount': standard_offer,
                    'margin': 35,
                    'profit': standard_profit,
                    'roi': (standard_profit / standard_offer) * 100 if standard_offer > 0 else 0
                },
                'aggressive': {
                    'amount': aggressive_offer,
                    'margin': 45,
                    'profit': aggressive_profit,
                    'roi': (aggressive_profit / aggressive_offer) * 100 if aggressive_offer > 0 else 0
                }
            },
            'recommendation': self._get_offer_recommendation(market_value, tax_owed, conservative_profit)
        }
        
        return analysis
        
    def calculate_max_offer(self, market_value: float, min_profit: float = 2000) -> float:
        """Calculate maximum offer that still yields minimum profit."""
        # Work backwards from minimum profit requirement
        sale_price = market_value * 0.9  # Conservative sale price
        transaction_costs = market_value * self.transaction_costs
        holding_costs = market_value * self.holding_costs_monthly * self.default_holding_period
        
        max_offer = sale_price - transaction_costs - holding_costs - min_profit
        
        return max(1000, max_offer)
        
    def get_negotiation_strategy(self, market_value: float, owner_situation: str = 'unknown') -> Dict:
        """Get negotiation strategy based on property and owner situation."""
        base_offer = self.calculate_offer(market_value)
        
        strategies = {
            'tax_distressed': {
                'initial_offer': base_offer * 0.8,  # Start lower
                'max_offer': base_offer,
                'timeline': 'Fast close (7-14 days)',
                'approach': 'Emphasize quick cash solution'
            },
            'motivated_seller': {
                'initial_offer': base_offer * 0.9,
                'max_offer': base_offer * 1.1,
                'timeline': 'Standard close (30 days)',
                'approach': 'Fair offer with quick close'
            },
            'unknown': {
                'initial_offer': base_offer,
                'max_offer': base_offer * 1.2,
                'timeline': 'Flexible',
                'approach': 'Professional, cash offer'
            }
        }
        
        return strategies.get(owner_situation, strategies['unknown'])
        
    def _get_offer_recommendation(self, market_value: float, tax_owed: float, profit: float) -> str:
        """Get recommendation for offer strategy."""
        if profit > 5000:
            return "Excellent deal - proceed with standard offer"
        elif profit > 2000:
            return "Good deal - consider conservative approach"
        elif profit > 0:
            return "Marginal deal - needs careful analysis"
        else:
            return "Poor deal - avoid or renegotiate terms"
