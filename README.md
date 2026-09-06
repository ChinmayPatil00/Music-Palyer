# WanderX — Adventure Intelligence & Precision Trip Planner

> Built for trekkers, motorcyclists, road-trippers, backpackers, wildlife lovers, and budget-conscious explorers across India and around the world.

![WanderX Interface](https://img.shields.io/badge/WanderX-Production_Ready-emerald) ![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_3.4-teal) ![Leaflet Maps](https://img.shields.io/badge/Maps-Leaflet_OpenStreetMap-green)

---

## 🧭 Overview

**WanderX** is a modern adventure discovery and trip-planning web platform designed to eliminate the guesswork from budget travel and high-altitude exploration. Users input their origin, destination (or choose "Find destinations for me"), dates, headcount, funds, transport modes, and travel styles. 

The platform then calculates:
- Ranked AI recommendations with a 5-factor **Match Score** (Budget, Adventure, Season, Difficulty, Travel Time)
- **"Plan With My Budget"** (5 specialized result buckets: Best Match, Cheapest Option, Most Adventurous, Most Scenic, Hidden Gem)
- Dedicated **Overland Road Trip Planner** with fuel burn and toll calculators
- **Motorcycle Expedition Planner** with riding gear checklists, spare parts, and mechanic locators
- **Trekking Hub** with interactive SVG Elevation Profile graphs, AMS altitude risk warnings, and packing checklists
- **Jungle Safaris & Tiger Reserves** with wildlife checklists, booking seasons, and core zone guides
- **Interactive Leaflet Route Maps** with category filters (Stays, Food, Fuel, Emergency)
- **Day-by-Day Itinerary Builder & Editor** with draggable activities, itemized expense breakdowns, and clean PDF / Print export
- **Active Safety Dossier** with verified emergency hotlines (112, 108), nearest medical centres, and police stations
- **User & Admin Command Dashboards** with live analytics and content management

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation & Local Run

```bash
# 1. Clone or navigate to the repository
cd cyberdash_repo

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Or build and launch production server
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Maps**: Leaflet + OpenStreetMap with custom SVG markers and polyline routing
- **Visualizations**: Custom SVG Elevation Profile visualizer, budget utilization meters
- **State Management**: Client reactive state with `localStorage` persistence and Supabase integration ready
- **API Endpoints**:
  - `GET /api/destinations` — Filter and search destinations
  - `POST /api/recommendations` — 5-factor AI ranking engine
  - `GET /api/budget-match` — 5-tier budget matcher
  - `POST /api/itinerary/generate` — Dynamic timetable generation
  - `GET /api/weather` — Meteorological warnings & adventure safety

---

## 📱 Core Pages

- `/` — Premium Landing Page with Hero Planning Card
- `/plan` — 10-Step Multi-Stage Trip Planning Wizard
- `/budget-finder` — "Where Can I Travel With ₹10,000?"
- `/explore` — 16 Adventure Categories Directory
- `/road-trips` — Overland Route Planner & Fuel Estimator
- `/bike-trips` — Motorcycle Expeditions & Riding Gear Hub
- `/treks` & `/treks/[slug]` — Treks Directory & SVG Elevation Profiles
- `/safaris` — Wildlife & Tiger Reserves Hub
- `/destinations/india` — Regional India Discovery (North, South, Western Ghats, Coastal, etc.)
- `/destinations/international` — Affordable Global Expeditions
- `/destinations/[slug]` — Destination Deep Dive with Weather, Stays & Safety
- `/itinerary/generate` — Interactive Itinerary Customizer & Cost Calculator
- `/dashboard` — User Dashboard (My Trips, Wishlist, Preferences)
- `/admin` — Admin Command Center (Analytics & CRUD Tables)

---

## 🛡️ License

ISC License. Built for explorers and travellers.
