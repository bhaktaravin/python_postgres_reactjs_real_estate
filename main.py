#!/usr/bin/env python3
"""
Real Estate Investment Tool
Main CLI application for managing property deals and developer relationships.
"""

import click
import sys
import os
from pathlib import Path

# Add src directory to path
sys.path.append(str(Path(__file__).parent / "src"))

from property_research import PropertyResearcher
from tax_analysis import TaxAnalyzer
from offer_calculator import OfferCalculator
from deal_tracker import DealTracker
from developer_contacts import DeveloperManager

@click.group()
def cli():
    """Real Estate Investment Tool - Find tax delinquent properties and flip to developers."""
    pass

@cli.command()
@click.option('--address', help='Property address to research')
@click.option('--city', help='City to search in')
@click.option('--state', default='CA', help='State abbreviation (default: CA)')
def research(address, city, state):
    """Research properties for investment opportunities."""
    researcher = PropertyResearcher()
    
    if address:
        click.echo(f"Researching property: {address}")
        result = researcher.research_property(address, city, state)
        click.echo(f"Property details: {result}")
    elif city:
        click.echo(f"Searching for opportunities in {city}, {state}")
        opportunities = researcher.find_tax_delinquent_properties(city, state)
        click.echo(f"Found {len(opportunities)} potential opportunities")
        for prop in opportunities[:5]:  # Show first 5
            click.echo(f"  - {prop}")
    else:
        click.echo("Please provide either --address or --city")

@cli.command()
@click.argument('property_id')
@click.option('--market-value', type=float, help='Estimated market value')
@click.option('--target-margin', type=float, default=0.4, help='Target profit margin (default: 40%)')
def calculate_offer(property_id, market_value, target_margin):
    """Calculate offer amount for a property."""
    calculator = OfferCalculator()
    
    if not market_value:
        click.echo("Please provide --market-value")
        return
    
    offer_amount = calculator.calculate_offer(market_value, target_margin)
    profit_estimate = calculator.estimate_profit(market_value, offer_amount)
    
    click.echo(f"Property ID: {property_id}")
    click.echo(f"Market Value: ${market_value:,.2f}")
    click.echo(f"Recommended Offer: ${offer_amount:,.2f}")
    click.echo(f"Estimated Profit: ${profit_estimate:,.2f}")

@cli.command()
@click.argument('property_id')
@click.argument('offer_amount', type=float)
@click.option('--notes', help='Additional notes about the deal')
def make_offer(property_id, offer_amount, notes):
    """Record a new offer for a property."""
    tracker = DealTracker()
    
    deal_id = tracker.create_deal(property_id, offer_amount, notes)
    click.echo(f"Created deal #{deal_id} - Offer of ${offer_amount:,.2f} for property {property_id}")

@cli.command()
def list_deals():
    """List all active deals."""
    tracker = DealTracker()
    deals = tracker.get_active_deals()
    
    if not deals:
        click.echo("No active deals found.")
        return
    
    click.echo("Active Deals:")
    click.echo("-" * 60)
    for deal in deals:
        status_color = 'green' if deal['status'] == 'accepted' else 'yellow'
        click.echo(f"Deal #{deal['id']}: {deal['property_id']} - ", nl=False)
        click.secho(f"${deal['offer_amount']:,.2f}", fg=status_color, nl=False)
        click.echo(f" [{deal['status']}]")

@cli.command()
@click.argument('deal_id', type=int)
@click.argument('status', type=click.Choice(['pending', 'accepted', 'rejected', 'sold']))
def update_deal(deal_id, status):
    """Update the status of a deal."""
    tracker = DealTracker()
    tracker.update_deal_status(deal_id, status)
    click.echo(f"Updated deal #{deal_id} status to: {status}")

@cli.command()
@click.option('--name', required=True, help='Developer name')
@click.option('--email', help='Email address')
@click.option('--phone', help='Phone number')
@click.option('--specialty', help='Development specialty (residential, commercial, etc.)')
def add_developer(name, email, phone, specialty):
    """Add a new developer contact."""
    manager = DeveloperManager()
    dev_id = manager.add_developer(name, email, phone, specialty)
    click.echo(f"Added developer: {name} (ID: {dev_id})")

@cli.command()
def list_developers():
    """List all developer contacts."""
    manager = DeveloperManager()
    developers = manager.get_all_developers()
    
    if not developers:
        click.echo("No developers found.")
        return
    
    click.echo("Developer Contacts:")
    click.echo("-" * 60)
    for dev in developers:
        click.echo(f"{dev['name']} - {dev['email'] or 'No email'} - {dev['phone'] or 'No phone'}")
        if dev['specialty']:
            click.echo(f"  Specialty: {dev['specialty']}")

@cli.command()
def setup():
    """Initialize the database and configuration."""
    click.echo("Setting up Real Estate Investment Tool...")
    
    # Initialize database
    tracker = DealTracker()
    tracker.init_database()
    
    manager = DeveloperManager()
    manager.init_database()
    
    click.echo("✓ Database initialized")
    click.echo("✓ Setup complete!")
    click.echo("\nTo get started:")
    click.echo("1. Run 'python main.py research --city \"Your City\"' to find opportunities")
    click.echo("2. Use 'python main.py calculate-offer' to analyze deals")
    click.echo("3. Track your offers with 'python main.py make-offer'")

if __name__ == '__main__':
    cli()
