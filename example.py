#!/usr/bin/env python3
"""
Simple example script to test the real estate investment tool
"""

import sys
from pathlib import Path

# Add src directory to path
sys.path.append(str(Path(__file__).parent / "src"))

from property_research import PropertyResearcher
from offer_calculator import OfferCalculator
from deal_tracker import DealTracker
from developer_contacts import DeveloperManager

def main():
    print("🏠 Real Estate Investment Tool - Quick Test")
    print("=" * 50)
    
    # Initialize components
    researcher = PropertyResearcher()
    calculator = OfferCalculator()
    tracker = DealTracker()
    dev_manager = DeveloperManager()
    
    # Test property research
    print("\n1. Testing Property Research...")
    properties = researcher.find_tax_delinquent_properties("Los Angeles", "CA", limit=3)
    print(f"   Found {len(properties)} sample properties")
    
    if properties:
        prop = properties[0]
        print(f"   Sample property: {prop['address']}")
        print(f"   Market value: ${prop['market_value']:,.2f}")
        print(f"   Tax owed: ${prop['tax_amount_owed']:,.2f}")
        
        # Test offer calculation
        print("\n2. Testing Offer Calculation...")
        offer = calculator.calculate_offer(prop['market_value'], tax_owed=prop['tax_amount_owed'])
        profit = calculator.estimate_profit(prop['market_value'], offer)
        print(f"   Recommended offer: ${offer:,.2f}")
        print(f"   Estimated profit: ${profit:,.2f}")
        
        # Test deal tracking
        print("\n3. Testing Deal Tracking...")
        deal_id = tracker.create_deal(prop['address'], offer, "Test deal from example")
        print(f"   Created deal #{deal_id}")
        
        # Show deal stats
        stats = tracker.get_deal_stats()
        print(f"   Total deals in system: {stats['total_deals']}")
    
    # Test developer management
    print("\n4. Testing Developer Management...")
    dev_id = dev_manager.add_developer(
        name="Test Developer LLC", 
        email="test@developer.com",
        specialty="Residential"
    )
    print(f"   Added developer with ID: {dev_id}")
    
    developers = dev_manager.get_all_developers()
    print(f"   Total developers: {len(developers)}")
    
    print("\n✅ All tests completed successfully!")
    print("\nNext steps:")
    print("1. Run 'python main.py research --city \"Your City\"' to find real opportunities")
    print("2. Use 'python main.py --help' to see all available commands")
    print("3. Customize the configuration in config/settings.py")

if __name__ == "__main__":
    main()
