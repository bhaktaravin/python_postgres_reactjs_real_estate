"""
Property Research Module
Handles property data collection and tax delinquency research.
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import sqlite3
import time
import logging
from typing import List, Dict, Optional

class PropertyResearcher:
    """Research properties for investment opportunities."""
    
    def __init__(self, database_path: str = "data/properties.db"):
        self.database_path = database_path
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        # Initialize database on creation
        self.init_database()
        
    def init_database(self):
        """Initialize the properties database."""
        with sqlite3.connect(self.database_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS properties (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    address TEXT NOT NULL,
                    city TEXT,
                    state TEXT,
                    zip_code TEXT,
                    tax_assessment REAL,
                    market_value REAL,
                    tax_delinquent BOOLEAN,
                    tax_amount_owed REAL,
                    owner_name TEXT,
                    owner_contact TEXT,
                    property_type TEXT,
                    lot_size REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
    def research_property(self, address: str, city: str, state: str) -> Dict:
        """Research a specific property for investment potential."""
        property_data = {
            'address': address,
            'city': city,
            'state': state,
            'researched_at': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Simulate property lookup (in real implementation, would scrape county records)
        property_data['tax_assessment'] = 18500.0  # Example data
        property_data['market_value'] = 22000.0
        property_data['tax_delinquent'] = True
        property_data['tax_amount_owed'] = 3200.0
        property_data['owner_name'] = 'John Doe'
        property_data['property_type'] = 'Vacant Land'
        property_data['lot_size'] = 0.25
        
        # Store in database
        self._save_property(property_data)
        
        return property_data
        
    def find_tax_delinquent_properties(self, city: str, state: str, limit: int = 20) -> List[Dict]:
        """Find properties with tax delinquencies in a given area."""
        # This would typically scrape county tax assessor websites
        # For now, returning sample data
        
        sample_properties = []
        for i in range(min(limit, 10)):  # Generate sample data
            prop = {
                'address': f'{100 + i * 5} Main St',
                'city': city,
                'state': state,
                'tax_assessment': 15000 + (i * 2000),
                'market_value': 20000 + (i * 3000),
                'tax_delinquent': True,
                'tax_amount_owed': 1500 + (i * 200),
                'owner_name': f'Owner {i + 1}',
                'property_type': 'Vacant Land',
                'lot_size': 0.2 + (i * 0.1)
            }
            sample_properties.append(prop)
            self._save_property(prop)
            
        return sample_properties
        
    def get_property_history(self, address: str) -> List[Dict]:
        """Get historical data for a property."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute(
                "SELECT * FROM properties WHERE address = ? ORDER BY created_at DESC",
                (address,)
            )
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
            
    def _save_property(self, property_data: Dict):
        """Save property data to database."""
        with sqlite3.connect(self.database_path) as conn:
            conn.execute('''
                INSERT INTO properties 
                (address, city, state, tax_assessment, market_value, tax_delinquent, 
                 tax_amount_owed, owner_name, property_type, lot_size)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                property_data.get('address'),
                property_data.get('city'),
                property_data.get('state'),
                property_data.get('tax_assessment'),
                property_data.get('market_value'),
                property_data.get('tax_delinquent'),
                property_data.get('tax_amount_owed'),
                property_data.get('owner_name'),
                property_data.get('property_type'),
                property_data.get('lot_size')
            ))
            
    def search_properties(self, **filters) -> List[Dict]:
        """Search properties with various filters."""
        with sqlite3.connect(self.database_path) as conn:
            where_clauses = []
            params = []
            
            if filters.get('city'):
                where_clauses.append("city = ?")
                params.append(filters['city'])
                
            if filters.get('state'):
                where_clauses.append("state = ?")
                params.append(filters['state'])
                
            if filters.get('tax_delinquent'):
                where_clauses.append("tax_delinquent = ?")
                params.append(filters['tax_delinquent'])
                
            if filters.get('max_price'):
                where_clauses.append("market_value <= ?")
                params.append(filters['max_price'])
                
            where_sql = " AND ".join(where_clauses) if where_clauses else "1=1"
            
            cursor = conn.execute(
                f"SELECT * FROM properties WHERE {where_sql} ORDER BY created_at DESC",
                params
            )
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
