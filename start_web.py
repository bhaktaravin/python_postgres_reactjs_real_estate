#!/usr/bin/env python3
"""
Simple launcher for the web application
"""

import os
import subprocess
import sys

# Change to project root
project_root = os.path.dirname(os.path.abspath(__file__))
os.chdir(project_root)

# Set PYTHONPATH
env = os.environ.copy()
env['PYTHONPATH'] = f"{project_root}/src:{env.get('PYTHONPATH', '')}"

print("🏠 Starting Real Estate Investment Tool Web Interface...")
print("📍 Open your browser to: http://localhost:5000")
print("⏹️  Press Ctrl+C to stop the server")
print()

# Run the Flask app
subprocess.run([
    f"{project_root}/.venv/bin/python", 
    "web/app.py"
], env=env)
