# Architecture

## Technology Stack

- **Frontend Framework**: React 19.2.0 with React Router 7.1.1
- **Build Tool**: Vite 7.2.4 (HMR, fast refresh)
- **Internationalization**: i18next 24.2.1 + react-i18next 15.4.0
- **Styling**: Pure CSS with CSS variables (no preprocessor)
- **Language**: JavaScript (ES6+, no TypeScript)

## Application Structure

### Routing Architecture

The app uses React Router with a layout-wrapper pattern:

```
/ (root) → Navigate to /xiao
├── /xiao          → XiaoPage (Sanfen Sunyi method)
├── /acoustical    → AcousticalPage (Reverse engineering method)
└── /benade        → BenadePage (Benade's formula method)
```

All routes share a common `Layout` component that provides:
- Navigation tabs for switching between calculation methods
- Language selector (FR/EN)
- Consistent page wrapper with branding

### Component Hierarchy

```
App.jsx (Router configuration)
├── Layout.jsx (Navigation + language switcher)
    ├── XiaoPage.jsx
    ├── AcousticalPage.jsx
    │   ├── AlgorithmExplanation.jsx (Collapsible theory section)
    │   ├── MeasurementGuide.jsx (User guidance)
    │   ├── Step1CalculationMethod.jsx
    │   ├── Step2PhysicalMeasurements.jsx
    │   │   └── InputGroup.jsx (×5 inputs)
    │   ├── Step3TargetNotes.jsx
    │   │   ├── InputGroup.jsx (×2 per note)
    │   │   └── MeasureModal.jsx (Measurement dialog)
    │   └── FluteVisualizationModal.jsx (SVG diagram)
    └── BenadePage.jsx
```

### State Management Philosophy

**No global state library** - Pure React patterns:

1. **Local State (useState)**: Component-level UI state (inputs, modal visibility)
2. **Reactive Calculations (useMemo)**: Auto-computed values based on dependencies
3. **Props Drilling**: Parent components pass state + setters to children
4. **No Redux/Context**: App complexity doesn't warrant it

Example from `AcousticalPage.jsx`:
```jsx
// User inputs trigger instant recalculation
const effectiveLength = useMemo(() => 
  calculateEffectiveLength(note1Frequency, temperature, calculationMethod),
  [note1Frequency, temperature, calculationMethod]
)

// Cascading calculations
const targetNotes = useMemo(() => {
  return targetNotesBase.map(note => ({
    ...note,
    position: calculateHolePosition(note.frequency, ...)
  }))
}, [effectiveLength, deltaAverage, targetNotesBase])
```

### Data Flow Pattern

**AcousticalPage Workflow** (Most Complex):

```
Step 1: Method Selection
  ↓ (calculationMethod: 'half-wave' | 'quarter-wave')
  
Step 2: Physical Measurements
  ↓ (physicalLength, innerDiameter, temperature, note1Frequency, note2Frequency)
  ↓ useMemo → effectiveLength
  ↓ useMemo → deltaAverage
  
Step 3: Target Notes
  ↓ (targetNotesBase: Array<{frequency, holeDiameter, isMeasured}>)
  ↓ useMemo → targetNotes (with calculated positions)
  ↓ User clicks "Measure" → MeasureModal opens
  ↓ User enters measured values
  ↓ recalculatePositionsAfterMeasurement()
  ↓ All following notes shift automatically
```

**Key Insight**: No "Calculate" buttons - all values update instantly on input change via `useMemo` dependencies.

## Calculation Engine (`src/utils/calculations.js`)

Pure functions implementing acoustic physics:

### Core Functions

- `calculateSpeedOfSound(temperature)`: Temperature-corrected sound velocity
- `calculateEffectiveLength(frequency, temp, method)`: Resonant tube length
- `calculateDeltaFromTwoNotes(...)`: End correction from two measured frequencies
- `calculateHolePosition(...)`: Hole placement from target frequency
- `recalculatePositionsAfterMeasurement(...)`: Cascading corrections after real measurements

### Two Calculation Modes

1. **Half-Wave (Open Tube)**: Both ends open, λ/2 resonance
2. **Quarter-Wave (Closed Tube)**: One end closed, λ/4 resonance

Mode affects:
- Effective length formula
- Delta (end correction) multiplier
- Maximum number of holes (10 vs 7)

## Styling Architecture

### Theme System

CSS variables in `src/index.css`:
```css
:root {
  --wood-dark: #5d4a37;    /* Headers, borders */
  --wood-medium: #6d5738;  /* Labels, accents */
  --parchment: #f5e6d3;    /* Page background */
  --ink: #3e2723;          /* Text */
}
```

**Calculated values**: `#e8dcc8` (beige)  
**Input backgrounds**: `#fffcf7` (cream)  
**Borders**: `#d4b896` (tan)

### Component Styling Strategy

- **Global styles**: `src/index.css` (reset, typography, `.input-group`, `.calculate-button`)
- **Component CSS**: Only for complex components (`MeasureModal.css`, `MeasurementGuide.css`)
- **Inline styles**: Preferred for dynamic/hover states (buttons, modals)

### InputGroup Pattern

Reusable component for all numeric inputs with inline units:

```jsx
<InputGroup label={t('step2_lphys')} hint={t('hint')} unit="mm">
  <input 
    type="number" 
    value={physicalLength}
    style={{ paddingRight: '35px' }} // Space for unit
  />
</InputGroup>
```

**Unit positioning**: Absolute position inside input (right: 0, top: 50%, transform: translateY(-50%))  
**Width behavior**: Clone input with `width: 100%, boxSizing: border-box`

## Internationalization

### Storage & Fallback

- **Storage**: `localStorage.getItem('flute-calc-language')` 
- **Default**: French (`'fr'`)
- **Supported**: French, English

### Translation Key Conventions

```
step1_*         → Step 1 (calculation method selection)
step2_*         → Step 2 (physical measurements)
step3_*         → Step 3 (target notes configuration)
measure_modal_* → Measurement dialog
algo_*          → Algorithm explanations
```

**Critical Rule**: No units in translation strings (handled by `InputGroup` `unit` prop)

Example:
```json
// ❌ Wrong
"step2_lphys": "Physical Length (mm)"

// ✅ Correct  
"step2_lphys": "Physical Length"
```

## File Structure

```
src/
├── components/
│   ├── AcousticalSteps/       # Multi-step wizard components
│   │   ├── Step1CalculationMethod.jsx
│   │   ├── Step2PhysicalMeasurements.jsx
│   │   └── Step3TargetNotes.jsx
│   ├── InputGroup/            # Reusable input with inline units
│   ├── MeasureModal/          # Measurement dialog
│   ├── MeasurementGuide/      # User guidance (collapsible)
│   ├── AlgorithmExplanation/  # Theory explanations
│   ├── FluteVisualizationModal/ # SVG flute diagram
│   ├── LanguageSelector/      # FR/EN switcher
│   └── Layout/                # Navigation wrapper
├── pages/                     # Route-level components
│   ├── XiaoPage.jsx
│   ├── AcousticalPage.jsx
│   └── BenadePage.jsx
├── utils/
│   ├── calculations.js        # Acoustic physics formulas
│   ├── fluteDrawing.js        # SVG generation
│   └── models.js              # Xiao traditional scales
├── i18n/
│   ├── i18n.js                # i18next config
│   └── locales/
│       ├── en.json            # English translations
│       └── fr.json            # French translations
├── App.jsx                    # Router setup
├── main.jsx                   # React DOM render
├── index.css                  # Global styles + theme
└── App.css                    # App-level styles

old/                           # Original vanilla JS version (reference only)
```

## Build & Development

### Vite Configuration

- **Dev server**: Port 5173 (default)
- **HMR**: Fast Refresh enabled via `@vitejs/plugin-react`
- **Build output**: `dist/` folder

### Browser Compatibility

- Modern browsers (ES6+ required)
- No legacy polyfills
- CSS Grid & Flexbox assumed

### Known Constraints

- **React 19 only**: No backwards compatibility
- **No TypeScript**: Pure JavaScript codebase
- **Position calculations**: Always from blowing edge (not bottom)
- **Chromatic scale**: 0-indexed (0=C, 1=C#, ..., 11=B)
