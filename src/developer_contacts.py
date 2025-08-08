"""
Developer Contacts Module
Manages relationships with developers for property flipping.
"""

import sqlite3
from typing import List, Dict, Optional
from datetime import datetime
import logging

class DeveloperManager:
    """Manage developer contacts and relationships."""
    
    def __init__(self, database_path: str = "data/developers.db"):
        self.database_path = database_path
        
    def init_database(self):
        """Initialize the developers database."""
        with sqlite3.connect(self.database_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS developers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT,
                    phone TEXT,
                    company TEXT,
                    specialty TEXT,
                    preferred_areas TEXT,
                    min_deal_size REAL,
                    max_deal_size REAL,
                    notes TEXT,
                    active BOOLEAN DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_contact TIMESTAMP
                )
            ''')
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS developer_transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    developer_id INTEGER,
                    deal_id INTEGER,
                    purchase_price REAL,
                    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    notes TEXT,
                    FOREIGN KEY (developer_id) REFERENCES developers (id)
                )
            ''')
            
    def add_developer(self, name: str, email: str = None, phone: str = None, 
                     company: str = None, specialty: str = None) -> int:
        """Add a new developer contact."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute('''
                INSERT INTO developers (name, email, phone, company, specialty)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, phone, company, specialty))
            
            return cursor.lastrowid or 0
            
    def update_developer(self, developer_id: int, **kwargs):
        """Update developer information."""
        allowed_fields = ['name', 'email', 'phone', 'company', 'specialty', 
                         'preferred_areas', 'min_deal_size', 'max_deal_size', 'notes', 'active']
        
        updates = []
        params = []
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                updates.append(f"{field} = ?")
                params.append(value)
                
        if not updates:
            return
            
        params.append(developer_id)
        
        with sqlite3.connect(self.database_path) as conn:
            conn.execute(f'''
                UPDATE developers 
                SET {", ".join(updates)}, last_contact = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', params)
            
    def get_all_developers(self, active_only: bool = True) -> List[Dict]:
        """Get all developer contacts."""
        with sqlite3.connect(self.database_path) as conn:
            if active_only:
                cursor = conn.execute('''
                    SELECT * FROM developers 
                    WHERE active = 1 
                    ORDER BY name
                ''')
            else:
                cursor = conn.execute('SELECT * FROM developers ORDER BY name')
                
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
            
    def find_developers_for_property(self, property_type: str = None, 
                                   deal_size: float = None, area: str = None) -> List[Dict]:
        """Find developers suitable for a specific property."""
        with sqlite3.connect(self.database_path) as conn:
            where_clauses = ["active = 1"]
            params = []
            
            if property_type:
                where_clauses.append("(specialty = ? OR specialty IS NULL)")
                params.append(property_type)
                
            if deal_size:
                where_clauses.append('''
                    (min_deal_size IS NULL OR min_deal_size <= ?) AND
                    (max_deal_size IS NULL OR max_deal_size >= ?)
                ''')
                params.extend([deal_size, deal_size])
                
            if area:
                where_clauses.append("(preferred_areas LIKE ? OR preferred_areas IS NULL)")
                params.append(f"%{area}%")
                
            where_sql = " AND ".join(where_clauses)
            
            cursor = conn.execute(f'''
                SELECT * FROM developers 
                WHERE {where_sql}
                ORDER BY last_contact DESC NULLS LAST, name
            ''', params)
            
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
            
    def record_transaction(self, developer_id: int, deal_id: int, 
                          purchase_price: float, notes: str = None):
        """Record a transaction with a developer."""
        with sqlite3.connect(self.database_path) as conn:
            conn.execute('''
                INSERT INTO developer_transactions 
                (developer_id, deal_id, purchase_price, notes)
                VALUES (?, ?, ?, ?)
            ''', (developer_id, deal_id, purchase_price, notes))
            
            # Update developer's last contact
            conn.execute('''
                UPDATE developers 
                SET last_contact = CURRENT_TIMESTAMP 
                WHERE id = ?
            ''', (developer_id,))
            
    def get_developer_history(self, developer_id: int) -> Dict:
        """Get transaction history for a developer."""
        with sqlite3.connect(self.database_path) as conn:
            # Get developer info
            cursor = conn.execute("SELECT * FROM developers WHERE id = ?", (developer_id,))
            dev_result = cursor.fetchone()
            
            if not dev_result:
                return {'error': 'Developer not found'}
                
            dev_columns = [description[0] for description in cursor.description]
            developer = dict(zip(dev_columns, dev_result))
            
            # Get transactions
            cursor = conn.execute('''
                SELECT * FROM developer_transactions 
                WHERE developer_id = ? 
                ORDER BY transaction_date DESC
            ''', (developer_id,))
            
            trans_columns = [description[0] for description in cursor.description]
            transactions = [dict(zip(trans_columns, row)) for row in cursor.fetchall()]
            
            # Calculate stats
            if transactions:
                total_volume = sum(t['purchase_price'] for t in transactions)
                avg_deal_size = total_volume / len(transactions)
            else:
                total_volume = 0
                avg_deal_size = 0
                
            return {
                'developer': developer,
                'transactions': transactions,
                'stats': {
                    'total_deals': len(transactions),
                    'total_volume': total_volume,
                    'avg_deal_size': avg_deal_size
                }
            }
            
    def get_top_developers(self, limit: int = 10) -> List[Dict]:
        """Get top developers by transaction volume."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute('''
                SELECT 
                    d.*,
                    COUNT(dt.id) as deal_count,
                    SUM(dt.purchase_price) as total_volume,
                    AVG(dt.purchase_price) as avg_deal_size
                FROM developers d
                LEFT JOIN developer_transactions dt ON d.id = dt.developer_id
                WHERE d.active = 1
                GROUP BY d.id
                ORDER BY total_volume DESC NULLS LAST
                LIMIT ?
            ''', (limit,))
            
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
            
    def search_developers(self, search_term: str) -> List[Dict]:
        """Search developers by name, company, or specialty."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute('''
                SELECT * FROM developers 
                WHERE active = 1 AND (
                    name LIKE ? OR 
                    company LIKE ? OR 
                    specialty LIKE ?
                )
                ORDER BY name
            ''', (f"%{search_term}%", f"%{search_term}%", f"%{search_term}%"))
            
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
