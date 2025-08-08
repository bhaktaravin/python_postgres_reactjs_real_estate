"""
Deal Tracker Module
Manages the pipeline of active deals and negotiations.
"""

import sqlite3
from typing import List, Dict, Optional
from datetime import datetime
import logging

class DealTracker:
    """Track and manage real estate deals pipeline."""
    
    def __init__(self, database_path: str = "data/deals.db"):
        self.database_path = database_path
        
    def init_database(self):
        """Initialize the deals database."""
        with sqlite3.connect(self.database_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS deals (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    property_id TEXT NOT NULL,
                    property_address TEXT,
                    offer_amount REAL NOT NULL,
                    status TEXT DEFAULT 'pending',
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    accepted_at TIMESTAMP,
                    sold_to_developer TEXT,
                    sale_price REAL,
                    profit REAL
                )
            ''')
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS deal_communications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    deal_id INTEGER,
                    communication_type TEXT,
                    contact_method TEXT,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (deal_id) REFERENCES deals (id)
                )
            ''')
            
    def create_deal(self, property_id: str, offer_amount: float, notes: str = None, 
                   property_address: str = None) -> int:
        """Create a new deal record."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute('''
                INSERT INTO deals (property_id, property_address, offer_amount, notes)
                VALUES (?, ?, ?, ?)
            ''', (property_id, property_address, offer_amount, notes))
            
            return cursor.lastrowid
            
    def update_deal_status(self, deal_id: int, status: str, notes: str = None):
        """Update deal status."""
        valid_statuses = ['pending', 'accepted', 'rejected', 'sold', 'cancelled']
        if status not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
            
        with sqlite3.connect(self.database_path) as conn:
            update_sql = "UPDATE deals SET status = ?, updated_at = CURRENT_TIMESTAMP"
            params = [status]
            
            if status == 'accepted':
                update_sql += ", accepted_at = CURRENT_TIMESTAMP"
                
            if notes:
                update_sql += ", notes = ?"
                params.append(notes)
                
            update_sql += " WHERE id = ?"
            params.append(deal_id)
            
            conn.execute(update_sql, params)
            
    def record_sale(self, deal_id: int, developer_name: str, sale_price: float):
        """Record sale to developer."""
        with sqlite3.connect(self.database_path) as conn:
            # Get the deal to calculate profit
            cursor = conn.execute("SELECT offer_amount FROM deals WHERE id = ?", (deal_id,))
            result = cursor.fetchone()
            
            if not result:
                raise ValueError("Deal not found")
                
            offer_amount = result[0]
            profit = sale_price - offer_amount
            
            conn.execute('''
                UPDATE deals 
                SET status = 'sold', sold_to_developer = ?, sale_price = ?, 
                    profit = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (developer_name, sale_price, profit, deal_id))
            
    def get_active_deals(self) -> List[Dict]:
        """Get all active (non-sold) deals."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute('''
                SELECT * FROM deals 
                WHERE status IN ('pending', 'accepted') 
                ORDER BY created_at DESC
            ''')
            
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
            
    def get_deal_history(self, property_id: str = None) -> List[Dict]:
        """Get deal history, optionally filtered by property."""
        with sqlite3.connect(self.database_path) as conn:
            if property_id:
                cursor = conn.execute(
                    "SELECT * FROM deals WHERE property_id = ? ORDER BY created_at DESC",
                    (property_id,)
                )
            else:
                cursor = conn.execute("SELECT * FROM deals ORDER BY created_at DESC")
                
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
            
    def get_deal_stats(self) -> Dict:
        """Get deal statistics and performance metrics."""
        with sqlite3.connect(self.database_path) as conn:
            # Basic counts
            cursor = conn.execute('''
                SELECT 
                    COUNT(*) as total_deals,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
                    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                    SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold
                FROM deals
            ''')
            
            counts = cursor.fetchone()
            
            # Financial stats
            cursor = conn.execute('''
                SELECT 
                    AVG(offer_amount) as avg_offer,
                    AVG(sale_price) as avg_sale_price,
                    SUM(profit) as total_profit,
                    AVG(profit) as avg_profit
                FROM deals 
                WHERE status = 'sold'
            ''')
            
            financial = cursor.fetchone()
            
            return {
                'total_deals': counts[0] or 0,
                'pending': counts[1] or 0,
                'accepted': counts[2] or 0,
                'rejected': counts[3] or 0,
                'sold': counts[4] or 0,
                'success_rate': (counts[4] / counts[0] * 100) if counts[0] > 0 else 0,
                'avg_offer': financial[0] or 0,
                'avg_sale_price': financial[1] or 0,
                'total_profit': financial[2] or 0,
                'avg_profit': financial[3] or 0
            }
            
    def add_communication(self, deal_id: int, comm_type: str, contact_method: str, notes: str):
        """Add communication record for a deal."""
        with sqlite3.connect(self.database_path) as conn:
            conn.execute('''
                INSERT INTO deal_communications 
                (deal_id, communication_type, contact_method, notes)
                VALUES (?, ?, ?, ?)
            ''', (deal_id, comm_type, contact_method, notes))
            
    def get_deal_communications(self, deal_id: int) -> List[Dict]:
        """Get all communications for a specific deal."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute('''
                SELECT * FROM deal_communications 
                WHERE deal_id = ? 
                ORDER BY created_at DESC
            ''', (deal_id,))
            
            columns = [description[0] for description in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
            
    def get_deal_by_id(self, deal_id: int) -> Optional[Dict]:
        """Get a specific deal by ID."""
        with sqlite3.connect(self.database_path) as conn:
            cursor = conn.execute("SELECT * FROM deals WHERE id = ?", (deal_id,))
            result = cursor.fetchone()
            
            if result:
                columns = [description[0] for description in cursor.description]
                return dict(zip(columns, result))
            
            return None
