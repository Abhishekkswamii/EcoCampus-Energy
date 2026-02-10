# 🌱 Smart Campus Energy Monitor

**Hackathon Project: SDG 7 – Affordable & Clean Energy**

A frontend-only decision-making assistant that turns raw campus energy data into actionable insights for facility managers.

## 🚀 Quick Start

```bash
cd smart-campus-energy
npm install
npm run dev
```

Visit: **http://localhost:5173/**

## 📊 What's Built

### ✅ Phase 1: Setup + Data (COMPLETE)
- Vite + React + Tailwind CSS configured
- Realistic dummy energy data generator (30 days, hourly granularity)
- Campus structure: 4 buildings, 17 rooms
- Automatic spike and after-hours pattern injection

### ✅ Phase 2: Dashboard Layout (COMPLETE)
- Clean, professional UI with green energy theme
- Header with notification bell
- View selector (Hourly/Daily/Weekly/Monthly)
- Location selector (Campus/Building/Room levels)

### ✅ Phase 3: Charts (COMPLETE)
- **Recharts** integration
- Line and bar chart support
- Responsive design
- Custom tooltips with formatted data
- Automatic data aggregation per view

### ✅ Phase 4: Detection + Alerts (COMPLETE)
- **Rule-based spike detection** (>150% of average)
- **After-hours usage detection** (6 PM - 6 AM)
- **Wasteful pattern detection** (consistent night usage)
- Color-coded severity (high/medium/low)
- Alert cards with timestamp and location

### ✅ Phase 5: Insights + Summary (COMPLETE)
- **Actionable tips** based on detected patterns
- Location-specific recommendations (labs, hostels, lecture halls)
- **Decision Summary Panel** with:
  - Total/average/peak consumption
  - Peak hour identification
  - Potential savings calculator
  - Top 3 recommendations
- Cost savings estimation ($0.15/kWh)

### ✅ Phase 6: Polish + Notifications (COMPLETE)
- Notification bell with red badge
- Dropdown notification panel
- Real-time alert count
- Smooth animations and transitions
- Responsive design for all screen sizes

## 🎯 Core Features

### 1. Multi-Level Energy Visualization
- **Campus View**: Entire university consumption
- **Building View**: Per-building breakdown
- **Room View**: Individual room monitoring

### 2. Time-Based Analysis
- **Hourly**: Last 24 hours
- **Daily**: Last 7 days
- **Weekly**: Last 4 weeks
- **Monthly**: Last 3 months

### 3. Smart Detection (Rule-Based)
- Spike alerts when consumption exceeds 150% of average
- After-hours alerts for usage between 6 PM - 6 AM
- Persistent wasteful patterns (idle equipment)

### 4. Actionable Insights
- 💡 General energy-saving tips
- ⚠️ Alert-specific recommendations
- 📊 Peak load management strategies
- 💰 Cost savings opportunities
- 🔬 Location-specific advice

### 5. Decision Summary
- Quick stats: Total, Average, Peak
- Savings calculator (energy + cost)
- Top 3 prioritized recommendations
- 15-25% reduction potential

## 🏗️ Project Structure

```
smart-campus-energy/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main orchestrator
│   │   ├── Header.jsx              # App header + notification bell
│   │   ├── EnergyChart.jsx         # Recharts visualization
│   │   ├── ViewSelector.jsx        # Time view switcher
│   │   ├── LocationSelector.jsx    # Campus/Building/Room picker
│   │   ├── AlertCard.jsx           # Alert display
│   │   ├── InsightPanel.jsx        # Tips & recommendations
│   │   ├── SummaryPanel.jsx        # Decision summary
│   │   └── NotificationBell.jsx    # Alert dropdown
│   ├── data/
│   │   ├── energyData.js           # Data generator + aggregators
│   │   └── campusStructure.js      # Buildings & rooms
│   ├── utils/
│   │   ├── detectionLogic.js       # Anomaly detection rules
│   │   └── insightsEngine.js       # Insight generation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🧠 How Detection Works

### Spike Detection
```javascript
// Threshold: 150% of average consumption
if (consumption > average * 1.5) {
  alert('SPIKE');
}
```

### After-Hours Detection
```javascript
// High usage during 6 PM - 6 AM
if (hour >= 18 || hour < 6) {
  if (consumption > daytimeAvg * 0.4) {
    alert('AFTER_HOURS');
  }
}
```

### Wasteful Pattern
```javascript
// Consistent high night usage (10 PM - 6 AM)
if (avgNightConsumption > 30 kWh) {
  alert('WASTEFUL_PATTERN');
}
```

## 📈 Sample Data Patterns

**Engineering Lab**: 120 kWh base, 80-100% usage 8 AM-6 PM  
**Hostel Floor**: 180 kWh base, 40-60% evening usage  
**Lecture Hall**: 80 kWh base, peaks 10 AM-4 PM  
**Library**: 60 kWh base, consistent 8 AM-10 PM

## 🎨 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 2 |
| Language | JavaScript (ES6+) |

## 💡 Key Design Decisions

1. **Frontend-Only**: No backend complexity, perfect for hackathon demo
2. **Rule-Based Logic**: Simple, explainable, no ML black box
3. **Realistic Data**: Patterns include weekends, spikes, after-hours usage
4. **Judge-Friendly**: Clear visualizations, easy-to-understand insights
5. **SDG Alignment**: Focus on actionable savings, not just monitoring

## 🌟 Demo Flow

1. **Start at Campus View** → See total university consumption
2. **Switch to Daily View** → Spot consumption trends
3. **Notice Alerts** → Red notification badge appears
4. **Click Building: "Student Hostel A"** → See building-level breakdown
5. **Review Alerts** → "High after-hours usage detected"
6. **Check Insights** → Get actionable tips
7. **See Summary** → "Potential 18% savings, $2,340/month"

## 🏆 Hackathon Pitch Points

✅ **Problem**: Universities waste 20-30% energy due to poor visibility  
✅ **Solution**: Real-time insights + actionable recommendations  
✅ **Impact**: 15-25% consumption reduction = significant cost savings  
✅ **Innovation**: Decision assistant, not just a dashboard  
✅ **Scalability**: Works for any multi-building campus  
✅ **SDG 7**: Directly contributes to clean energy goals  

## 🚀 Future Enhancements (Post-Hackathon)

- Real sensor integration (IoT devices)
- Historical comparison (year-over-year)
- Carbon footprint calculator
- Export reports (PDF/Excel)
- Email alerts for critical spikes
- Mobile responsive enhancements
- Multi-campus support

---

## 📝 Notes for Judges

**Why This Matters**:  
Energy costs are the 2nd largest expense for universities (after salaries). This tool helps facility managers:
- Identify waste in real-time
- Make data-driven decisions
- Reduce bills by 15-25%
- Meet sustainability goals

**What Makes It Smart**:  
Not just graphs — it tells you **what's wrong**, **why it matters**, and **what to do**.

Built with ❤️ for SDG 7 at the 12-hour hackathon
