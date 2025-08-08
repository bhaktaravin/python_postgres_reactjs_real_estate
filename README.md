# Real Estate Investment Tool

A Python-based tool for finding tax delinquent properties, making strategic offers, and managing deals with developers.

## 🚀 Quick Start

### Option 1: Web Interface (Recommended)
```bash
# Setup the tool
python main.py setup

# Start the web interface
PYTHONPATH=src python web/app.py
# Then open http://localhost:5000 in your browser
```

### Option 2: Command Line Interface
```bash
# Setup the tool
python main.py setup

# Run a quick test
python example.py

# Find investment opportunities
python main.py research --city "Your City"
```

## 🌐 Web Interface Features

The web interface provides an intuitive dashboard with:

- **📊 Dashboard**: Overview of deals, profits, and opportunities
- **🔍 Property Research**: Search for tax delinquent properties by city
- **🧮 Offer Calculator**: Calculate strategic offers with profit analysis
- **🤝 Deals Management**: Track your pipeline of offers and negotiations
- **👥 Developer Network**: Manage developer contacts and relationships

### Web Interface Screenshots
- Beautiful, responsive design with Bootstrap
- Real-time offer calculations
- Interactive property search
- Deal status tracking
- Developer relationship management

## 📱 Command Line Features

- **Property Research**: Find tax delinquent properties and land parcels
- **Offer Calculator**: Calculate strategic offers based on market value and profit targets
- **Deal Tracker**: Manage your pipeline of offers and negotiations  
- **Developer Network**: Maintain contacts and track successful sales
- **Profit Analysis**: Calculate potential returns on each deal

## 💡 Your Investment Strategy

Perfect for the strategy you described:
1. Find property owners who owe back taxes
2. Make low offers (e.g., $12k on $20k land)
3. Flip to developers for $14k+ 
4. Profit $2k+ per deal

## 📋 Example Workflow

### Web Interface:
1. Open http://localhost:5000
2. Navigate to "Property Research"
3. Search for opportunities in your city
4. Use the "Calculate" button to analyze deals
5. Click "Offer" to make an offer
6. Track progress in the "Deals" section

### Command Line:
```bash
# 1. Research properties
python main.py research --city "Los Angeles"

# 2. Calculate offer for a $20k property
python main.py calculate-offer property_123 --market-value 20000
# → Suggests ~$12,000 offer

# 3. Make the offer
python main.py make-offer property_123 12000 --notes "Quick cash close"

# 4. Track the deal
python main.py list-deals

# 5. Add developer contacts
python main.py add-developer --name "Dev Corp" --email "deals@dev.com"

# 6. Update when sold
python main.py update-deal 1 sold
```

## 🛠️ Installation

```bash
# Clone/download to your workspace
pip install -r requirements.txt
python main.py setup
```

## 📁 Project Structure

- `main.py` - CLI application
- `example.py` - Quick test script
- `start_web.py` - Web launcher
- `web/` - Web interface:
  - `app.py` - Flask application
  - `templates/` - HTML templates
  - `static/` - CSS/JS assets
- `src/` - Core modules:
  - `property_research.py` - Find tax delinquent properties
  - `offer_calculator.py` - Calculate strategic offers
  - `deal_tracker.py` - Manage deal pipeline
  - `developer_contacts.py` - Developer relationship management
- `data/` - SQLite databases for storing data
- `config/` - Configuration settings

## ⚙️ Configuration

Edit `config/settings.py` to customize:
- Target profit margins (default: 35% below market)
- Transaction costs
- Minimum profit requirements
- Search parameters

## 📖 Advanced Usage

See `ADVANCED_GUIDE.md` for detailed workflows and customization options.

## 🔄 Next Steps

This is a foundational tool. To make it production-ready:
1. Integrate with real county tax records APIs
2. Add automated property monitoring
3. Connect to MLS data feeds
4. Implement email notifications
5. Add market analysis features

The current version provides the framework and workflow - you can enhance it as needed for your specific market and requirements.

## 🌟 Features Overview

| Feature | Web Interface | CLI |
|---------|---------------|-----|
| Property Search | ✅ Interactive form | ✅ Command line |
| Offer Calculator | ✅ Real-time calculator | ✅ Basic calculator |
| Deal Tracking | ✅ Visual dashboard | ✅ List commands |
| Developer Management | ✅ Contact forms | ✅ Add/list commands |
| Data Visualization | ✅ Charts & metrics | ❌ Text only |
| User Experience | ✅ Point & click | ⚠️ Technical users |
# python_postgres_reactjs_real_estate
