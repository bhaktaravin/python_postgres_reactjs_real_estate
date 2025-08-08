#!/usr/bin/env python3
"""
Launch the Real Estate Investment Tool Web Interface
"""

import os
import sys
from pathlib import Path

# Change to web directory
web_dir = Path(__file__).parent / "web"
os.chdir(web_dir)

# Add parent directory to Python path for imports
sys.path.insert(0, str(Path(__file__).parent))

# Import and run the Flask app
from web.app import app

if __name__ == "__main__":
    print("🏠 Starting Real Estate Investment Tool Web Interface...")
    print("📍 Open your browser to: http://localhost:5000")
    print("⏹️  Press Ctrl+C to stop the server")
    print()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
