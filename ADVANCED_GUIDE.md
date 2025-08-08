# Advanced Features Guide

## Real Estate Investment Workflow

### 1. Research Phase
```bash
# Find tax delinquent properties in a city
python main.py research --city "Your City" --state "CA"

# Research a specific property
python main.py research --address "123 Main St" --city "Your City"
```

### 2. Analysis Phase
```bash
# Calculate offer for a property
python main.py calculate-offer PROPERTY_ID --market-value 25000 --target-margin 0.4

# Example with your 20k land scenario:
python main.py calculate-offer land_123 --market-value 20000 --target-margin 0.4
# This would suggest an offer around $12,000 (40% below market)
```

### 3. Deal Management
```bash
# Make an offer
python main.py make-offer PROPERTY_ID 12000 --notes "Quick cash close"

# Update deal status
python main.py update-deal 1 accepted

# List all active deals
python main.py list-deals
```

### 4. Developer Network
```bash
# Add developer contacts
python main.py add-developer --name "ABC Development" --email "deals@abc.com" --phone "555-1234" --specialty "Residential"

# List developers
python main.py list-developers
```

## Your Workflow Example

Based on your description, here's how you'd use this tool:

1. **Find Properties**: 
   ```bash
   python main.py research --city "Los Angeles"
   ```

2. **Analyze a $20k property**:
   ```bash
   python main.py calculate-offer lot_456 --market-value 20000
   # Suggests offer: ~$12,000
   ```

3. **Make the offer**:
   ```bash
   python main.py make-offer lot_456 12000 --notes "Cash offer, 7-day close"
   ```

4. **When accepted, find a developer**:
   ```bash
   python main.py list-developers
   # Contact developer, negotiate sale for $14,000
   ```

5. **Record the sale**:
   ```python
   # In Python console or custom script:
   from src.deal_tracker import DealTracker
   tracker = DealTracker()
   tracker.record_sale(deal_id=1, developer_name="XYZ Development", sale_price=14000)
   ```

## Profit Calculation

The tool automatically calculates:
- **Purchase price**: Your offer (e.g., $12,000)
- **Transaction costs**: ~5% of market value
- **Holding costs**: ~0.2% per month
- **Sale price**: To developer (e.g., $14,000)
- **Net profit**: ~$2,000 in your example

## Customization

Edit `config/settings.py` to adjust:
- Target profit margins
- Transaction cost percentages
- Minimum deal criteria
- Search parameters

## Database Files

The tool creates SQLite databases in the `data/` directory:
- `properties.db`: Property research data
- `deals.db`: Your deal pipeline
- `developers.db`: Developer contacts

## Next Steps for Real Implementation

To make this production-ready:

1. **Integrate real data sources**:
   - County tax assessor websites
   - MLS data feeds
   - Public records APIs

2. **Add automation**:
   - Scheduled property searches
   - Email notifications
   - Automated offer generation

3. **Enhance analysis**:
   - Market comparables
   - Neighborhood analysis
   - ROI calculations

4. **Improve developer matching**:
   - Property type preferences
   - Deal size requirements
   - Location preferences
