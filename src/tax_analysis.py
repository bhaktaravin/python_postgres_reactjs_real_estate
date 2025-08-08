"""
Tax Analysis Module
Analyzes tax delinquency data and calculates investment potential.
"""

import sqlite3
from typing import Dict, List
import logging

class TaxAnalyzer:
    """Analyze tax delinquency for investment opportunities."""
    
    def __init__(self, database_path: str = "data/properties.db"):
        self.database_path = database_path
        
    def analyze_tax_delinquency(self, property_id: int) -> Dict:
        """Analyze tax delinquency status of a property."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute(
                "SELECT * FROM properties WHERE id = ?", (property_id,)
            )
            property_data = cursor.fetchone()
            
            if not property_data:
                return {'error': 'Property not found'}
                
            # Convert to dict
            columns = [description[0] for description in cursor.description]
            prop = dict(zip(columns, property_data))
            
            analysis = {
                'property_id': property_id,
                'tax_delinquent': prop.get('tax_delinquent', False),
                'amount_owed': prop.get('tax_amount_owed', 0),
                'market_value': prop.get('market_value', 0),
                'tax_assessment': prop.get('tax_assessment', 0)
            }
            
            # Calculate tax burden percentage
            if analysis['market_value'] > 0:
                analysis['tax_burden_percentage'] = (analysis['amount_owed'] / analysis['market_value']) * 100
            else:
                analysis['tax_burden_percentage'] = 0
                
            # Determine investment attractiveness
            analysis['investment_score'] = self._calculate_investment_score(analysis)
            analysis['recommendation'] = self._get_recommendation(analysis['investment_score'])
            
            return analysis
            
    def find_high_value_targets(self, min_value: float = 10000, max_tax_burden: float = 20.0) -> List[Dict]:
        """Find properties with high investment potential."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute('''
                SELECT * FROM properties 
                WHERE tax_delinquent = 1 
                AND market_value >= ? 
                AND (tax_amount_owed / market_value * 100) <= ?
                ORDER BY market_value DESC
            ''', (min_value, max_tax_burden))
            
            columns = [description[0] for description in cursor.description]
            properties = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Add analysis for each property
            for prop in properties:
                analysis = self.analyze_tax_delinquency(prop['id'])
                prop.update(analysis)
                
            return properties
            
    def get_tax_trends(self, city: str, state: str) -> Dict:
        """Analyze tax delinquency trends in an area."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute('''
                SELECT 
                    COUNT(*) as total_properties,
                    SUM(CASE WHEN tax_delinquent = 1 THEN 1 ELSE 0 END) as delinquent_count,
                    AVG(tax_amount_owed) as avg_tax_owed,
                    AVG(market_value) as avg_market_value
                FROM properties 
                WHERE city = ? AND state = ?
            ''', (city, state))
            
            result = cursor.fetchone()
            
            if result and result[0] > 0:
                return {
                    'total_properties': result[0],
                    'delinquent_count': result[1],
                    'delinquency_rate': (result[1] / result[0]) * 100,
                    'avg_tax_owed': result[2] or 0,
                    'avg_market_value': result[3] or 0
                }
            else:
                return {
                    'total_properties': 0,
                    'delinquent_count': 0,
                    'delinquency_rate': 0,
                    'avg_tax_owed': 0,
                    'avg_market_value': 0
                }
                
    def _calculate_investment_score(self, analysis: Dict) -> float:
        """Calculate investment attractiveness score (0-100)."""
        score = 50  # Base score
        
        # Higher score for lower tax burden
        if analysis['tax_burden_percentage'] < 5:
            score += 20
        elif analysis['tax_burden_percentage'] < 10:
            score += 10
        elif analysis['tax_burden_percentage'] > 25:
            score -= 20
            
        # Higher score for higher market value
        if analysis['market_value'] > 50000:
            score += 15
        elif analysis['market_value'] > 25000:
            score += 10
        elif analysis['market_value'] < 10000:
            score -= 10
            
        # Bonus for tax delinquency (opportunity)
        if analysis['tax_delinquent']:
            score += 15
            
        return max(0, min(100, score))
        
    def _get_recommendation(self, score: float) -> str:
        """Get investment recommendation based on score."""
        if score >= 80:
            return "Strong Buy - Excellent opportunity"
        elif score >= 60:
            return "Buy - Good investment potential"
        elif score >= 40:
            return "Maybe - Requires careful analysis"
        else:
            return "Avoid - Poor investment potential"
