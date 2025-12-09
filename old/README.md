# Flute Crafting Calculator 🎵

A beautiful single-page web application for calculating precise hole positions when crafting wooden flutes. This tool provides three different calculation methods, each with detailed explanations of the algorithms used.

## Features

- **Three Calculation Methods:**
  - **Xiao Flute - Sanfen Sunyi Method (三分损益法)** - Ancient Chinese method for calculating musical intervals with acoustic corrections, perfect for crafting Xiao flutes
  - **Acoustical Physics Method** - Uses fundamental acoustic principles with speed of sound calculations
  - **Benade's Formula** - Advanced method by physicist Arthur Benade for professional instrument making

- **Interactive Interface:**
  - Tabbed navigation for easy switching between methods
  - Input parameters specific to each algorithm
  - Real-time calculation results displayed in organized tables
  - Detailed algorithm explanations with formulas

- **Warm, Crafting-Themed Design:**
  - Beautiful gradient backgrounds with earthy tones
  - Serif fonts for a traditional, artisanal feel
  - Smooth animations and transitions
  - Responsive layout for different screen sizes

## How to Use

1. Open `index.html` in any modern web browser
2. Select one of the three calculation methods from the tabs
3. Read the algorithm explanation to understand how it works
4. Enter your flute parameters (length, diameter, etc.)
5. Click "Calculate Positions" to see the results
6. The table will show hole positions, distances, and notes

## Calculation Methods Explained

### Xiao Flute - Sanfen Sunyi Method (三分损益法)
Perfect for traditional Chinese flutes. Uses the ancient Sanfen Sunyi (三分损益法) mathematical method - "divide into three parts, lose/gain one" - to create beautiful pentatonic scales. Start with your bamboo's base frequency in Hz, then choose intervals for each hole. Includes acoustic correction based on temperature and bore diameter.

### Acoustical Physics Method
More accurate for precise tuning. Uses the relationship between frequency, speed of sound, and effective length. Accounts for temperature effects and end corrections.

### Benade's Formula
Most accurate method for professional use. Considers hole diameter relative to bore diameter, acoustic impedance, wall thickness (chimney effect), and coupling between holes.

## Technical Details

- **Pure HTML/CSS/JavaScript** - No dependencies, no build process
- **Single-page application** - Everything in one file for easy deployment
- **Responsive design** - Works on desktop, tablet, and mobile
- **Modern browser support** - Uses CSS Grid, Flexbox, and ES6+ JavaScript

## Deployment

Simply serve the `index.html` file using any web server:

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server)
npx http-server

# Or open directly in browser
open index.html
```

Then navigate to `http://localhost:8000` in your web browser.

## Screenshots

The application features a warm, wood-toned design with three distinct tabs for different calculation algorithms. Each tab includes detailed explanations, input parameters, and results tables.

## License

Open source for flute makers worldwide 🌿