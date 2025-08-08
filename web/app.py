#!/usr/bin/env python3
"""
Real Estate Investment Tool - Web Frontend
Flask web application for managing property deals and developer relationships.
"""

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, create_refresh_token
from datetime import timedelta
import sys
import os
from pathlib import Path

# Add src directory to path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root / "src"))
os.chdir(project_root)  # Change working directory to project root

from property_research import PropertyResearcher
from tax_analysis import TaxAnalyzer
from offer_calculator import OfferCalculator
from deal_tracker import DealTracker
from developer_contacts import DeveloperManager
from user_auth import UserManager

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'jwt-secret-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize JWT
jwt = JWTManager(app)

# Enable CORS for all routes to allow React frontend to connect
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

# Initialize components
researcher = PropertyResearcher()
tax_analyzer = TaxAnalyzer()
calculator = OfferCalculator()
tracker = DealTracker()
dev_manager = DeveloperManager()
user_manager = UserManager()

# Create demo user on startup
user_manager.create_demo_user()

def init_all_databases():
    """Initialize all database tables for the real estate investment tool."""
    try:
        print("🏠 Initializing Real Estate Investment Tool databases...")
        
        # Initialize all databases
        researcher.init_database()
        print("✅ Property research database initialized")
        
        tracker.init_database()
        print("✅ Deal tracking database initialized")
        
        dev_manager.init_database()
        print("✅ Developer management database initialized")
        
        user_manager.init_database()
        print("✅ User authentication database initialized")
        
        # Create demo user
        user_manager.create_demo_user()
        print("✅ Demo user created")
        
        print("🎉 All databases initialized successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Database initialization failed: {str(e)}")
        return False

# Initialize databases on startup
init_all_databases()

@app.route('/init-db')
def init_database_endpoint():
    """Manual database initialization endpoint."""
    try:
        success = init_all_databases()
        if success:
            return jsonify({
                'status': 'success',
                'message': 'All databases initialized successfully'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Database initialization failed'
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Database initialization error: {str(e)}'
        }), 500

@app.route('/health')
def health_check():
    """Health check endpoint for deployment monitoring."""
    try:
        # Test database connection
        user_manager.get_user_by_id(1)
        return jsonify({
            'status': 'healthy',
            'message': 'Real Estate Investment API is running',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'message': str(e),
            'database': 'error'
        }), 500

@app.route('/')
def dashboard():
    """Main dashboard showing overview of deals and opportunities."""
    try:
        # Get recent deals
        recent_deals = tracker.get_active_deals()[:5]
        
        # Get deal statistics
        stats = tracker.get_deal_stats()
        
        # Get recent properties researched
        recent_properties = researcher.search_properties()[:5]
        
        # Get developer count
        developers = dev_manager.get_all_developers()
        
        return render_template('dashboard.html', 
                             recent_deals=recent_deals,
                             stats=stats,
                             recent_properties=recent_properties,
                             developer_count=len(developers))
    except Exception as e:
        flash(f'Error loading dashboard: {str(e)}', 'error')
        return render_template('dashboard.html', 
                             recent_deals=[],
                             stats={},
                             recent_properties=[],
                             developer_count=0)

@app.route('/research')
def research():
    """Property research page."""
    return render_template('research.html')

@app.route('/research/search', methods=['POST'])
def research_search():
    """Handle property search requests."""
    city = request.form.get('city', '').strip()
    state = request.form.get('state', 'CA').strip()
    
    if not city:
        flash('Please enter a city name', 'error')
        return redirect(url_for('research'))
    
    try:
        properties = researcher.find_tax_delinquent_properties(city, state, limit=20)
        flash(f'Found {len(properties)} potential opportunities in {city}, {state}', 'success')
        return render_template('research.html', properties=properties, city=city, state=state)
    except Exception as e:
        flash(f'Error searching properties: {str(e)}', 'error')
        return redirect(url_for('research'))

@app.route('/property/<property_id>')
def property_detail(property_id):
    """Show detailed information about a property."""
    try:
        # Get property from database (simplified - using address as ID)
        properties = researcher.search_properties()
        property_data = None
        for prop in properties:
            if str(prop.get('id')) == property_id or prop.get('address') == property_id:
                property_data = prop
                break
        
        if not property_data:
            flash('Property not found', 'error')
            return redirect(url_for('research'))
        
        # Calculate offer analysis
        analysis = calculator.analyze_deal(property_data)
        
        # Get tax analysis if property has tax data
        tax_analysis = None
        if property_data.get('id'):
            tax_analysis = tax_analyzer.analyze_tax_delinquency(property_data['id'])
        
        return render_template('property_detail.html', 
                             property=property_data,
                             analysis=analysis,
                             tax_analysis=tax_analysis)
    except Exception as e:
        flash(f'Error loading property details: {str(e)}', 'error')
        return redirect(url_for('research'))

@app.route('/deals')
def deals():
    """Deals management page."""
    try:
        active_deals = tracker.get_active_deals()
        all_deals = tracker.get_deal_history()
        stats = tracker.get_deal_stats()
        
        return render_template('deals.html', 
                             active_deals=active_deals,
                             all_deals=all_deals,
                             stats=stats)
    except Exception as e:
        flash(f'Error loading deals: {str(e)}', 'error')
        return render_template('deals.html', 
                             active_deals=[],
                             all_deals=[],
                             stats={})

@app.route('/deals/create', methods=['POST'])
def create_deal():
    """Create a new deal."""
    try:
        property_id = request.form.get('property_id', '').strip()
        offer_amount = float(request.form.get('offer_amount', 0))
        notes = request.form.get('notes', '').strip()
        
        if not property_id or offer_amount <= 0:
            flash('Please provide valid property ID and offer amount', 'error')
            return redirect(url_for('deals'))
        
        deal_id = tracker.create_deal(property_id, offer_amount, notes)
        flash(f'Created deal #{deal_id} - ${offer_amount:,.2f} offer for {property_id}', 'success')
        
    except ValueError as e:
        flash(f'Invalid offer amount: {str(e)}', 'error')
    except Exception as e:
        flash(f'Error creating deal: {str(e)}', 'error')
    
    return redirect(url_for('deals'))

@app.route('/deals/<int:deal_id>/update', methods=['POST'])
def update_deal(deal_id):
    """Update deal status."""
    try:
        status = request.form.get('status')
        notes = request.form.get('notes', '').strip()
        
        tracker.update_deal_status(deal_id, status, notes)
        flash(f'Updated deal #{deal_id} status to: {status}', 'success')
        
    except Exception as e:
        flash(f'Error updating deal: {str(e)}', 'error')
    
    return redirect(url_for('deals'))

@app.route('/developers')
def developers():
    """Developer management page."""
    try:
        all_developers = dev_manager.get_all_developers()
        top_developers = dev_manager.get_top_developers(5)
        
        return render_template('developers.html', 
                             developers=all_developers,
                             top_developers=top_developers)
    except Exception as e:
        flash(f'Error loading developers: {str(e)}', 'error')
        return render_template('developers.html', 
                             developers=[],
                             top_developers=[])

@app.route('/developers/add', methods=['POST'])
def add_developer():
    """Add a new developer."""
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        company = request.form.get('company', '').strip()
        specialty = request.form.get('specialty', '').strip()
        
        if not name:
            flash('Developer name is required', 'error')
            return redirect(url_for('developers'))
        
        dev_id = dev_manager.add_developer(name, email, phone, company, specialty)
        flash(f'Added developer: {name} (ID: {dev_id})', 'success')
        
    except Exception as e:
        flash(f'Error adding developer: {str(e)}', 'error')
    
    return redirect(url_for('developers'))

@app.route('/api/calculate-offer', methods=['POST'])
def api_calculate_offer():
    """API endpoint to calculate offer amount."""
    try:
        data = request.get_json()
        market_value = float(data.get('market_value', 0))
        tax_owed = float(data.get('tax_owed', 0))
        
        if market_value <= 0:
            return jsonify({'error': 'Invalid market value'}), 400
        
        offer = calculator.calculate_offer(market_value, tax_owed=tax_owed)
        profit = calculator.estimate_profit(market_value, offer)
        
        return jsonify({
            'offer_amount': offer,
            'estimated_profit': profit,
            'roi': (profit / offer * 100) if offer > 0 else 0
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/calculator')
def calculator_page():
    """Offer calculator page."""
    return render_template('calculator.html')

# ===== API ENDPOINTS FOR REACT FRONTEND =====

# ===== AUTHENTICATION ENDPOINTS =====

@app.route('/api/auth/register', methods=['POST'])
def api_register():
    """Register a new user."""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        
        if not username or not email or not password:
            return jsonify({
                'success': False,
                'error': 'Username, email, and password are required'
            }), 400
        
        result = user_manager.register_user(username, email, password, first_name, last_name)
        
        if result['success']:
            # Create JWT tokens for immediate login
            access_token = create_access_token(identity=str(result['user']['id']))
            refresh_token = create_refresh_token(identity=str(result['user']['id']))
            
            return jsonify({
                'success': True,
                'data': {
                    'user': result['user'],
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    """Authenticate user and return JWT tokens."""
    try:
        data = request.get_json()
        username_or_email = data.get('username_or_email', '').strip()
        password = data.get('password', '').strip()
        
        if not username_or_email or not password:
            return jsonify({
                'success': False,
                'error': 'Username/email and password are required'
            }), 400
        
        result = user_manager.authenticate_user(username_or_email, password)
        
        if result['success']:
            # Create JWT tokens
            access_token = create_access_token(identity=str(result['user']['id']))
            refresh_token = create_refresh_token(identity=str(result['user']['id']))
            
            return jsonify({
                'success': True,
                'data': {
                    'user': result['user'],
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def api_refresh_token():
    """Refresh access token using refresh token."""
    try:
        current_user_id = int(get_jwt_identity())
        new_access_token = create_access_token(identity=str(current_user_id))
        
        return jsonify({
            'success': True,
            'data': {
                'access_token': new_access_token
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def api_get_current_user():
    """Get current user information."""
    try:
        current_user_id = int(get_jwt_identity())
        user = user_manager.get_user_by_id(current_user_id)
        
        if user:
            return jsonify({
                'success': True,
                'data': {'user': user}
            })
        else:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def api_update_profile():
    """Update user profile."""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        
        result = user_manager.update_user_profile(current_user_id, first_name, last_name, email)
        
        if result['success']:
            # Get updated user info
            user = user_manager.get_user_by_id(current_user_id)
            return jsonify({
                'success': True,
                'data': {
                    'user': user,
                    'message': result['message']
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/change-password', methods=['POST'])
@jwt_required()
def api_change_password():
    """Change user password."""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        current_password = data.get('current_password', '').strip()
        new_password = data.get('new_password', '').strip()
        
        if not current_password or not new_password:
            return jsonify({
                'success': False,
                'error': 'Current password and new password are required'
            }), 400
        
        result = user_manager.change_password(current_user_id, current_password, new_password)
        
        if result['success']:
            return jsonify({
                'success': True,
                'data': {'message': result['message']}
            })
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ===== PROTECTED API ENDPOINTS =====

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def api_dashboard_stats():
    """Get dashboard statistics for React frontend."""
    try:
        # Get deal statistics
        deal_stats = tracker.get_deal_stats()
        
        # Get developer count
        developers = dev_manager.get_all_developers()
        
        # Get recent activities (deals and properties)
        recent_deals = tracker.get_active_deals()[:5]
        recent_properties = researcher.search_properties()[:5]
        
        return jsonify({
            'success': True,
            'data': {
                'stats': {
                    'total_deals': deal_stats.get('total_deals', 0),
                    'pending_deals': deal_stats.get('pending_deals', 0),
                    'accepted_deals': deal_stats.get('accepted_deals', 0),
                    'total_profit': deal_stats.get('total_profit', 0),
                    'total_developers': len(developers),
                    'active_properties': len(recent_properties),
                },
                'recent_deals': recent_deals,
                'recent_properties': recent_properties
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/properties/search', methods=['POST'])
@jwt_required()
def api_properties_search():
    """Search for properties via API."""
    try:
        data = request.get_json()
        city = data.get('city', '').strip()
        state = data.get('state', 'CA').strip()
        limit = int(data.get('limit', 50))
        
        if not city:
            return jsonify({
                'success': False,
                'error': 'City is required'
            }), 400
        
        properties = researcher.find_tax_delinquent_properties(city, state, limit=limit)
        
        return jsonify({
            'success': True,
            'data': {
                'properties': properties,
                'count': len(properties)
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/properties', methods=['GET'])
@jwt_required()
def api_get_properties():
    """Get all properties."""
    try:
        properties = researcher.search_properties()
        return jsonify({
            'success': True,
            'data': properties
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/deals', methods=['GET'])
@jwt_required()
def api_get_deals():
    """Get all deals."""
    try:
        deals = tracker.get_deal_history()
        stats = tracker.get_deal_stats()
        
        return jsonify({
            'success': True,
            'data': {
                'deals': deals,
                'stats': stats
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/deals', methods=['POST'])
@jwt_required()
def api_create_deal():
    """Create a new deal via API."""
    try:
        data = request.get_json()
        property_id = data.get('property_id', '').strip()
        offer_amount = float(data.get('offer_amount', 0))
        notes = data.get('notes', '').strip()
        
        if not property_id or offer_amount <= 0:
            return jsonify({
                'success': False,
                'error': 'Property ID and valid offer amount are required'
            }), 400
        
        deal_id = tracker.create_deal(property_id, offer_amount, notes)
        
        return jsonify({
            'success': True,
            'data': {
                'deal_id': deal_id,
                'message': f'Created deal #{deal_id}'
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/deals/<int:deal_id>', methods=['PUT'])
@jwt_required()
def api_update_deal(deal_id):
    """Update deal status via API."""
    try:
        data = request.get_json()
        status = data.get('status')
        notes = data.get('notes', '')
        
        tracker.update_deal_status(deal_id, status, notes)
        
        return jsonify({
            'success': True,
            'data': {
                'message': f'Updated deal #{deal_id} to {status}'
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/developers', methods=['GET'])
@jwt_required()
def api_get_developers():
    """Get all developers."""
    try:
        developers = dev_manager.get_all_developers()
        
        # Calculate stats
        stats = {
            'total_developers': len(developers),
            'active_developers': len([d for d in developers if d.get('rating', 0) > 0]),
            'total_deals': sum([d.get('deals_count', 0) for d in developers]),
            'avg_rating': sum([d.get('rating', 0) for d in developers]) / len(developers) if developers else 0
        }
        
        return jsonify({
            'success': True,
            'data': {
                'developers': developers,
                'stats': stats
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/developers', methods=['POST'])
@jwt_required()
def api_create_developer():
    """Add a new developer via API."""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        company = data.get('company', '').strip()
        specialties = data.get('specialties', '').strip()
        preferred_areas = data.get('preferred_areas', '').strip()
        notes = data.get('notes', '').strip()
        
        if not name or not email:
            return jsonify({
                'success': False,
                'error': 'Name and email are required'
            }), 400
        
        dev_id = dev_manager.add_developer(name, email, phone, company, specialties)
        
        return jsonify({
            'success': True,
            'data': {
                'developer_id': dev_id,
                'message': f'Added developer: {name}'
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/calculate-offer', methods=['POST'])
@jwt_required()
def api_calculate_offer_detailed():
    """Enhanced API endpoint to calculate offer amount with detailed analysis."""
    try:
        data = request.get_json()
        market_value = float(data.get('market_value', 0))
        tax_owed = float(data.get('tax_owed', 0))
        rehab_cost = float(data.get('rehab_cost', 0))
        holding_time = int(data.get('holding_time', 6))
        
        if market_value <= 0:
            return jsonify({
                'success': False,
                'error': 'Invalid market value'
            }), 400
        
        # Calculate base offer
        offer = calculator.calculate_offer(market_value, tax_owed=tax_owed)
        
        # Calculate profit estimates
        profit = calculator.estimate_profit(market_value, offer)
        
        # Calculate additional costs
        holding_costs = (market_value * 0.02) * (holding_time / 12)  # 2% per year
        closing_costs = market_value * 0.03  # 3% closing costs
        total_costs = offer + tax_owed + rehab_cost + holding_costs + closing_costs
        
        # Calculate net profit
        net_profit = market_value - total_costs
        roi = (net_profit / offer * 100) if offer > 0 else 0
        
        return jsonify({
            'success': True,
            'data': {
                'offer_amount': offer,
                'market_value': market_value,
                'tax_owed': tax_owed,
                'rehab_cost': rehab_cost,
                'holding_costs': holding_costs,
                'closing_costs': closing_costs,
                'total_costs': total_costs,
                'gross_profit': profit,
                'net_profit': net_profit,
                'roi': roi,
                'profit_margin': (net_profit / market_value * 100) if market_value > 0 else 0
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
