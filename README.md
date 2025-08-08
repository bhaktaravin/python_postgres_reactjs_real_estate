# Real Estate Investment Tool - React Frontend

A modern React-based frontend for the Real Estate Investment Tool, built with Material-UI components and designed to work with the Flask backend API.

## Features

- **Dashboard**: Overview of deals, statistics, and recent activities
- **Property Research**: Search and analyze tax delinquent properties
- **Offer Calculator**: Interactive calculator for determining optimal offer amounts
- **Deals Management**: Track and manage property deal pipeline
- **Developer Network**: Manage relationships with developers and buyers

## Technology Stack

- **React 18** - UI framework
- **Material-UI (MUI)** - Component library and design system
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and development server

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Flask backend running on port 5000

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The React app will be available at `http://localhost:3000`

### Development with Backend

To run both frontend and backend together:

```bash
# From project root
./start_dev.sh
```

This will start:
- Flask backend on `http://localhost:5000`
- React frontend on `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx     # Dashboard overview
│   │   ├── PropertyResearch.jsx  # Property search
│   │   ├── OfferCalculator.jsx   # Offer calculator
│   │   ├── Deals.jsx            # Deals management
│   │   └── Developers.jsx       # Developer network
│   ├── services/         # API service layer
│   │   └── api.js           # API client and endpoints
│   ├── theme/           # Material-UI theme configuration
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## API Integration

The frontend communicates with the Flask backend through a service layer (`src/services/api.js`) that provides:

- **Dashboard API**: Statistics and overview data
- **Properties API**: Property search and details
- **Deals API**: Deal creation and management
- **Developers API**: Developer network management
- **Calculator API**: Offer calculation logic

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting

## Development Notes

- The app uses Material-UI's built-in theming system
- API calls include error handling and loading states
- Components are designed to be responsive and accessible
- CORS is configured in the Flask backend to allow requests from `localhost:3000`

## Business Logic

The frontend implements the core real estate investment workflow:

1. **Research Phase**: Search for tax delinquent properties in target markets
2. **Analysis Phase**: Calculate optimal offer amounts (typically 40-60% below market value)
3. **Deal Management**: Track offers, negotiations, and outcomes
4. **Network Building**: Maintain relationships with developers for quick sales
5. **Profit Tracking**: Monitor deal performance and ROI

Target profit margin: $2,000-$5,000 per deal through quick flips to developers.
